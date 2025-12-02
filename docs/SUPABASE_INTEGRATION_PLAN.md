# План интеграции Supabase для проекта "Афиша Иркутска"

## Обзор проекта

Проект представляет собой платформу для событий, сообществ и экспертов города Иркутска. Текущее состояние: используются mock-данные из TypeScript файлов. Цель: мигрировать на Supabase для работы с реальной базой данных.

## Текущая структура данных

### Основные сущности:
- **Events** (События) - 55 мероприятий
- **Communities** (Сообщества) - 6 сообществ с расширенными возможностями
- **Experts** (Эксперты) - 6 экспертов с услугами
- **Posts** (Публикации) - 8 постов от сообществ
- **Categories** (Категории) - 15 категорий событий

---

## 📋 ФАЗА 1: Подготовка и настройка окружения

### 1.1 Установка зависимостей Supabase

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install -D @supabase/auth-ui-react @supabase/auth-ui-shared
```

**Пакеты:**
- `@supabase/supabase-js` - основной клиент Supabase
- `@supabase/auth-helpers-nextjs` - хелперы для Next.js App Router
- `@supabase/auth-ui-react` - готовые UI компоненты для аутентификации
- `@supabase/auth-ui-shared` - общие стили для Auth UI

### 1.2 Настройка переменных окружения

Создать файл `.env.local` в корне проекта:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: для production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Где взять ключи:**
1. Открыть проект в Supabase Dashboard
2. Settings → API
3. Скопировать `Project URL` и `anon/public` ключ

### 1.3 Обновление .gitignore

Убедиться, что `.env.local` добавлен в `.gitignore`:

```gitignore
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 📊 ФАЗА 2: Создание схемы базы данных в Supabase

### 2.1 Таблица: profiles (Профили пользователей)

