# Настройка переменных окружения на Amvera

## Проблема

При деплое на Amvera переменные окружения из `.env.local` могут не передаваться в браузер, что приводит к ошибке:
```
@supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

## Решение

### 1. Настройка в панели Amvera

Перейдите в настройки вашего проекта на Amvera и добавьте следующие переменные окружения:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://supabase.sober-automation.ru
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY0MjU3MTg5LCJleHAiOjIwNzk2MTcxODl9.ReaUQtUbOnQNTp6k45izYYue2V3QueFrEuHIrOxEU7Q
NEXT_PUBLIC_SITE_URL=https://afisa-ushakovandrei.amvera.io
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjQyNTcxODksImV4cCI6MjA3OTYxNzE4OX0.lKiBs8K0boXgWb-WA8ioN4C31hGczHKvcOnwKSMlSMs
```

### 2. Обновлен next.config.ts

В конфигурации Next.js добавлена секция `env`, которая явно экспортирует переменные окружения для клиента:

```typescript
env: {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
}
```

### 3. Улучшена обработка ошибок

В [`lib/supabase/client.ts`](../lib/supabase/client.ts) добавлена проверка наличия переменных окружения с понятным сообщением об ошибке.

## После настройки

1. Сохраните переменные окружения в панели Amvera
2. Выполните повторный деплой проекта
3. Проверьте, что переменные доступны в браузере:
   - Откройте DevTools → Console
   - Выполните: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
   - Должен вывестись URL Supabase

## Проверка работоспособности

После деплоя проверьте:
1. Страница `/dashboard/create-community` открывается без ошибок
2. Можно войти в систему
3. Email подтверждение работает
4. Создание сообщества сохраняет данные в БД

## Важно

⚠️ **NEXT_PUBLIC_*** переменные встраиваются в JavaScript bundle и доступны в браузере. НЕ используйте их для секретных ключей!

✅ **SUPABASE_SERVICE_ROLE_KEY** используется только на сервере и не попадает в браузер.