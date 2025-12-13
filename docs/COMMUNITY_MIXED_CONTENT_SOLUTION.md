# Решение проблемы Mixed Content для создания сообщества

## Проблема

При загрузке изображений сообщества (аватар, обложка) на HTTPS сайте возникала ошибка Mixed Content, так как Supabase Storage работает по HTTP.

## Решение

Реализовано проксирование изображений через Next.js API endpoint [`/api/storage/[...path]`](../app/api/storage/[...path]/route.ts).

### Что было изменено

1. **Функция [`uploadCommunityImage`](../app/dashboard/create-community/actions.ts:115) в actions.ts**
   - Вместо прямого публичного URL от Supabase теперь возвращается URL через прокси
   - Было: `https://supabase.../storage/v1/object/public/communities/...`
   - Стало: `/api/storage/communities/...`

2. **API прокси** уже поддерживал любые buckets, изменения не требовались

## Как это работает

```
Клиент (HTTPS) 
    ↓
/api/storage/communities/path/to/image.jpg (HTTPS)
    ↓
Next.js Server
    ↓
Supabase Storage (HTTP) ← загружает файл
    ↓
Next.js Server
    ↓
Клиент (HTTPS) ← получает изображение
```

## Преимущества

✅ Решает проблему Mixed Content без настройки SSL для Supabase  
✅ Работает "из коробки" для всех изображений сообщества  
✅ Кеширование на 1 год (браузер не запрашивает файл повторно)  
✅ Прозрачно для пользователя  

## Тестирование

Чтобы убедиться, что решение работает:

1. Откройте страницу создания сообщества
2. Загрузите изображение (аватар или обложку)
3. Проверьте в Developer Tools → Network:
   - URL изображения должен быть `/api/storage/communities/...`
   - Статус ответа: `200 OK`
   - Content-Type: `image/jpeg` или `image/png`
4. Проверьте консоль - не должно быть ошибок Mixed Content

## Миграция существующих изображений

Если у вас уже есть сообщества с прямыми ссылками на Supabase, обновите их через SQL:

```sql
UPDATE communities 
SET 
  avatar_url = REPLACE(
    avatar_url,
    'http://supabase.sober-automation.ru/storage/v1/object/public/',
    '/api/storage/'
  ),
  cover_url = REPLACE(
    cover_url,
    'http://supabase.sober-automation.ru/storage/v1/object/public/',
    '/api/storage/'
  )
WHERE 
  avatar_url LIKE 'http://supabase.sober-automation.ru%' 
  OR cover_url LIKE 'http://supabase.sober-automation.ru%';
```

## Связанные файлы

- API Route: [`app/api/storage/[...path]/route.ts`](../app/api/storage/[...path]/route.ts)
- Community Actions: [`app/dashboard/create-community/actions.ts`](../app/dashboard/create-community/actions.ts)
- Общая документация: [`docs/MIXED_CONTENT_FIX.md`](./MIXED_CONTENT_FIX.md)

## Альтернативное решение

Для production рекомендуется настроить SSL для Supabase и использовать HTTPS URL напрямую. См. [`docs/MIXED_CONTENT_FIX.md`](./MIXED_CONTENT_FIX.md) раздел "Альтернативное решение".