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
CREATE INDEX IF NOT EXISTS idx_events_age_categories ON events USING gin (age_categories);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------
-- 3.6 ТАБЛИЦА: posts (Публикации)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  category TEXT,
  
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT post_belongs_to_one CHECK (
    (community_id IS NOT NULL AND expert_id IS NULL) OR
    (community_id IS NULL AND expert_id IS NOT NULL)
  )
);

-- Индексы для posts
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_community ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_expert ON posts(expert_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------
-- 3.7 ТАБЛИЦА: favorites (Избранное)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT favorite_one_type CHECK (
    (event_id IS NOT NULL AND community_id IS NULL AND expert_id IS NULL) OR
    (event_id IS NULL AND community_id IS NOT NULL AND expert_id IS NULL) OR
    (event_id IS NULL AND community_id IS NULL AND expert_id IS NOT NULL)
  ),
  
  CONSTRAINT unique_favorite UNIQUE (user_id, event_id, community_id, expert_id)
);

-- Индексы для favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_event ON favorites(event_id);
CREATE INDEX IF NOT EXISTS idx_favorites_community ON favorites(community_id);
CREATE INDEX IF NOT EXISTS idx_favorites_expert ON favorites(expert_id);

-- --------------------------------------------
-- 3.8 ТАБЛИЦА: event_registrations (Регистрации на события)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  ticket_number TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_amount DECIMAL(10,2),
  
  registration_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_registration UNIQUE (event_id, user_id)
);

-- Индексы для event_registrations
CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON event_registrations(status);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_registrations_updated_at ON event_registrations;
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Функция для обновления счетчика registered_count
CREATE OR REPLACE FUNCTION update_event_registered_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events SET registered_count = registered_count + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events SET registered_count = registered_count - 1
    WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_event_registered_count_trigger ON event_registrations;
CREATE TRIGGER update_event_registered_count_trigger
  AFTER INSERT OR DELETE ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_registered_count();

-- --------------------------------------------
-- 3.9 ТАБЛИЦА: reviews (Отзывы)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_review UNIQUE (expert_id, user_id)
);

-- Индексы для reviews
CREATE INDEX IF NOT EXISTS idx_reviews_expert ON reviews(expert_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Функция для обновления рейтинга эксперта
CREATE OR REPLACE FUNCTION update_expert_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE experts
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE expert_id = COALESCE(NEW.expert_id, OLD.expert_id)
      AND is_published = true
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE expert_id = COALESCE(NEW.expert_id, OLD.expert_id)
      AND is_published = true
    )
  WHERE id = COALESCE(NEW.expert_id, OLD.expert_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_expert_rating_trigger ON reviews;
CREATE TRIGGER update_expert_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_expert_rating();

-- --------------------------------------------
-- 3.10 ТАБЛИЦА: community_members (Участники сообществ)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_membership UNIQUE (community_id, user_id)
);

-- Индексы для community_members
CREATE INDEX IF NOT EXISTS idx_members_community ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_members_user ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_role ON community_members(role);

-- Функция для обновления счетчика members_count
CREATE OR REPLACE FUNCTION update_community_members_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities SET members_count = members_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities SET members_count = members_count - 1
    WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_community_members_count_trigger ON community_members;
CREATE TRIGGER update_community_members_count_trigger
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_members_count();

-- --------------------------------------------
-- 3.11 ТАБЛИЦА: moderation_tasks (Задачи модерации)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS moderation_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Тип контента для модерации
  content_type TEXT NOT NULL CHECK (content_type IN ('community', 'event', 'post', 'expert')),
  content_id UUID NOT NULL,
  
  -- Статус задачи
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
  
  -- Информация о модерации
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  review_comment TEXT,
  
  -- Приоритет
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Метаданные
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для moderation_tasks
CREATE INDEX IF NOT EXISTS idx_moderation_content_type ON moderation_tasks(content_type);
CREATE INDEX IF NOT EXISTS idx_moderation_content_id ON moderation_tasks(content_id);
CREATE INDEX IF NOT EXISTS idx_moderation_status ON moderation_tasks(status);
CREATE INDEX IF NOT EXISTS idx_moderation_assigned ON moderation_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_moderation_priority ON moderation_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_moderation_created ON moderation_tasks(created_at DESC);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_moderation_tasks_updated_at ON moderation_tasks;
CREATE TRIGGER update_moderation_tasks_updated_at
  BEFORE UPDATE ON moderation_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------
