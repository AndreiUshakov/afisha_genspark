-- Политики для бакета community-media

-- Создаем бакет, если его нет (на случай если он не был создан)
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-media', 'community-media', true)
ON CONFLICT (id) DO NOTHING;

-- Удаляем старые политики, если они есть
DROP POLICY IF EXISTS "Community owners can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can update media" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can delete media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view community media" ON storage.objects;

-- Политика: владельцы сообществ могут загружать файлы в свою папку
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

-- Политика: владельцы сообществ могут обновлять свои файлы
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

-- Политика: владельцы сообществ могут удалять свои файлы
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

-- Политика: все могут просматривать файлы (т.к. бакет публичный)
CREATE POLICY "Anyone can view community media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'community-media');

-- Комментарии
COMMENT ON POLICY "Community owners can upload media" ON storage.objects IS 
  'Владельцы сообществ могут загружать медиа-файлы в папку своего сообщества';
COMMENT ON POLICY "Community owners can update media" ON storage.objects IS 
  'Владельцы сообществ могут обновлять свои медиа-файлы';
COMMENT ON POLICY "Community owners can delete media" ON storage.objects IS 
  'Владельцы сообществ могут удалять свои медиа-файлы';
COMMENT ON POLICY "Anyone can view community media" ON storage.objects IS 
  'Все пользователи могут просматривать медиа-файлы сообществ';