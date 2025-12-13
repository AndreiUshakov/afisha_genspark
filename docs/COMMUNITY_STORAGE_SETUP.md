# Настройка Storage для изображений сообществ

## Создание bucket в Supabase

Выполните следующий SQL запрос в Supabase SQL Editor или используйте готовый файл `supabase/fix-communities-storage-policies-v2.sql`:

```sql
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
-- Путь файла: {communityId}/{filename}
-- Извлекаем communityId из первой части пути используя split_part
CREATE POLICY "Community owners can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'communities'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 
    FROM public.communities 
    WHERE id::text = split_part(name, '/', 1)
    AND owner_id = auth.uid()
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
    FROM public.communities 
    WHERE id::text = split_part(name, '/', 1)
    AND owner_id = auth.uid()
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
    FROM public.communities 
    WHERE id::text = split_part(name, '/', 1)
    AND owner_id = auth.uid()
  )
);
```

**ВАЖНО:** 
- Эти политики используют `split_part(name, '/', 1)` для извлечения communityId из пути
- `EXISTS` более эффективен чем подзапрос с `=` для проверки прав
- Используется явное приведение типов `id::text` для сравнения UUID с текстом

## Структура хранения

Изображения будут храниться по следующей структуре:

```
communities/
  └── {community-id}/
      ├── avatar-{timestamp}.{ext}
      └── cover-{timestamp}.{ext}
```

**Примечание:** Используется UUID сообщества (id), а не slug, для уникальности путей.

**Пример пути:** `abc123-def456-uuid/avatar-1702473600000.jpg`

## Использование

Функции для работы с изображениями находятся в:
- `app/dashboard/create-community/actions.ts`
- `app/dashboard/community/[slug]/settings/design/actions.ts`

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

## Troubleshooting

### Ошибка "new row violates row-level security policy"

Если вы получаете эту ошибку при загрузке изображений:

1. Убедитесь, что вы выполнили SQL скрипт выше (используйте v2: `supabase/fix-communities-storage-policies-v2.sql`)
2. Проверьте, что политики созданы в Supabase Dashboard → Storage → Policies
3. Убедитесь, что пользователь авторизован и является владельцем сообщества
4. Проверьте формат пути файла: должен быть `{communityId}/{filename}`

### Почему используется split_part вместо string_to_array

`split_part(name, '/', 1)` более эффективен и надёжен для извлечения первой части пути, чем `(string_to_array(name, '/'))[1]`:
- Работает быстрее
- Не создаёт массив в памяти
- Более читаем

### Проверка политик

Выполните в SQL Editor:

```sql
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%ommunit%';
```

Вы должны увидеть 4 политики для бакета communities:
- Communities public read access (SELECT)
- Community owners can upload images (INSERT)
- Community owners can update images (UPDATE)
- Community owners can delete images (DELETE)

### Тестирование политик

Вы можете протестировать извлечение communityId из пути:

```sql
-- Тест функции split_part
SELECT 
  'abc-123-uuid/avatar-123.jpg' as full_path,
  split_part('abc-123-uuid/avatar-123.jpg', '/', 1) as community_id,
  split_part('abc-123-uuid/avatar-123.jpg', '/', 2) as filename;
```

Результат должен быть:
- full_path: `abc-123-uuid/avatar-123.jpg`
- community_id: `abc-123-uuid`
- filename: `avatar-123.jpg`