-- 3.12 ТАБЛИЦА: community_content_blocks (Блоки контента сообществ)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS community_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('heading', 'text', 'image', 'carousel')),
  content JSONB NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, position)
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_content_blocks_community ON community_content_blocks(community_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_position ON community_content_blocks(community_id, position);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_community_content_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_community_content_blocks_updated_at ON community_content_blocks;
CREATE TRIGGER update_community_content_blocks_updated_at
  BEFORE UPDATE ON community_content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_community_content_blocks_updated_at();

-- --------------------------------------------
-- 3.13 ТАБЛИЦА: event_content_blocks (Блоки контента событий)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS event_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('heading', 'text', 'image', 'carousel')),
  content JSONB NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, position)
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_event_content_blocks_event ON event_content_blocks(event_id);
CREATE INDEX IF NOT EXISTS idx_event_content_blocks_position ON event_content_blocks(event_id, position);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_event_content_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_event_content_blocks_updated_at ON event_content_blocks;
CREATE TRIGGER update_event_content_blocks_updated_at
  BEFORE UPDATE ON event_content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_event_content_blocks_updated_at();

-- --------------------------------------------
-- 3.14 ТАБЛИЦА: community_media (Медиа-файлы сообществ)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS community_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для лучшей производительности
CREATE INDEX IF NOT EXISTS idx_community_media_community_id ON community_media(community_id);
CREATE INDEX IF NOT EXISTS idx_community_media_uploaded_at ON community_media(uploaded_at DESC);

-- Триггер для updated_at
CREATE OR REPLACE FUNCTION update_community_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_community_media_updated_at ON community_media;
CREATE TRIGGER update_community_media_updated_at
  BEFORE UPDATE ON community_media
  FOR EACH ROW
  EXECUTE FUNCTION update_community_media_updated_at();

-- ============================================
-- РАЗДЕЛ 4: RLS ПОЛИТИКИ
-- ============================================

