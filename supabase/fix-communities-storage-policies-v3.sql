-- Удаляем все старые политики для бакета communities
DROP POLICY IF EXISTS "Communities public read access" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can update images" ON storage.objects;
DROP POLICY IF EXISTS "Community owners can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Публичный доступ на чтение" ON storage.objects;
DROP POLICY IF EXISTS "Авторизованные пользователи могут загружать" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут обновлять свои файлы" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут удалять свои файлы" ON storage.objects;

-- Создаем bucket если его нет
INSERT INTO storage.buckets (id, name, public)
VALUES ('communities', 'communities', true)
ON CONFLICT (id) DO NOTHING;

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