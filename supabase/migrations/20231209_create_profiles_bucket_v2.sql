-- Создание bucket для профилей (аватары и другие файлы)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Удаляем старые политики, если они есть
DROP POLICY IF EXISTS "Публичный доступ к файлам профилей" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут загружать свои файлы" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут обновлять свои файлы" ON storage.objects;
DROP POLICY IF EXISTS "Пользователи могут удалять свои файлы" ON storage.objects;

-- Политика для чтения - все могут просматривать файлы
CREATE POLICY "Публичный доступ к файлам профилей"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- Политика для загрузки - авторизованные пользователи могут загружать
CREATE POLICY "Пользователи могут загружать файлы в profiles"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles');

-- Политика для обновления - авторизованные пользователи могут обновлять
CREATE POLICY "Пользователи могут обновлять файлы в profiles"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles');

-- Политика для удаления - авторизованные пользователи могут удалять
CREATE POLICY "Пользователи могут удалять файлы в profiles"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profiles');