-- --------------------------------------------
-- 4.1 RLS для profiles
-- --------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Профили видны всем" ON profiles;
CREATE POLICY "Профили видны всем" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Пользователи могут обновлять свой профиль" ON profiles;
CREATE POLICY "Пользователи могут обновлять свой профиль" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- --------------------------------------------
-- 4.2 RLS для categories
-- --------------------------------------------

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Все могут читать активные категории" ON categories;
CREATE POLICY "Все могут читать активные категории" ON categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Только админы управляют категориями" ON categories;
CREATE POLICY "Только админы управляют категориями" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- --------------------------------------------
-- 4.3 RLS для communities
-- --------------------------------------------

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Опубликованные сообщества видны всем" ON communities;
CREATE POLICY "Опубликованные сообщества видны всем" ON communities
  FOR SELECT USING (
    deleted_at IS NULL AND (
      status = 'published' 
      OR owner_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );

DROP POLICY IF EXISTS "Админы видят все сообщества включая удаленные" ON communities;
CREATE POLICY "Админы видят все сообщества включая удаленные" ON communities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Владельцы могут создавать сообщества" ON communities;
CREATE POLICY "Владельцы могут создавать сообщества" ON communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Владельцы могут обновлять свои сообщества" ON communities;
CREATE POLICY "Владельцы могут обновлять свои сообщества" ON communities
  FOR UPDATE USING (
    auth.uid() = owner_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Владельцы могут удалять свои сообщества" ON communities;
CREATE POLICY "Владельцы могут удалять свои сообщества" ON communities
  FOR DELETE USING (auth.uid() = owner_id);

-- --------------------------------------------
-- 4.4 RLS для experts
-- --------------------------------------------

ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Активные эксперты видны всем" ON experts;
CREATE POLICY "Активные эксперты видны всем" ON experts
  FOR SELECT USING (
    is_active = true 
    OR profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Пользователи могут создавать профиль эксперта" ON experts;
CREATE POLICY "Пользователи могут создавать профиль эксперта" ON experts
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Эксперты могут обновлять свой профиль" ON experts;
CREATE POLICY "Эксперты могут обновлять свой профиль" ON experts
  FOR UPDATE USING (
    auth.uid() = profile_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Эксперты могут удалять свой профиль" ON experts;
CREATE POLICY "Эксперты могут удалять свой профиль" ON experts
  FOR DELETE USING (auth.uid() = profile_id);

-- --------------------------------------------
-- 4.5 RLS для events
-- --------------------------------------------

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Опубликованные события видны всем" ON events;
CREATE POLICY "Опубликованные события видны всем" ON events
  FOR SELECT USING (
    deleted_at IS NULL AND (
      is_published = true
      OR organizer_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );

DROP POLICY IF EXISTS "Админы видят все события включая удаленные" ON events;
CREATE POLICY "Админы видят все события включая удаленные" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Пользователи могут создавать события" ON events;
CREATE POLICY "Пользователи могут создавать события" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Организаторы могут обновлять свои события" ON events;
CREATE POLICY "Организаторы могут обновлять свои события" ON events
  FOR UPDATE USING (
    auth.uid() = organizer_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Организаторы могут удалять свои события" ON events;
CREATE POLICY "Организаторы могут удалять свои события" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- --------------------------------------------
-- 4.6 RLS для posts
-- --------------------------------------------

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Опубликованные посты видны всем" ON posts;
CREATE POLICY "Опубликованные посты видны всем" ON posts
  FOR SELECT USING (
    is_published = true 
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Пользователи могут создавать посты" ON posts;
CREATE POLICY "Пользователи могут создавать посты" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Авторы могут обновлять свои посты" ON posts;
CREATE POLICY "Авторы могут обновлять свои посты" ON posts
  FOR UPDATE USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Авторы могут удалять свои посты" ON posts;
CREATE POLICY "Авторы могут удалять свои посты" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- --------------------------------------------
-- 4.7 RLS для favorites
-- --------------------------------------------

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Пользователи видят только свое избранное" ON favorites;
CREATE POLICY "Пользователи видят только свое избранное" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Пользователи могут добавлять в избранное" ON favorites;
CREATE POLICY "Пользователи могут добавлять в избранное" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Пользователи могут удалять из избранного" ON favorites;
CREATE POLICY "Пользователи могут удалять из избранного" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- --------------------------------------------
-- 4.8 RLS для event_registrations
-- --------------------------------------------

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Пользователи видят свои регистрации" ON event_registrations;
CREATE POLICY "Пользователи видят свои регистрации" ON event_registrations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Организаторы видят регистрации на свои события" ON event_registrations;
CREATE POLICY "Организаторы видят регистрации на свои события" ON event_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_registrations.event_id
      AND events.organizer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Пользователи могут регистрироваться" ON event_registrations;
CREATE POLICY "Пользователи могут регистрироваться" ON event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Пользователи могут отменять регистрацию" ON event_registrations;
CREATE POLICY "Пользователи могут отменять регистрацию" ON event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

-- --------------------------------------------
-- 4.9 RLS для reviews
-- --------------------------------------------

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Опубликованные отзывы видны всем" ON reviews;
CREATE POLICY "Опубликованные отзывы видны всем" ON reviews
  FOR SELECT USING (is_published = true OR user_id = auth.uid());

DROP POLICY IF EXISTS "Пользователи могут создавать отзывы" ON reviews;
CREATE POLICY "Пользователи могут создавать отзывы" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Пользователи могут обновлять свои отзывы" ON reviews;
CREATE POLICY "Пользователи могут обновлять свои отзывы" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Пользователи могут удалять свои отзывы" ON reviews;
CREATE POLICY "Пользователи могут удалять свои отзывы" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- --------------------------------------------
-- 4.10 RLS для community_members
-- --------------------------------------------

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view community members" ON community_members;
CREATE POLICY "Users can view community members"
ON community_members
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Users can join communities" ON community_members;
CREATE POLICY "Users can join communities"
ON community_members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND role = 'member');

DROP POLICY IF EXISTS "Users can leave communities" ON community_members;
CREATE POLICY "Users can leave communities"
ON community_members
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Community owners can manage members" ON community_members;
CREATE POLICY "Community owners can manage members"
ON community_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM communities
    WHERE communities.id = community_members.community_id
    AND communities.owner_id = auth.uid()
  )
);

-- --------------------------------------------
-- 4.11 RLS для moderation_tasks
-- --------------------------------------------

ALTER TABLE moderation_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Только админы видят задачи модерации" ON moderation_tasks;
CREATE POLICY "Только админы видят задачи модерации" ON moderation_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Только админы управляют задачами модерации" ON moderation_tasks;
CREATE POLICY "Только админы управляют задачами модерации" ON moderation_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- --------------------------------------------
-- 4.12 RLS для community_content_blocks
-- --------------------------------------------

ALTER TABLE community_content_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Community owners can manage content blocks" ON community_content_blocks;
CREATE POLICY "Community owners can manage content blocks"
  ON community_content_blocks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_content_blocks.community_id
      AND communities.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can view published community content blocks" ON community_content_blocks;
CREATE POLICY "Anyone can view published community content blocks"
  ON community_content_blocks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_content_blocks.community_id
      AND communities.status = 'published'
    )
  );

-- --------------------------------------------
-- 4.13 RLS для event_content_blocks
-- --------------------------------------------

ALTER TABLE event_content_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Community owners can manage event content blocks" ON event_content_blocks;
CREATE POLICY "Community owners can manage event content blocks"
  ON event_content_blocks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      JOIN communities ON communities.id = events.community_id
      WHERE events.id = event_content_blocks.event_id
      AND communities.owner_id = auth.uid()
      AND events.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "Anyone can view published event content blocks" ON event_content_blocks;
CREATE POLICY "Anyone can view published event content blocks"
  ON event_content_blocks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_content_blocks.event_id
      AND events.is_published = true
      AND events.deleted_at IS NULL
    )
  );

