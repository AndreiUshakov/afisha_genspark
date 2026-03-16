-- ============================================
-- СКРИПТ ВОССТАНОВЛЕНИЯ STORAGE BUCKETS
-- Проект: Афиша Иркутска (afisha_genspark)
-- Дата создания: 2026-03-15
-- ============================================
--
-- Этот скрипт восстанавливает:
-- 1. Storage buckets (profiles, communities, community-media)
-- 2. RLS политики для storage.objects
--
-- ВАЖНО: Выполнять ПОСЛЕ основного скрипта восстановления БД
-- ============================================

-- ============================================
-- РАЗДЕЛ 1: СОЗДАНИЕ BUCKETS
-- ============================================

-- --------------------------------------------
-- 1.1 Bucket: profiles (Аватары пользователей)
-- --------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  5242880, -- 5MB в байтах
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- --------------------------------------------
-- 1.2 Bucket: communities (Изображения сообществ)
-- --------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'communities',
  'communities',
  true,
  10485760, -- 10MB в байтах
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- --------------------------------------------
-- 1.3 Bucket: community-media (Медиа-галерея сообществ)
-- --------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-media',
  'community-media',
  true,
  10485760, -- 10MB в байтах
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- РАЗДЕЛ 2: ВКЛЮЧЕНИЕ RLS ДЛЯ STORAGE
-- ============================================

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- РАЗДЕЛ 3: RLS ПОЛИТИКИ ДЛЯ BUCKET "profiles"
-- ============================================

-- Удаляем старые политики для profiles
DROP POLICY IF EXISTS "Публичный доступ к файлам профилей" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут загружать файлы в profiles" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут обновлять файлы в profiles" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут удалять файлы в profiles" ON storage.objects;

-- Политика: Публичный доступ на чтение
CREATE POLICY "Публичный доступ к файлам профилей"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- Политика: Авторизованные пользователи могут загружать
CREATE POLICY "Пользователи могут загружать файлы в profiles"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles');

-- Политика: Авторизованные пользователи могут обновлять
CREATE POLICY "Пользователи могут обновлять файлы в profiles"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles');

-- Политика: Авторизованные пользователи могут удалять
CREATE POLICY "Пользователи могут удалять файлы в profiles"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profiles');

-- ============================================
-- РАЗДЕЛ 4: RLS ПОЛИТИКИ ДЛЯ BUCKET "communities"
-- ============================================

-- Удаляем старые политики для communities
DROP POLICY IF EXISTS "Communities public read access" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can update images" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can delete images" ON storage.objects;

-- Политика 1: Публичный доступ на чтение
CREATE POLICY "Communities public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'communities');

-- Политика 2: Владелец сообщества может загружать изображения
-- ВАЖНО: storage.objects.name - это путь файла в формате {communityId}/{filename}
CREATE POLICY "Community owners can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'communities'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 
    FROM public.communities c
    WHERE c.id::text = split_part(storage.objects.name, '/', 1)
    AND c.owner_id = auth.uid()
  )
);

-- Политика 3: Владелец сообщества может обновлять изображения
CREATE POLICY "Community owners can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'communities'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 
    FROM public.communities c
    WHERE c.id::text = split_part(storage.objects.name, '/', 1)
    AND c.owner_id = auth.uid()
  )
);

-- Политика 4: Владелец сообщества может удалять изображения
CREATE POLICY "Community owners can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'communities'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 
    FROM public.communities c
    WHERE c.id::text = split_part(storage.objects.name, '/', 1)
    AND c.owner_id = auth.uid()
  )
);

-- ============================================
-- РАЗДЕЛ 5: RLS ПОЛИТИКИ ДЛЯ BUCKET "community-media"
-- ============================================

-- Удаляем старые политики для community-media
DROP POLICY IF EXISTS "Community owners can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can update media" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can delete media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view community media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view published community media" ON storage.objects;

-- Политика 1: Владельцы сообществ могут загружать файлы в свою папку
CREATE POLICY "Community owners can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'community-media'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM communities WHERE owner_id = auth.uid()
  )
);

-- Политика 2: Владельцы сообществ могут обновлять свои файлы
CREATE POLICY "Community owners can update media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'community-media'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM communities WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'community-media'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM communities WHERE owner_id = auth.uid()
  )
);

-- Политика 3: Владельцы сообществ могут удалять свои файлы
CREATE POLICY "Community owners can delete media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'community-media'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM communities WHERE owner_id = auth.uid()
  )
);

-- Политика 4: Все могут просматривать файлы (т.к. бакет публичный)
CREATE POLICY "Anyone can view community media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'community-media');

-- ============================================
-- РАЗДЕЛ 6: КОММЕНТАРИИ К ПОЛИТИКАМ
-- ============================================

COMMENT ON POLICY "Публичный доступ к файлам профилей" ON storage.objects IS 
  'Все пользователи могут просматривать файлы профилей';

COMMENT ON POLICY "Пользователи могут загружать файлы в profiles" ON storage.objects IS 
  'Авторизованные пользователи могут загружать файлы в bucket profiles';

COMMENT ON POLICY "Communities public read access" ON storage.objects IS 
  'Публичный доступ на чтение файлов сообществ';

COMMENT ON POLICY "Community owners can upload images" ON storage.objects IS 
  'Владельцы сообществ могут загружать изображения в папку своего сообщества';

COMMENT ON POLICY "Community owners can update images" ON storage.objects IS 
  'Владельцы сообществ могут обновлять изображения своего сообщества';

COMMENT ON POLICY "Community owners can delete images" ON storage.objects IS 
  'Владельцы сообществ могут удалять изображения своего сообщества';

COMMENT ON POLICY "Community owners can upload media" ON storage.objects IS 
  'Владельцы сообществ могут загружать медиа-файлы в папку своего сообщества';

COMMENT ON POLICY "Community owners can update media" ON storage.objects IS 
  'Владельцы сообществ могут обновлять свои медиа-файлы';

COMMENT ON POLICY "Community owners can delete media" ON storage.objects IS 
  'Владельцы сообществ могут удалять свои медиа-файлы';

COMMENT ON POLICY "Anyone can view community media" ON storage.objects IS 
  'Все пользователи могут просматривать медиа-файлы сообществ';

-- ============================================
-- ЗАВЕРШЕНИЕ
-- ============================================

-- Скрипт успешно выполнен!
-- Все Storage buckets и политики восстановлены