```sql
-- Создание таблицы профилей
CREATE TABLE profiles (
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

-- Индексы
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- RLS политики
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Профили видны всем" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Пользователи могут обновлять свой профиль" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2.2 Таблица: categories (Категории)

```sql
-- Создание таблицы категорий
CREATE TABLE categories (
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

-- Индексы
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_featured ON categories(featured_on_hero);

-- RLS политики
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Категории видны всем" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Только админы могут управлять категориями" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Триггер для updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2.3 Таблица: communities (Сообщества)

```sql
-- Создание таблицы сообществ
CREATE TABLE communities (
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
  
  -- Расширенные поля из types/community.ts
  target_audience TEXT[] DEFAULT '{}',
  wishes TEXT[] DEFAULT '{}',
  age_category TEXT,
  community_category TEXT,
  page_content JSONB DEFAULT '{}', -- для CraftJS
  photo_albums JSONB DEFAULT '[]',
  
  is_published BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_communities_slug ON communities(slug);
CREATE INDEX idx_communities_owner ON communities(owner_id);
CREATE INDEX idx_communities_category ON communities(category_id);
CREATE INDEX idx_communities_published ON communities(is_published);

-- RLS политики
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Опубликованные сообщества видны всем" ON communities
  FOR SELECT USING (is_published = true OR owner_id = auth.uid());

CREATE POLICY "Владельцы могут создавать сообщества" ON communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Владельцы могут обновлять свои сообщества" ON communities
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Владельцы могут удалять свои сообщества" ON communities
  FOR DELETE USING (auth.uid() = owner_id);

-- Триггер для updated_at
CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON communities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2.4 Таблица: experts (Эксперты)

```sql
-- Создание таблицы экспертов
CREATE TABLE experts (
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
  services JSONB DEFAULT '[]', -- массив объектов с услугами
  pricing JSONB DEFAULT '{}', -- объект с ценами
  location TEXT,
  social_links JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_experts_slug ON experts(slug);
CREATE INDEX idx_experts_profile ON experts(profile_id);
CREATE INDEX idx_experts_rating ON experts(rating DESC);
CREATE INDEX idx_experts_active ON experts(is_active);

-- RLS политики
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Активные эксперты видны всем" ON experts
  FOR SELECT USING (is_active = true OR profile_id = auth.uid());

CREATE POLICY "Пользователи могут создавать профиль эксперта" ON experts
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Эксперты могут обновлять свой профиль" ON experts
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Эксперты могут удалять свой профиль" ON experts
  FOR DELETE USING (auth.uid() = profile_id);

-- Триггер для updated_at
CREATE TRIGGER update_experts_updated_at
  BEFORE UPDATE ON experts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2.5 Таблица: events (События)

```sql
-- Создание таблицы событий
CREATE TABLE events (
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
  venue_coordinates JSONB, -- {lat, lng}
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

-- Индексы
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_category ON events(category_id);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_community ON events(community_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_published ON events(is_published);
CREATE INDEX idx_events_featured ON events(is_featured);
CREATE INDEX idx_events_tags ON events USING GIN(tags);

-- RLS политики
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Опубликованные события видны всем" ON events
  FOR SELECT USING (is_published = true OR organizer_id = auth.uid());

CREATE POLICY "Пользователи могут создавать события" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Организаторы могут обновлять свои события" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Организаторы могут удалять свои события" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- Триггер для updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2.6 Таблица: posts (Публикации)

```sql
-- Создание таблицы публикаций
CREATE TABLE posts (
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
  
  -- Проверка: пост должен принадлежать либо сообществу, либо эксперту
  CONSTRAINT post_belongs_to_one CHECK (
    (community_id IS NOT NULL AND expert_id IS NULL) OR
    (community_id IS NULL AND expert_id IS NOT NULL)
  )
);

-- Индексы
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_community ON posts(community_id);
CREATE INDEX idx_posts_expert ON posts(expert_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(is_published);
CREATE INDEX idx_posts_featured ON posts(is_featured);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- RLS политики
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Опубликованные посты видны всем" ON posts
  FOR SELECT USING (is_published = true OR author_id = auth.uid());

CREATE POLICY "Пользователи могут создавать посты" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Авторы могут обновлять свои посты" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Авторы могут удалять свои посты" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- Триггер для updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2.7 Таблица: favorites (Избранное)

```sql
-- Создание таблицы избранного
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Проверка: должен быть выбран один тип
  CONSTRAINT favorite_one_type CHECK (
    (event_id IS NOT NULL AND community_id IS NULL AND expert_id IS NULL) OR
    (event_id IS NULL AND community_id IS NOT NULL AND expert_id IS NULL) OR
    (event_id IS NULL AND community_id IS NULL AND expert_id IS NOT NULL)
  ),
  
  -- Уникальность: пользователь не может добавить один объект дважды
  CONSTRAINT unique_favorite UNIQUE (user_id, event_id, community_id, expert_id)
);

-- Индексы
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_event ON favorites(event_id);
CREATE INDEX idx_favorites_community ON favorites(community_id);
CREATE INDEX idx_favorites_expert ON favorites(expert_id);

-- RLS политики
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Пользователи видят только свое избранное" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут добавлять в избранное" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут удалять из избранного" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

### 2.8 Таблица: event_registrations (Регистрации на события)

```sql
-- Создание таблицы регистраций
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  ticket_number TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_amount DECIMAL(10,2),
  
  registration_data JSONB DEFAULT '{}', -- дополнительные данные формы
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Уникальность: один пользователь - одна регистрация на событие
  CONSTRAINT unique_registration UNIQUE (event_id, user_id)
);

-- Индексы
CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_registrations_status ON event_registrations(status);

-- RLS политики
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Пользователи видят свои регистрации" ON event_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Организаторы видят регистрации на свои события" ON event_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_registrations.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Пользователи могут регистрироваться" ON event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут отменять регистрацию" ON event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

-- Триггер для updated_at
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Триггер для обновления счетчика registered_count в events
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

CREATE TRIGGER update_event_registered_count_trigger
  AFTER INSERT OR DELETE ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_registered_count();
```

### 2.9 Таблица: reviews (Отзывы)

```sql
-- Создание таблицы отзывов
CREATE TABLE reviews (
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
  
  -- Уникальность: один пользователь - один отзыв на эксперта
  CONSTRAINT unique_review UNIQUE (expert_id, user_id)
);

-- Индексы
CREATE INDEX idx_reviews_expert ON reviews(expert_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_published ON reviews(is_published);

-- RLS политики
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Опубликованные отзывы видны всем" ON reviews
  FOR SELECT USING (is_published = true OR user_id = auth.uid());

CREATE POLICY "Пользователи могут создавать отзывы" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свои отзывы" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут удалять свои отзывы" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Триггер для updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Триггер для обновления рейтинга и количества отзывов эксперта
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

CREATE TRIGGER update_expert_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_expert_rating();
```

### 2.10 Таблица: community_members (Участники сообществ)

```sql
-- Создание таблицы участников сообществ
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Уникальность
  CONSTRAINT unique_membership UNIQUE (community_id, user_id)
);

-- Индексы
CREATE INDEX idx_members_community ON community_members(community_id);
CREATE INDEX idx_members_user ON community_members(user_id);
CREATE INDEX idx_members_role ON community_members(role);

-- RLS политики
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Участники видны всем" ON community_members
  FOR SELECT USING (true);

CREATE POLICY "Пользователи могут вступать в сообщества" ON community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id AND role = 'member');

CREATE POLICY "Владельцы могут управлять участниками" ON community_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_members.community_id
      AND communities.owner_id = auth.uid()
    )
  );

