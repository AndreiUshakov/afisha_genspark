# Настройка Storage для изображений сообществ

## Создание bucket в Supabase

Выполните следующий SQL запрос в Supabase SQL Editor:

```sql
-- Создать bucket для изображений сообществ
INSERT INTO storage.buckets (id, name, public)
VALUES ('communities', 'communities', true);

-- Политика: Любой может просматривать изображения
CREATE POLICY "Публичный доступ на чтение" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'communities');

-- Политика: Авторизованные пользователи могут загружать
CREATE POLICY "Авторизованные пользователи могут загружать" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'communities' 
    AND auth.uid() IS NOT NULL
  );

-- Политика: Пользователи могут обновлять свои изображения
CREATE POLICY "Пользователи могут обновлять свои файлы" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'communities' 
    AND auth.uid() = owner
  );

-- Политика: Пользователи могут удалять свои изображения
CREATE POLICY "Пользователи могут удалять свои файлы" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'communities' 
    AND auth.uid() = owner
  );
```

## Структура хранения

Изображения будут храниться по следующей структуре:

```
communities/
  └── {community-slug}/
      ├── {community-slug}-avatar-{timestamp}.{ext}
      └── {community-slug}-cover-{timestamp}.{ext}
```

## Использование

Функции для работы с изображениями находятся в:
- `app/dashboard/create-community/actions.ts`

### Пример загрузки аватара:

```typescript
const result = await uploadCommunityImage(
  file,
  'avatar',
  'my-community-slug'
);

if (result.success) {
  console.log('URL:', result.url);
}
```

### Пример загрузки обложки:

```typescript
const result = await uploadCommunityImage(
  file,
  'cover',
  'my-community-slug'
);

if (result.success) {
  console.log('URL:', result.url);
}
```

## Ограничения

- Максимальный размер файла: 5MB (настраивается в Supabase Dashboard)
- Допустимые форматы: jpg, jpeg, png, webp, gif
- Рекомендуемые размеры:
  - Аватар: 400x400px (круглый)
  - Обложка: 1200x400px