-- Создание bucket для профилей (аватары и другие файлы)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Политики для bucket profiles
-- Все могут просматривать файлы
CREATE POLICY "Публичный доступ к файлам профилей"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

-- Пользователи могут загружать свои файлы
CREATE POLICY "Пользователи могут загружать свои файлы"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Пользователи могут обновлять свои файлы
CREATE POLICY "Пользователи могут обновлять свои файлы"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles'
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Пользователи могут удалять свои файлы
CREATE POLICY "Пользователи могут удалять свои файлы"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profiles'
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[2]
);