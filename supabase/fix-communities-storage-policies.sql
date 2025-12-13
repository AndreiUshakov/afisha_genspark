-- Удаляем старые политики если они есть
DROP POLICY IF EXISTS "Публичный доступ на чтение" ON storage.objects;
DROP POLICY IF EXISTS "Авторизованные пользователи могут загружать" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут обновлять свои файлы" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут удалять свои файлы" ON storage.objects;

-- Создаем bucket если его нет
INSERT INTO storage.buckets (id, name, public)
VALUES ('communities', 'communities', true)
ON CONFLICT (id) DO NOTHING;

-- Политика: Любой может просматривать изображения сообществ
CREATE POLICY "Communities public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'communities');

-- Политика: Владелец сообщества может загружать изображения
-- Структура пути: {communityId}/{filename}
-- Проверяем что пользователь является владельцем сообщества
CREATE POLICY "Community owners can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'communities'
  AND auth.uid() IS NOT NULL
  AND (
    -- Извлекаем communityId из пути (первая часть до /)
    SELECT owner_id 
    FROM public.communities 
    WHERE id::text = (string_to_array(name, '/'))[1]
  ) = auth.uid()
);

-- Политика: Владелец сообщества может обновлять изображения
CREATE POLICY "Community owners can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'communities'
  AND auth.uid() IS NOT NULL
  AND (
    SELECT owner_id 
    FROM public.communities 
    WHERE id::text = (string_to_array(name, '/'))[1]
  ) = auth.uid()
);

-- Политика: Владелец сообщества может удалять изображения
CREATE POLICY "Community owners can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'communities'
  AND auth.uid() IS NOT NULL
  AND (
    SELECT owner_id 
    FROM public.communities 
    WHERE id::text = (string_to_array(name, '/'))[1]
  ) = auth.uid()
);