-- ============================================
-- ПОЛНЫЙ СКРИПТ ВОССТАНОВЛЕНИЯ SUPABASE
-- Проект: Афиша Иркутска (afisha_genspark)
-- Дата создания: 2026-03-15
-- ============================================
-- 
-- ВАЖНО: Выполнять скрипт последовательно, блок за блоком
-- Этот скрипт восстанавливает:
-- 1. Расширения PostgreSQL
-- 2. Базовые функции и триггеры
-- 3. Все таблицы с индексами
-- 4. RLS политики
-- 5. Триггеры для автоматизации
-- 6. Начальные данные (категории)
--
-- ============================================

-- ============================================
-- РАЗДЕЛ 1: РАСШИРЕНИЯ
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- для полнотекстового поиска

-- ============================================
-- РАЗДЕЛ 2: БАЗОВЫЕ ФУНКЦИИ
-- ============================================

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- РАЗДЕЛ 3: ТАБЛИЦЫ
-- ============================================

-- --------------------------------------------
-- 3.1 ТАБЛИЦА: profiles (Профили пользователей)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'expert', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Функция для создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер на создание пользователя
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------
-- 3.2 ТАБЛИЦА: categories (Категории)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  featured_on_hero BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories(featured_on_hero);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------
-- 3.3 ТАБЛИЦА: communities (Сообщества)
-- --------------------------------------------

-- Создаем enum тип для статусов сообщества
DO $$ BEGIN
  CREATE TYPE community_status AS ENUM ('draft', 'pending_moderation', 'published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  location TEXT,
  members_count INTEGER DEFAULT 0,
  social_links JSONB DEFAULT '{}',
  gallery_images TEXT[] DEFAULT '{}',
  
  -- Расширенные поля
  target_audience TEXT[] DEFAULT '{}',
  wishes TEXT[] DEFAULT '{}',
  age_category TEXT,
  age_categories TEXT[] DEFAULT '{}',
  community_category TEXT,
  page_content JSONB DEFAULT '{}',
  photo_albums JSONB DEFAULT '[]',
  
  -- Контактная информация
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Статусы
  status community_status DEFAULT 'draft',
  is_published BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для communities
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
CREATE INDEX IF NOT EXISTS idx_communities_owner ON communities(owner_id);
CREATE INDEX IF NOT EXISTS idx_communities_category ON communities(category_id);
CREATE INDEX IF NOT EXISTS idx_communities_published ON communities(is_published);
CREATE INDEX IF NOT EXISTS idx_communities_status ON communities(status);
CREATE INDEX IF NOT EXISTS idx_communities_deleted_at ON communities(deleted_at) WHERE deleted_at IS NULL;

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_communities_updated_at ON communities;
CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON communities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------
-- 3.4 ТАБЛИЦА: experts (Эксперты)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  specialization TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  experience_years INTEGER DEFAULT 0,
  achievements TEXT[] DEFAULT '{}',
  services JSONB DEFAULT '[]',
  pricing JSONB DEFAULT '{}',
  location TEXT,
  social_links JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для experts
CREATE INDEX IF NOT EXISTS idx_experts_slug ON experts(slug);
CREATE INDEX IF NOT EXISTS idx_experts_profile ON experts(profile_id);
CREATE INDEX IF NOT EXISTS idx_experts_rating ON experts(rating DESC);
CREATE INDEX IF NOT EXISTS idx_experts_active ON experts(is_active);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_experts_updated_at ON experts;
CREATE TRIGGER update_experts_updated_at
  BEFORE UPDATE ON experts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------
-- 3.5 ТАБЛИЦА: events (События)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  
  -- Организатор
  organizer_name TEXT NOT NULL,
  organizer_avatar TEXT,
  organizer_type TEXT CHECK (organizer_type IN ('community', 'expert', 'venue', 'individual')),
  
  -- Даты и время
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  
  -- Локация
  location_type TEXT CHECK (location_type IN ('physical', 'online', 'hybrid')),
  venue_name TEXT,
  venue_address TEXT,
  venue_coordinates JSONB,
  online_link TEXT,
  
  -- Цены и билеты
  is_free BOOLEAN DEFAULT false,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  currency TEXT DEFAULT 'RUB',
  ticket_link TEXT,
  
  -- Вместимость
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  
  -- Дополнительно
  tags TEXT[] DEFAULT '{}',
  age_restriction TEXT,
  social_links JSONB DEFAULT '{}',
  gallery_images TEXT[] DEFAULT '{}',
  
  -- Поля фильтрации
  event_type TEXT,
  target_audience TEXT[] DEFAULT '{}',
  wishes TEXT[] DEFAULT '{}',
  age_categories TEXT[] DEFAULT '{}',
  
  -- Статусы
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_cancelled BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  
  -- Статистика
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для events
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_community ON events(community_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events USING btree (event_type);
CREATE INDEX IF NOT EXISTS idx_events_target_audience ON events USING gin (target_audience);
CREATE INDEX IF NOT EXISTS idx_events_wishes ON events USING gin (wishes);
