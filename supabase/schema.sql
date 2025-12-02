-- ============================================
-- Схема базы данных для проекта "Афиша Иркутска"
-- ============================================

-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ФУНКЦИИ И ТРИГГЕРЫ
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
-- ТАБЛИЦА: profiles (Профили пользователей)
-- ============================================

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

-- RLS политики для profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Профили видны всем" ON profiles;
CREATE POLICY "Профили видны всем" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Пользователи могут обновлять свой профиль" ON profiles;
CREATE POLICY "Пользователи могут обновлять свой профиль" ON profiles
  FOR UPDATE USING (auth.uid() = id);

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

-- ============================================
-- ТАБЛИЦА: categories (Категории)
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT NOT NULL,
  featured_on_hero BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories(featured_on_hero);

-- RLS политики для categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Категории видны всем" ON categories;
CREATE POLICY "Категории видны всем" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Только админы могут управлять категориями" ON categories;
CREATE POLICY "Только админы могут управлять категориями" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ТАБЛИЦА: communities (Сообщества)
-- ============================================

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
  community_category TEXT,
  page_content JSONB DEFAULT '{}',
  photo_albums JSONB DEFAULT '[]',
  
  is_published BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для communities
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
CREATE INDEX IF NOT EXISTS idx_communities_owner ON communities(owner_id);
CREATE INDEX IF NOT EXISTS idx_communities_category ON communities(category_id);
CREATE INDEX IF NOT EXISTS idx_communities_published ON communities(is_published);

-- RLS политики для communities
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Опубликованные сообщества видны всем" ON communities;
CREATE POLICY "Опубликованные сообщества видны всем" ON communities
  FOR SELECT USING (is_published = true OR owner_id = auth.uid());

DROP POLICY IF EXISTS "Владельцы могут создавать сообщества" ON communities;
CREATE POLICY "Владельцы могут создавать сообщества" ON communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Владельцы могут обновлять свои сообщества" ON communities;
CREATE POLICY "Владельцы могут обновлять свои сообщества" ON communities
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Владельцы могут удалять свои сообщества" ON communities;
CREATE POLICY "Владельцы могут удалять свои сообщества" ON communities
  FOR DELETE USING (auth.uid() = owner_id);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_communities_updated_at ON communities;
CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON communities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ТАБЛИЦА: experts (Эксперты)
-- ============================================

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

-- RLS политики для experts
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Активные эксперты видны всем" ON experts;
CREATE POLICY "Активные эксперты видны всем" ON experts
  FOR SELECT USING (is_active = true OR profile_id = auth.uid());

DROP POLICY IF EXISTS "Пользователи могут создавать профиль эксперта" ON experts;
CREATE POLICY "Пользователи могут создавать профиль эксперта" ON experts
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Эксперты могут обновлять свой профиль" ON experts;
CREATE POLICY "Эксперты могут обновлять свой профиль" ON experts
  FOR UPDATE USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Эксперты могут удалять свой профиль" ON experts;
CREATE POLICY "Эксперты могут удалять свой профиль" ON experts
  FOR DELETE USING (auth.uid() = profile_id);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_experts_updated_at ON experts;
CREATE TRIGGER update_experts_updated_at
  BEFORE UPDATE ON experts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ТАБЛИЦА: events (События)
-- ============================================

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
  
  -- Статусы
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_cancelled BOOLEAN DEFAULT false,
  
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

-- RLS политики для events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Опубликованные события видны всем" ON events;
CREATE POLICY "Опубликованные события видны всем" ON events
  FOR SELECT USING (is_published = true OR organizer_id = auth.uid());

DROP POLICY IF EXISTS "Пользователи могут создавать события" ON events;
CREATE POLICY "Пользователи могут создавать события" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Организаторы могут обновлять свои события" ON events;
CREATE POLICY "Организаторы могут обновлять свои события" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Организаторы могут удалять свои события" ON events;
CREATE POLICY "Организаторы могут удалять свои события" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ТАБЛИЦА: posts (Публикации)
-- ============================================

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

-- RLS политики для posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Опубликованные посты видны всем" ON posts;
CREATE POLICY "Опубликованные посты видны всем" ON posts
  FOR SELECT USING (is_published = true OR author_id = auth.uid());

DROP POLICY IF EXISTS "Пользователи могут создавать посты" ON posts;
CREATE POLICY "Пользователи могут создавать посты" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Авторы могут обновлять свои посты" ON posts;
CREATE POLICY "Авторы могут обновлять свои посты" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Авторы могут удалять свои посты" ON posts;
CREATE POLICY "Авторы могут удалять свои посты" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ТАБЛИЦА: favorites (Избранное)
-- ============================================

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

-- RLS политики для favorites
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

-- ============================================
-- ТАБЛИЦА: event_registrations (Регистрации на события)
-- ============================================

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

-- RLS политики для event_registrations
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

-- ============================================
-- ТАБЛИЦА: reviews (Отзывы)
-- ============================================

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

-- RLS политики для reviews
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

-- ============================================
-- ТАБЛИЦА: community_members (Участники сообществ)
-- ============================================

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

-- RLS политики для community_members
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Участники видны всем" ON community_members;
CREATE POLICY "Участники видны всем" ON community_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Пользователи могут вступать в сообщества" ON community_members;
CREATE POLICY "Пользователи могут вступать в сообщества" ON community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id AND role = 'member');

DROP POLICY IF EXISTS "Владельцы могут управлять участниками" ON community_members;
CREATE POLICY "Владельцы могут управлять участниками" ON community_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_members.community_id
      AND communities.owner_id = auth.uid()
    )
  );

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