-- --------------------------------------------
-- 4.14 RLS для community_media
-- --------------------------------------------

ALTER TABLE community_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Community owners can view their media" ON community_media;
CREATE POLICY "Community owners can view their media"
  ON community_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_media.community_id
      AND communities.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Community owners can insert media" ON community_media;
CREATE POLICY "Community owners can insert media"
  ON community_media
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_media.community_id
      AND communities.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Community owners can delete media" ON community_media;
CREATE POLICY "Community owners can delete media"
  ON community_media
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_media.community_id
      AND communities.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Public can view media from published communities" ON community_media;
CREATE POLICY "Public can view media from published communities"
  ON community_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_media.community_id
      AND communities.is_published = true
    )
  );

-- ============================================
-- РАЗДЕЛ 5: ТРИГГЕРЫ ДЛЯ МОДЕРАЦИИ
-- ============================================

-- Функция для создания задачи модерации при создании сообщества
CREATE OR REPLACE FUNCTION create_community_moderation_task()
RETURNS TRIGGER AS $$
BEGIN
  -- Создаем задачу модерации только когда статус становится 'pending_moderation'
  IF NEW.status = 'pending_moderation' THEN
    -- Проверяем, нет ли уже активной задачи
    IF NOT EXISTS (
      SELECT 1 FROM moderation_tasks
      WHERE content_type = 'community'
        AND content_id = NEW.id
        AND status IN ('pending', 'in_review')
    ) THEN
      INSERT INTO moderation_tasks (content_type, content_id, status, priority, metadata)
      VALUES (
        'community',
        NEW.id,
        'pending',
        'normal',
        jsonb_build_object(
          'name', NEW.name,
          'slug', NEW.slug,
          'owner_id', NEW.owner_id
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS create_community_moderation_task_trigger ON communities;
CREATE TRIGGER create_community_moderation_task_trigger
  AFTER INSERT ON communities
  FOR EACH ROW
  WHEN (NEW.status = 'pending_moderation')
  EXECUTE FUNCTION create_community_moderation_task();

DROP TRIGGER IF EXISTS update_community_status_trigger ON communities;
CREATE TRIGGER update_community_status_trigger
  AFTER UPDATE ON communities
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'pending_moderation')
  EXECUTE FUNCTION create_community_moderation_task();

-- Функция для автоматического обновления статуса задачи при публикации сообщества
CREATE OR REPLACE FUNCTION update_moderation_task_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем задачу модерации при публикации
  IF NEW.status = 'published' AND OLD.status = 'pending_moderation' THEN
    UPDATE moderation_tasks
    SET 
      status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid()
    WHERE content_id = NEW.id
      AND content_type = 'community'
      AND status IN ('pending', 'in_review');
  -- Если статус сменился на черновик из модерации, отклоняем задачу
  ELSIF NEW.status = 'draft' AND OLD.status = 'pending_moderation' THEN
    UPDATE moderation_tasks
    SET 
      status = 'rejected',
      reviewed_at = NOW(),
      reviewed_by = auth.uid(),
      review_comment = 'Возвращено в черновики'
    WHERE content_id = NEW.id
      AND content_type = 'community'
      AND status IN ('pending', 'in_review');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_community_moderation_task_trigger ON communities;
CREATE TRIGGER update_community_moderation_task_trigger
  AFTER UPDATE ON communities
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_moderation_task_on_publish();

-- Функция для events (работает с is_published)
CREATE OR REPLACE FUNCTION update_event_moderation_task_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND OLD.is_published = false THEN
    UPDATE moderation_tasks
    SET 
      status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid()
    WHERE content_id = NEW.id
      AND content_type = 'event'
      AND status IN ('pending', 'in_review');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_event_moderation_task_trigger ON events;
CREATE TRIGGER update_event_moderation_task_trigger
  AFTER UPDATE ON events
  FOR EACH ROW
  WHEN (OLD.is_published IS DISTINCT FROM NEW.is_published)
  EXECUTE FUNCTION update_event_moderation_task_on_publish();

-- Функция для posts (работает с is_published)
CREATE OR REPLACE FUNCTION update_post_moderation_task_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND OLD.is_published = false THEN
    UPDATE moderation_tasks
    SET 
      status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid()
    WHERE content_id = NEW.id
      AND content_type = 'post'
      AND status IN ('pending', 'in_review');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_post_moderation_task_trigger ON posts;
CREATE TRIGGER update_post_moderation_task_trigger
  AFTER UPDATE ON posts
  FOR EACH ROW
  WHEN (OLD.is_published IS DISTINCT FROM NEW.is_published)
  EXECUTE FUNCTION update_post_moderation_task_on_publish();

-- Функция для experts (работает с is_active)
CREATE OR REPLACE FUNCTION update_expert_moderation_task_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true AND OLD.is_active = false THEN
    UPDATE moderation_tasks
    SET 
      status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid()
    WHERE content_id = NEW.id
      AND content_type = 'expert'
      AND status IN ('pending', 'in_review');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_expert_moderation_task_trigger ON experts;
CREATE TRIGGER update_expert_moderation_task_trigger
  AFTER UPDATE ON experts
  FOR EACH ROW
  WHEN (OLD.is_active IS DISTINCT FROM NEW.is_active)
  EXECUTE FUNCTION update_expert_moderation_task_on_publish();

-- ============================================
-- РАЗДЕЛ 6: ФУНКЦИИ ДЛЯ МЯГКОГО УДАЛЕНИЯ
-- ============================================

-- Функция для мягкого удаления сообщества
CREATE OR REPLACE FUNCTION soft_delete_community(
  p_community_id UUID,
  delete_option TEXT DEFAULT 'all' -- 'all' или 'future'
)
RETURNS JSON AS $$
DECLARE
  v_deleted_events INT := 0;
  v_future_events_count INT := 0;
  v_community_name TEXT;
BEGIN
  -- Проверяем существование сообщества
  SELECT name INTO v_community_name
  FROM communities
  WHERE id = p_community_id AND deleted_at IS NULL;
  
  IF v_community_name IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Сообщество не найдено или уже удалено'
    );
  END IF;

  -- Подсчитываем будущие события
  SELECT COUNT(*) INTO v_future_events_count
  FROM events
  WHERE events.community_id = p_community_id
    AND events.deleted_at IS NULL
    AND events.start_date > NOW();

  -- Мягко удаляем события в зависимости от опции
  IF delete_option = 'all' THEN
    UPDATE events
    SET deleted_at = NOW()
    WHERE events.community_id = p_community_id
      AND events.deleted_at IS NULL;
    
    GET DIAGNOSTICS v_deleted_events = ROW_COUNT;
    
  ELSIF delete_option = 'future' THEN
    UPDATE events
    SET deleted_at = NOW()
    WHERE events.community_id = p_community_id
      AND events.deleted_at IS NULL
      AND events.start_date > NOW();
    
    GET DIAGNOSTICS v_deleted_events = ROW_COUNT;
  END IF;

  -- Мягко удаляем сообщество
  UPDATE communities
  SET deleted_at = NOW()
  WHERE id = p_community_id;

  RETURN json_build_object(
    'success', true,
    'deleted_events', v_deleted_events,
    'future_events_count', v_future_events_count,
    'community_name', v_community_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для восстановления сообщества (для админов)
CREATE OR REPLACE FUNCTION restore_community(p_community_id UUID)
RETURNS JSON AS $$
DECLARE
  v_community_name TEXT;
BEGIN
  SELECT name INTO v_community_name
  FROM communities
  WHERE id = p_community_id AND deleted_at IS NOT NULL;
  
  IF v_community_name IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Удаленное сообщество не найдено'
    );
  END IF;

  UPDATE communities
  SET deleted_at = NULL
  WHERE id = p_community_id;

  RETURN json_build_object(
    'success', true,
    'community_name', v_community_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для окончательного удаления сообщества (только для админов)
CREATE OR REPLACE FUNCTION hard_delete_community(p_community_id UUID)
RETURNS JSON AS $$
DECLARE
  v_community_name TEXT;
  v_deleted_events INT := 0;
BEGIN
  SELECT name INTO v_community_name
  FROM communities
  WHERE id = p_community_id;
  
  IF v_community_name IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Сообщество не найдено'
    );
  END IF;

  DELETE FROM events
  WHERE events.community_id = p_community_id;
  
  GET DIAGNOSTICS v_deleted_events = ROW_COUNT;

  DELETE FROM community_media
  WHERE community_media.community_id = p_community_id;

  DELETE FROM community_content_blocks
  WHERE community_content_blocks.community_id = p_community_id;

  DELETE FROM communities
  WHERE id = p_community_id;

  RETURN json_build_object(
    'success', true,
    'deleted_events', v_deleted_events,
    'community_name', v_community_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для получения статистики модерации
CREATE OR REPLACE FUNCTION get_moderation_stats()
RETURNS TABLE (
  pending_count BIGINT,
  in_review_count BIGINT,
  approved_today BIGINT,
  rejected_today BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status = 'pending'),
    COUNT(*) FILTER (WHERE status = 'in_review'),
    COUNT(*) FILTER (WHERE status = 'approved' AND reviewed_at >= CURRENT_DATE),
    COUNT(*) FILTER (WHERE status = 'rejected' AND reviewed_at >= CURRENT_DATE)
  FROM moderation_tasks;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- РАЗДЕЛ 7: НАЧАЛЬНЫЕ ДАННЫЕ
-- ============================================

-- Вставка базовых категорий
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
  ('Концерты и Музыка', 'concerts-music', 'Концерты, живая музыка, музыкальные фестивали', '🎵', '#FF6B6B', 1),
  ('Театр и Перформанс', 'theater-performance', 'Театральные постановки, перформансы, шоу', '🎭', '#4ECDC4', 2),
  ('Выставки и Искусство', 'exhibitions-art', 'Художественные выставки, галереи, арт-пространства', '🎨', '#95E1D3', 3),
  ('Образование', 'education', 'Лекции, курсы, семинары, мастер-классы', '📚', '#F38181', 4),
  ('Спорт', 'sport', 'Спортивные мероприятия, соревнования, тренировки', '⚽', '#AA96DA', 5),
  ('Фестивали', 'festivals', 'Культурные, музыкальные, гастрономические фестивали', '🎊', '#FCBAD3', 6),
  ('Для Детей', 'children', 'Детские мероприятия, спектакли, праздники', '🧸', '#FFFFD2', 7),
  ('Кино и Медиа', 'cinema-media', 'Кинопоказы, фестивали кино, медиа-события', '🎬', '#A8D8EA', 8),
  ('Развлечения и Ночная жизнь', 'entertainment-nightlife', 'Вечеринки, клубные мероприятия, развлечения', '🌙', '#AA96DA', 9),
  ('Гастрономия', 'gastronomy', 'Кулинарные мастер-классы, дегустации, фуд-ивенты', '🍴', '#FFD3B6', 10),
  ('Хобби и Ремесла', 'hobbies-crafts', 'Мастер-классы по рукоделию, творческие занятия', '✂️', '#FFAAA5', 11),
  ('Экология и ЗОЖ', 'ecology-health', 'Здоровый образ жизни, эко-инициативы, йога', '🌱', '#A8E6CF', 12),
  ('Бизнес и Нетворкинг', 'business-networking', 'Деловые встречи, конференции, нетворкинг', '💼', '#C7CEEA', 13),
  ('Психология и Духовное развитие', 'psychology-spiritual', 'Тренинги, медитации, духовные практики', '🧘', '#B5EAD7', 14),
  ('Мода и Красота', 'fashion-beauty', 'Показы мод, мастер-классы по красоте', '💄', '#FFB7B2', 15)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- РАЗДЕЛ 8: КОММЕНТАРИИ К ТАБЛИЦАМ
-- ============================================

COMMENT ON TABLE profiles IS 'Профили пользователей';
COMMENT ON TABLE categories IS 'Категории мероприятий';
COMMENT ON TABLE communities IS 'Сообщества';
COMMENT ON TABLE experts IS 'Эксперты';
COMMENT ON TABLE events IS 'События и мероприятия';
COMMENT ON TABLE posts IS 'Публикации сообществ и экспертов';
COMMENT ON TABLE favorites IS 'Избранное пользователей';
COMMENT ON TABLE event_registrations IS 'Регистрации на события';
COMMENT ON TABLE reviews IS 'Отзывы об экспертах';
COMMENT ON TABLE community_members IS 'Участники сообществ';
COMMENT ON TABLE moderation_tasks IS 'Задачи модерации';
COMMENT ON TABLE community_content_blocks IS 'Блоки контента для страницы "О сообществе"';
COMMENT ON TABLE event_content_blocks IS 'Блоки контента для детального описания мероприятий';
COMMENT ON TABLE community_media IS 'Медиа-файлы сообществ';

COMMENT ON COLUMN communities.status IS 'Статус сообщества: draft (черновик), pending_moderation (на модерации), published (опубликовано)';
COMMENT ON COLUMN communities.deleted_at IS 'Дата и время мягкого удаления. NULL = не удалено';
COMMENT ON COLUMN events.deleted_at IS 'Дата и время мягкого удаления. NULL = не удалено';

-- ============================================
-- ЗАВЕРШЕНИЕ
-- ============================================

-- Скрипт успешно выполнен!
-- Следующий шаг: выполнить скрипт восстановления Storage buckets (02_storage_buckets_restore.sql)