-- Триггер для обновления счетчика members_count
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

CREATE TRIGGER update_community_members_count_trigger
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_members_count();
```

---

## 🔐 ФАЗА 3: Настройка аутентификации и безопасности

### 3.1 Настройка провайдеров аутентификации

В Supabase Dashboard → Authentication → Providers включить:

1. **Email** (по умолчанию включен)
   - Confirm email: включить для верификации
   - Secure email change: включить

2. **Google OAuth** (опционально)
   - Получить Client ID и Secret в Google Cloud Console
   - Добавить redirect URL: `https://your-project.supabase.co/auth/v1/callback`

3. **VK OAuth** (опционально, для российской аудитории)
   - Настроить приложение VK
   - Добавить credentials

### 3.2 Настройка Email Templates

Authentication → Email Templates:

**Confirm Signup:**
```html
<h2>Подтвердите регистрацию</h2>
<p>Спасибо за регистрацию на Афише Иркутска!</p>
<p><a href="{{ .ConfirmationURL }}">Подтвердить email</a></p>
```

**Reset Password:**
```html
<h2>Сброс пароля</h2>
<p>Вы запросили сброс пароля.</p>
<p><a href="{{ .ConfirmationURL }}">Сбросить пароль</a></p>
```

### 3.3 Создание триггера для автоматического создания профиля

```sql
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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 3.4 Настройка Storage Policies

Для каждого bucket (avatars, covers, events, communities):

```sql
-- Пример для bucket 'avatars'
CREATE POLICY "Аватары видны всем"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Пользователи могут загружать свои аватары"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Пользователи могут обновлять свои аватары"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Пользователи могут удалять свои аватары"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 📦 ФАЗА 4: Настройка хранилища для изображений

### 4.1 Создание Storage Buckets

В Supabase Dashboard → Storage создать buckets:

1. **avatars** - аватары пользователей и экспертов
   - Public: true
   - File size limit: 2MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

2. **covers** - обложки сообществ и событий
   - Public: true
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

3. **events** - галереи событий
   - Public: true
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

4. **communities** - галереи сообществ
   - Public: true
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

5. **posts** - изображения для постов
   - Public: true
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

### 4.2 Структура хранения файлов

```
avatars/
  ├── {user_id}/
  │   └── avatar.jpg

covers/
  ├── communities/{community_id}/
  │   └── cover.jpg
  └── events/{event_id}/
      └── cover.jpg

events/
  └── {event_id}/
      ├── gallery/
      │   ├── image1.jpg
      │   └── image2.jpg

communities/
  └── {community_id}/
      ├── gallery/
      │   ├── image1.jpg
      │   └── image2.jpg
      └── albums/
          └── {album_id}/
              ├── photo1.jpg
              └── photo2.jpg

posts/
  └── {post_id}/
      ├── cover.jpg
      └── content/
          ├── image1.jpg
          └── image2.jpg
```

---

