# Настройка Storage для изображений сообществ

## Создание bucket в Supabase

Выполните следующий SQL запрос в Supabase SQL Editor или используйте готовый файл `supabase/fix-communities-storage-policies-v3.sql`:

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
```

**КРИТИЧЕСКИ ВАЖНО:** 
- Используется `storage.objects.name` (путь файла), а НЕ `communities.name` (slug сообщества)
- Используется алиас `c` для таблицы `communities` для читаемости
- `split_part(storage.objects.name, '/', 1)` извлекает communityId из пути файла

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

1. **Убедитесь, что вы выполнили правильный SQL скрипт**
   
   Используйте **v3**: `supabase/fix-communities-storage-policies-v3.sql`

2. **Проверьте политики в интерфейсе Supabase**
   
   Storage → Policies → communities bucket
   
   В условии политики должно быть:
   ```
   split_part(storage.objects.name, '/', 1)
   ```
   
   А **НЕ**:
   ```
   split_part(communities.name, '/', 1)  -- НЕПРАВИЛЬНО!
   ```

3. **Убедитесь, что пользователь является владельцем сообщества**

4. **Проверьте формат пути файла:** `{communityId}/{filename}`

### Конфликт имён в SQL политиках

**Проблема:** В PostgreSQL, если не указать таблицу явно, поле `name` может относиться к неправильной таблице.

```sql
-- НЕПРАВИЛЬНО (конфликт имён):
FROM public.communities 
WHERE id::text = split_part(name, '/', 1)
-- name здесь = communities.name (slug), а не путь файла!

-- ПРАВИЛЬНО (явное указание):
FROM public.communities c
WHERE c.id::text = split_part(storage.objects.name, '/', 1)
-- storage.objects.name = путь файла
```

### Проверка политик через SQL

Выполните в SQL Editor:

```sql
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%ommunit%';
```

Вы должны увидеть 4 политики:
- Communities public read access (SELECT)
- Community owners can upload images (INSERT)
- Community owners can update images (UPDATE)
- Community owners can delete images (DELETE)

### Тестирование извлечения communityId

Вы можете протестировать функцию split_part:

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

### Тестирование политики с конкретным communityId

```sql
-- Замените YOUR_COMMUNITY_ID на реальный UUID сообщества
-- и YOUR_USER_ID на реальный UUID пользователя
SELECT 
  c.id,
  c.name,
  c.owner_id,
  split_part('YOUR_COMMUNITY_ID/avatar-123.jpg', '/', 1) as extracted_id,
  c.id::text = split_part('YOUR_COMMUNITY_ID/avatar-123.jpg', '/', 1) as id_matches
FROM public.communities c
WHERE c.id::text = 'YOUR_COMMUNITY_ID';
```

Поле `id_matches` должно быть `true`.

## История версий политик

### v1 (НЕ РАБОТАЕТ)
```sql
WHERE id::text = (string_to_array(name, '/'))[1]
```
Проблема: неэффективно, ненадёжно

### v2 (НЕ РАБОТАЕТ)
```sql
WHERE id::text = split_part(name, '/', 1)
```
Проблема: конфликт имён - `name` относится к `communities.name`

### v3 (РАБОТАЕТ ✅)
```sql
WHERE c.id::text = split_part(storage.objects.name, '/', 1)
```
Решение: явное указание таблиц и алиасы

## Дополнительные ресурсы

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL split_part function](https://www.postgresql.org/docs/current/functions-string.html)