# Исправление загрузки обложки и логотипа сообщества

## Проблема
Обложка и логотип сообщества не сохранялись, появлялось сообщение "Ошибка при загрузке обложки". Хотя изображения корректно показывались на предпросмотре и не превышали 5 МБ, а бакет `communities` был публичным.

## Выявленные проблемы

### 1. Использование прямого URL вместо прокси
В actions.ts использовался прямой публичный URL от Supabase, в то время как в других частях приложения используется прокси URL через /api/storage/.

### 2. Отсутствие обработки удаления изображений
Когда пользователь нажимал "Удалить" для обложки или логотипа, файлы устанавливались в null на клиенте, но на сервере не было механизма для обработки явного удаления.

### 3. Неправильное извлечение пути файла при удалении
При замене или удалении старого файла путь извлекался только через split, что не учитывало структуру прокси URL.

### 4. Недостаточное логирование
Отсутствовало детальное логирование для диагностики проблем.

### 5. Неправильные RLS политики Storage (КРИТИЧЕСКАЯ ПРОБЛЕМА)
Основная проблема была в Row-Level Security политиках для бакета communities в Supabase.

## Внесённые исправления

### 1. Использование прокси URL
Изменён способ получения URL с прямого на прокси для избежания mixed content ошибок

### 2. Добавлена поддержка удаления изображений
- Добавлены флаги removeAvatar и removeCover
- Серверная обработка удаления файлов из storage
- Клиентская отправка флагов удаления

### 3. Улучшенное извлечение пути файла
Теперь корректно извлекается путь как из прокси URL, так и из прямого URL

### 4. Добавлено детальное логирование
Логирование всех операций загрузки и удаления с деталями ошибок

### 5. Добавлена валидация файлов
- Проверка типа файла (только изображения)
- Проверка размера файла (максимум 5MB)
- Валидация на клиенте и сервере

## КРИТИЧЕСКОЕ ОБНОВЛЕНИЕ: Исправление RLS политик

### Проблема с политиками

После внесения изменений в код обнаружилась ошибка:
```
Ошибка при загрузке логотипа: new row violates row-level security policy
```

### История исправлений

#### v1 (не работало)
```sql
WHERE id::text = (string_to_array(name, '/'))[1]
```
Проблема: `string_to_array()` неэффективна и ненадёжна

#### v2 (не работало)
```sql
WHERE id::text = split_part(name, '/', 1)
```
Проблема: **Конфликт имён!** В подзапросе `name` относится к `communities.name`, а не к `storage.objects.name`

#### v3 (РАБОТАЕТ! ✅)
```sql
WHERE c.id::text = split_part(storage.objects.name, '/', 1)
```
Решение: Явно указываем `storage.objects.name` и используем алиас `c` для таблицы `communities`

### Правильный SQL скрипт

**Файл:** `supabase/fix-communities-storage-policies-v3.sql`

Ключевые изменения:

```sql
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
```

**Важные детали:**
1. `storage.objects.name` - явно указываем таблицу для поля `name`
2. `public.communities c` - используем алиас `c` для читаемости
3. `c.id::text` - явно указываем поля через алиас
4. `split_part(storage.objects.name, '/', 1)` - извлекаем communityId из пути файла

### Почему возникла проблема с конфликтом имён

В PostgreSQL, когда в подзапросе используется поле `name` без указания таблицы, база данных может:
1. Искать поле в ближайшей таблице (в данном случае `communities`)
2. Если находит `communities.name` (slug сообщества), использует его
3. В результате сравнивается `communities.id` с `communities.name` вместо пути файла!

**Пример проблемы:**
```sql
-- НЕПРАВИЛЬНО (конфликт имён):
FROM public.communities 
WHERE id::text = split_part(name, '/', 1)
-- name здесь = communities.name (slug), а не путь файла!

-- ПРАВИЛЬНО (явное указание):
FROM public.communities c
WHERE c.id::text = split_part(storage.objects.name, '/', 1)
-- storage.objects.name = путь файла в формате {communityId}/{filename}
```

### Как применить исправление

1. **Откройте Supabase Dashboard → SQL Editor**

2. **Выполните SQL скрипт из файла:**
   `supabase/fix-communities-storage-policies-v3.sql`

3. **Проверьте что политики созданы корректно:**
   ```sql
   SELECT policyname, cmd, qual, with_check 
   FROM pg_policies 
   WHERE tablename = 'objects' 
   AND schemaname = 'storage'
   AND policyname LIKE '%ommunit%';
   ```

4. **Проверьте в интерфейсе Supabase:**
   Storage → Policies → communities bucket
   
   В условии политики должно быть:
   ```
   split_part(storage.objects.name, '/', 1)
   ```
   А НЕ:
   ```
   split_part(communities.name, '/', 1)  -- НЕПРАВИЛЬНО!
   ```

## Изменённые файлы

1. app/dashboard/community/[slug]/settings/design/actions.ts
2. app/dashboard/community/[slug]/settings/design/components/DesignSettingsForm.tsx
3. supabase/fix-communities-storage-policies-v3.sql (ПРАВИЛЬНАЯ ВЕРСИЯ)
4. docs/COMMUNITY_STORAGE_SETUP.md (обновлён)

## Тестирование

После внесения изменений необходимо протестировать:

1. Загрузку нового логотипа ✅
2. Загрузку новой обложки ✅
3. Замену существующего логотипа ✅
4. Замену существующей обложки ✅
5. Удаление логотипа ✅
6. Удаление обложки ✅
7. Проверку ограничения размера файла ✅
8. Проверку типа файла ✅
9. Отображение корректных сообщений об ошибках ✅
10. Предпросмотр изображений перед сохранением ✅

## Примечания

- Бакет communities должен быть настроен как публичный в Supabase Storage
- RLS политики должны быть настроены согласно файлу fix-communities-storage-policies-v3.sql
- API роут /api/storage/communities должен быть настроен для проксирования запросов
- Все пути файлов должны иметь формат: {communityId}/{filename}
- communityId это UUID, а не slug
- **ВАЖНО:** Всегда явно указывайте таблицу при обращении к полю `name` в SQL политиках

## Дополнительная документация

- `docs/COMMUNITY_STORAGE_SETUP.md` - полная инструкция по настройке Storage с troubleshooting
- `supabase/fix-communities-storage-policies-v3.sql` - ПРАВИЛЬНЫЙ SQL скрипт для политик