## 🔧 ФАЗА 5: Создание Supabase клиентов и утилит

### 5.1 Создание Supabase клиента для Server Components

Создать файл `lib/supabase/server.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Игнорируем ошибки в Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Игнорируем ошибки в Server Components
          }
        },
      },
    }
  )
}
```

### 5.2 Создание Supabase клиента для Client Components

Создать файл `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 5.3 Создание Supabase клиента для Route Handlers

Создать файл `lib/supabase/route.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

### 5.4 Создание middleware для аутентификации

Создать файл `middleware.ts` в корне проекта:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 5.5 Создание TypeScript типов из схемы БД

Создать файл `types/database.types.ts`:

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          location: string | null
          website: string | null
          social_links: Json
          role: 'user' | 'expert' | 'admin'
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
          website?: string | null
          social_links?: Json
          role?: 'user' | 'expert' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
          website?: string | null
          social_links?: Json
          role?: 'user' | 'expert' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // ... остальные таблицы
    }
  }
}
```

### 5.6 Создание утилит для работы с изображениями

Создать файл `lib/storage.ts`:

```typescript
import { createClient } from '@/lib/supabase/client'

export async function uploadImage(
  file: File,
  bucket: string,
  path: string
): Promise<string | null> {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${path}/${fileName}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteImage(
  bucket: string,
  path: string
): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Error deleting image:', error)
    return false
  }

  return true
}

export function getImageUrl(bucket: string, path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}
```

---

## 📊 ФАЗА 6: Миграция данных из mock-файлов в БД

### 6.1 Создание скрипта миграции категорий

Создать файл `scripts/migrate-categories.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { mockCategories } from '../data/mockCategories'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function migrateCategories() {
  console.log('Начинаем миграцию категорий...')
  
  for (const category of mockCategories) {
    const { error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color,
        featured_on_hero: category.featuredonhero,
      })
    
    if (error) {
      console.error(`Ошибка при добавлении категории ${category.name}:`, error)
    } else {
      console.log(`✓ Категория ${category.name} добавлена`)
    }
  }
  
  console.log('Миграция категорий завершена!')
}

migrateCategories()
```

### 6.2 Создание скрипта миграции событий

Создать файл `scripts/migrate-events.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { mockEvents } from '../data/mockEvents'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function migrateEvents() {
  console.log('Начинаем миграцию событий...')
  
  // Сначала нужно получить ID категорий из БД
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug')
  
  const categoryMap = new Map(
    categories?.map(cat => [cat.slug, cat.id]) || []
  )
  
  for (const event of mockEvents) {
    const categoryId = categoryMap.get(event.category_id)
    
    const { error } = await supabase
      .from('events')
      .insert({
        title: event.title,
        slug: event.slug,
        description: event.description,
        cover_image_url: event.cover_image_url,
        category_id: categoryId,
        organizer_name: event.organizer.name,
        organizer_avatar: event.organizer.avatar,
        organizer_type: event.organizer.type,
        start_date: event.date.start,
        end_date: event.date.end,
        location_type: event.location.type,
        venue_name: event.location.venue,
        venue_address: event.location.address,
        venue_coordinates: event.location.coordinates,
        online_link: event.location.online_link,
        is_free: event.price.is_free,
        price_min: event.price.min,
        price_max: event.price.max,
        currency: event.price.currency,
        ticket_link: event.price.ticket_link,
        capacity: event.capacity.total,
        registered_count: event.capacity.registered,
        tags: event.tags,
        age_restriction: event.age_restriction,
        social_links: event.social_links,
        gallery_images: event.gallery_images,
        is_published: true,
        is_featured: event.is_featured,
      })
    
    if (error) {
      console.error(`Ошибка при добавлении события ${event.title}:`, error)
    } else {
      console.log(`✓ Событие ${event.title} добавлено`)
    }
  }
  
  console.log('Миграция событий завершена!')
}

