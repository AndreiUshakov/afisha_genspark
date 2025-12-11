# Решение проблемы Mixed Content для изображений

## Проблема

При использовании HTTPS для сайта и HTTP для Supabase возникает ошибка Mixed Content:
```
ERR_SSL_UNRECOGNIZED_NAME_ALERT
```

Браузеры блокируют загрузку HTTP-контента (изображений) на HTTPS-страницах из соображений безопасности.

## Решение: Прокси через Next.js API Routes

Создан API endpoint [`/api/storage/[...path]`](../app/api/storage/[...path]/route.ts), который проксирует запросы к изображениям через сервер Next.js.

### Как это работает

1. **Клиент** запрашивает изображение по HTTPS: `https://ваш-сайт.ru/api/storage/profiles/avatars/file.png`
2. **Next.js сервер** получает запрос и загружает файл из Supabase по HTTP
3. **Сервер** возвращает изображение клиенту по HTTPS
4. **Браузер** получает изображение по безопасному соединению

### Преимущества

✅ Работает без настройки SSL для Supabase  
✅ Не требует изменений в конфигурации сервера  
✅ Кеширование на уровне браузера (1 год)  
✅ Прозрачно для пользователя  

### Недостатки

⚠️ Дополнительная нагрузка на Next.js сервер  
⚠️ Увеличенное время загрузки (двойной запрос)  
⚠️ Использование bandwidth сервера Next.js  

## Структура файлов

```
app/
├── api/
│   └── storage/
│       └── [...path]/
│           └── route.ts                    # Прокси для изображений
└── dashboard/
    ├── profile/
    │   └── actions.ts                      # Аватары профилей через прокси
    └── create-community/
        └── actions.ts                      # Изображения сообществ через прокси
```

## Использование

### В коде

Все изображения автоматически сохраняются с URL через прокси:

```typescript
// Старый способ (не работает с HTTP Supabase на HTTPS сайте)
const publicUrl = `http://supabase.sober-automation.ru/storage/v1/object/public/profiles/${filePath}`

// Новый способ (работает через прокси)
const publicUrl = `/api/storage/profiles/${filePath}`

// Для изображений сообществ
const proxyUrl = `/api/storage/community-images/${filePath}`
```

### Примеры URL

**Прямая ссылка (не работает):**
```
http://supabase.sober-automation.ru/storage/v1/object/public/profiles/avatars/file.png
```

**Через прокси (работает):**
```
https://ваш-сайт.ru/api/storage/profiles/avatars/file.png
```

## Миграция существующих аватаров

Если у вас уже есть аватары с прямыми ссылками, обновите их через SQL:

```sql
UPDATE profiles 
SET avatar_url = REPLACE(
  avatar_url,
  'http://supabase.sober-automation.ru/storage/v1/object/public/',
  '/api/storage/'
)
WHERE avatar_url LIKE 'http://supabase.sober-automation.ru%';
```

Или просто загрузите аватары заново - они автоматически получат правильный URL.

## Альтернативное решение (рекомендуется для production)

Для production-окружения рекомендуется настроить SSL для Supabase:

### 1. Настройте SSL-сертификат

Получите SSL-сертификат для `supabase.sober-automation.ru` (например, через Let's Encrypt)

### 2. Обновите переменную окружения

```env
NEXT_PUBLIC_SUPABASE_URL=https://supabase.sober-automation.ru
```

### 3. Удалите прокси (опционально)

После настройки SSL можно вернуться к прямым ссылкам:

```typescript
// В app/dashboard/profile/actions.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const publicUrl = `${supabaseUrl}/storage/v1/object/public/profiles/${filePath}`
```

### 4. Обновите существующие URL

```sql
UPDATE profiles 
SET avatar_url = REPLACE(
  avatar_url,
  '/api/storage/',
  'https://supabase.sober-automation.ru/storage/v1/object/public/'
)
WHERE avatar_url LIKE '/api/storage/%';
```

## Производительность

### Кеширование

API route настроен с агрессивным кешированием:

```typescript
'Cache-Control': 'public, max-age=31536000, immutable'
```

Это означает:
- Браузер кеширует изображение на 1 год
- Повторные запросы не доходят до сервера
- Изображения помечены как неизменяемые

### Оптимизация

Для улучшения производительности можно:

1. **Использовать CDN** перед Next.js
2. **Настроить кеширование** на уровне reverse proxy (nginx)
3. **Использовать Image Optimization** Next.js (требует изменений в коде)

## Troubleshooting

### Изображение не загружается

1. Проверьте, что файл существует в Supabase Storage
2. Проверьте URL в базе данных
3. Проверьте логи сервера Next.js
4. Проверьте переменную `NEXT_PUBLIC_SUPABASE_URL`

### Ошибка 404

Файл не найден в Supabase Storage. Проверьте:
- Правильность пути к файлу
- Существование bucket `profiles`
- Политики доступа к Storage

### Медленная загрузка

Это нормально для прокси-решения. Для ускорения:
- Настройте SSL для Supabase (рекомендуется)
- Используйте CDN
- Оптимизируйте размер изображений

## Связанные файлы

- API Route: [`app/api/storage/[...path]/route.ts`](../app/api/storage/[...path]/route.ts)
- Profile Actions: [`app/dashboard/profile/actions.ts`](../app/dashboard/profile/actions.ts)
- Community Actions: [`app/dashboard/create-community/actions.ts`](../app/dashboard/create-community/actions.ts)
- Next.js Config: [`next.config.ts`](../next.config.ts)

## Поддерживаемые Buckets

Прокси поддерживает все публичные buckets в Supabase Storage:
- `profiles` - аватары пользователей
- `community-images` - изображения сообществ (аватары, обложки)
- Любые другие публичные buckets