migrateEvents()
```

### 6.3 Добавление команд в package.json

```json
{
  "scripts": {
    "migrate:categories": "tsx scripts/migrate-categories.ts",
    "migrate:events": "tsx scripts/migrate-events.ts",
    "migrate:communities": "tsx scripts/migrate-communities.ts",
    "migrate:experts": "tsx scripts/migrate-experts.ts",
    "migrate:posts": "tsx scripts/migrate-posts.ts",
    "migrate:all": "npm run migrate:categories && npm run migrate:events && npm run migrate:communities && npm run migrate:experts && npm run migrate:posts"
  }
}
```

Установить tsx для запуска TypeScript:
```bash
npm install -D tsx
```

---

## 🔄 ФАЗА 7: Обновление компонентов для работы с реальными данными

### 7.1 Создание Server Actions для событий

Создать файл `app/actions/events.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getEvents(filters?: {
  category?: string
  date?: string
  location?: string
  search?: string
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('events')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_published', true)
    .order('start_date', { ascending: true })
  
  if (filters?.category) {
    query = query.eq('category_id', filters.category)
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  
  return data
}

export async function getEventBySlug(slug: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      category:categories(*),
      organizer:profiles(*)
    `)
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching event:', error)
    return null
  }
  
  // Увеличиваем счетчик просмотров
  await supabase
    .from('events')
    .update({ views_count: data.views_count + 1 })
    .eq('id', data.id)
  
  return data
}

export async function createEvent(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Необходима авторизация' }
  }
  
  const eventData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    category_id: formData.get('category_id') as string,
    organizer_id: user.id,
    start_date: formData.get('start_date') as string,
    // ... остальные поля
  }
  
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/events')
  return { data }
}
```

### 7.2 Обновление страницы событий

Обновить `app/events/page.tsx`:

```typescript
import { getEvents } from '@/app/actions/events'
import EventCard from '@/components/events/EventCard'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const events = await getEvents({
    category: searchParams.category,
    search: searchParams.search,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">События</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
```

### 7.3 Создание компонента для добавления в избранное

Создать файл `components/favorites/FavoriteButton.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  eventId?: string
  communityId?: string
  expertId?: string
  initialIsFavorite?: boolean
}

export default function FavoriteButton({
  eventId,
  communityId,
  expertId,
  initialIsFavorite = false,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const toggleFavorite = async () => {
    setIsLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Перенаправить на страницу входа
      window.location.href = '/auth/login'
      return
    }

    if (isFavorite) {
      // Удалить из избранного
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq(eventId ? 'event_id' : communityId ? 'community_id' : 'expert_id', 
            eventId || communityId || expertId)
      
      if (!error) {
        setIsFavorite(false)
      }
    } else {
      // Добавить в избранное
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          event_id: eventId,
          community_id: communityId,
          expert_id: expertId,
        })
      
      if (!error) {
        setIsFavorite(true)
      }
    }
    
    setIsLoading(false)
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isFavorite 
          ? 'bg-red-500 text-white' 
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
    >
      <Heart className={isFavorite ? 'fill-current' : ''} size={20} />
    </button>
  )
}
```

### 7.4 Создание Real-time подписки на события

Создать файл `hooks/useRealtimeEvents.ts`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Event = Database['public']['Tables']['events']['Row']

export function useRealtimeEvents(initialEvents: Event[]) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: 'is_published=eq.true',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents((current) => [payload.new as Event, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setEvents((current) =>
              current.map((event) =>
                event.id === payload.new.id ? (payload.new as Event) : event
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setEvents((current) =>
              current.filter((event) => event.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return events
}
```

---

## 🧪 ФАЗА 8: Тестирование и оптимизация

### 8.1 Создание тестовых данных

1. Запустить миграцию данных:
```bash
npm run migrate:all
```

2. Создать тестовых пользователей через Supabase Dashboard

3. Проверить RLS политики:
```sql
-- Тест: пользователь видит только опубликованные события
SELECT * FROM events WHERE is_published = true;

-- Тест: пользователь может создать событие
INSERT INTO events (title, slug, organizer_id, ...) VALUES (...);
```

### 8.2 Оптимизация запросов

**Использование индексов:**
```sql
-- Проверить использование индексов
EXPLAIN ANALYZE
SELECT * FROM events
WHERE category_id = 'some-uuid'
AND start_date > NOW()
ORDER BY start_date;
```

**Кэширование на уровне Next.js:**
```typescript
// В Server Components
export const revalidate = 3600 // кэш на 1 час

// Или использовать fetch с кэшированием
const events = await fetch('...', {
  next: { revalidate: 3600 }
})
```

### 8.3 Мониторинг производительности

В Supabase Dashboard → Database → Query Performance:
- Отслеживать медленные запросы
- Оптимизировать индексы
- Проверять использование RLS

### 8.4 Настройка Edge Functions (опционально)

Для сложной бизнес-логики создать Edge Functions:

```typescript
// supabase/functions/send-event-reminder/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Получить события, которые начинаются завтра
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const { data: events } = await supabase
    .from('events')
    .select('*, registrations:event_registrations(*)')
    .gte('start_date', tomorrow.toISOString())
    .lt('start_date', new Date(tomorrow.getTime() + 86400000).toISOString())

  // Отправить напоминания
  // ...

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

---

## 📝 Чек-лист выполнения

### Фаза 1: Подготовка ✅
- [ ] Установлены пакеты Supabase
- [ ] Настроены переменные окружения
- [ ] Обновлен .gitignore

### Фаза 2: База данных ✅
- [ ] Созданы все таблицы
- [ ] Настроены индексы
- [ ] Настроены RLS политики
- [ ] Созданы триггеры

### Фаза 3: Аутентификация ✅
- [ ] Настроены провайдеры OAuth
- [ ] Настроены email templates
- [ ] Создан триггер для профилей
- [ ] Настроены Storage policies

### Фаза 4: Хранилище ✅
- [ ] Созданы все buckets
- [ ] Настроены политики доступа
- [ ] Определена структура файлов

### Фаза 5: Клиенты ✅
- [ ] Создан server client
- [ ] Создан browser client
- [ ] Создан route handler client
- [ ] Настроен middleware
- [ ] Созданы TypeScript типы
- [ ] Созданы утилиты для Storage

### Фаза 6: Миграция ✅
- [ ] Созданы скрипты миграции
- [ ] Мигрированы категории
- [ ] Мигрированы события
- [ ] Мигрированы сообщества
- [ ] Мигрированы эксперты
- [ ] Мигрированы посты

### Фаза 7: Компоненты ✅
- [ ] Созданы Server Actions
- [ ] Обновлены страницы
- [ ] Созданы Client Components
- [ ] Настроены Real-time подписки

### Фаза 8: Тестирование ✅
- [ ] Созданы тестовые данные
- [ ] Проверены RLS политики
- [ ] Оптимизированы запросы
- [ ] Настроен мониторинг

---

## 🚀 Следующие шаги после интеграции

1. **Добавить поиск с полнотекстовым индексом:**
```sql
ALTER TABLE events ADD COLUMN search_vector tsvector;
CREATE INDEX events_search_idx ON events USING GIN(search_vector);
```

2. **Настроить уведомления:**
   - Email уведомления о новых событиях
   - Push уведомления через Web Push API
   - Telegram бот для уведомлений

3. **Добавить аналитику:**
   - Отслеживание популярных событий
   - Статистика по категориям
   - Аналитика поведения пользователей

4. **Оптимизация изображений:**
   - Автоматическое сжатие при загрузке
   - Генерация thumbnails
   - Использование CDN

5. **Добавить кэширование:**
   - Redis для часто запрашиваемых данных
   - ISR (Incremental Static Regeneration) для статических страниц

---

## 📚 Полезные ресурсы

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ⚠️ Важные замечания

1. **Безопасность:**
   - Никогда не коммитить `.env.local` в Git
   - Использовать Service Role Key только на сервере
   - Всегда проверять RLS политики

2. **Производительность:**
   - Использовать индексы для часто запрашиваемых полей
   - Ограничивать количество возвращаемых записей
   - Кэшировать статические данные

3. **Масштабирование:**
   - Планировать структуру БД с учетом роста
   - Использовать партиционирование для больших таблиц
   - Мониторить использование ресурсов

4. **Резервное копирование:**
   - Настроить автоматические бэкапы в Supabase
   - Регулярно тестировать восстановление
   - Хранить бэкапы в разных локациях