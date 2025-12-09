# Исправление редиректа на localhost при подтверждении email

## Проблема

При переходе по ссылке подтверждения email из письма браузер показывал ошибку:
```
https://localhost:3000/auth/login?error=Произошла ошибка при подтверждении email
```

### Причины проблемы

1. **Неправильный origin в коде**: В [`route.ts`](../app/auth/v1/verify/route.ts) использовался `requestUrl.origin`, который брал origin из текущего запроса вместо правильного домена production
2. **Неправильная конкатенация URL**: Параметр `redirect_to` уже содержал полный URL (`https://afisa-ushakovandrei.amvera.io/auth/callback`), но код пытался добавить к нему origin, что приводило к ошибке: `https://localhost:3000https://afisa-ushakovandrei.amvera.io/auth/callback`
3. **Неправильная переменная окружения**: В `.env.local` был установлен `NEXT_PUBLIC_SITE_URL=http://localhost:3000` вместо production URL

### Логи ошибок

```
Origin: https://localhost:3000
Redirect to: https://afisa-ushakovandrei.amvera.io/auth/callback
Неожиданная ошибка при подтверждении: Error: URL is malformed "https://localhost:3000https://afisa-ushakovandrei.amvera.io/auth/callback"
```

## Решение

### 1. Исправлен [`app/auth/v1/verify/route.ts`](../app/auth/v1/verify/route.ts)

**Изменения:**

- Заменен `requestUrl.origin` на `process.env.NEXT_PUBLIC_SITE_URL`
- Добавлена проверка, является ли `redirect_to` полным URL
- Если `redirect_to` уже полный URL (начинается с `http://` или `https://`), используется напрямую
- Иначе добавляется к `siteUrl`

**Код до:**
```typescript
const origin = requestUrl.origin
// ...
const finalRedirect = redirectTo || '/dashboard'
return NextResponse.redirect(`${origin}${finalRedirect}`)
```

**Код после:**
```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin
// ...
let finalRedirect: string
if (redirectTo) {
  // Проверяем, является ли redirectTo полным URL
  if (redirectTo.startsWith('http://') || redirectTo.startsWith('https://')) {
    finalRedirect = redirectTo
  } else {
    finalRedirect = `${siteUrl}${redirectTo}`
  }
} else {
  finalRedirect = `${siteUrl}/dashboard`
}

return NextResponse.redirect(finalRedirect)
```

### 2. Обновлен [`.env.local`](../.env.local)

**Изменения:**

```env
# Было:
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Стало:
NEXT_PUBLIC_SITE_URL=https://afisa-ushakovandrei.amvera.io
```

**Примечание:** Для локальной разработки нужно использовать `http://localhost:3000`

### 3. Проверен [`app/auth/register/actions.ts`](../app/auth/register/actions.ts)

Код регистрации уже правильно использует `process.env.NEXT_PUBLIC_SITE_URL`:

```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${siteUrl}/auth/callback`,
    // ...
  }
})
```

## Настройки Supabase Auth

Убедитесь, что в контейнере `supabase-auth` установлены правильные переменные:

```env
SITE_URL=https://afisa-ushakovandrei.amvera.io
ADDITIONAL_REDIRECT_URLS=https://afisa-ushakovandrei.amvera.io/auth/callback
API_EXTERNAL_URL=https://afisa-ushakovandrei.amvera.io
MAILER_URLPATHS_CONFIRMATION="/auth/v1/verify"
```

## Тестирование

После применения исправлений:

1. Зарегистрируйте нового пользователя
2. Проверьте письмо подтверждения
3. Перейдите по ссылке из письма
4. Убедитесь, что редирект происходит на правильный домен: `https://afisa-ushakovandrei.amvera.io/auth/callback`

## Дополнительные замечания

### Для локальной разработки

Если вы работаете локально, установите в `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Для production

Для production обязательно установите:

```env
NEXT_PUBLIC_SITE_URL=https://afisa-ushakovandrei.amvera.io
```

### Проблема с `otp_expired`

Если вы видите ошибку `otp_expired`, это означает, что:
- Токен подтверждения истек (обычно действителен 24 часа)
- Токен уже был использован
- Произошло несколько попыток подтверждения одного и того же токена

**Решение:** Запросите новое письмо подтверждения или попробуйте войти в систему.

## Связанные файлы

- [`app/auth/v1/verify/route.ts`](../app/auth/v1/verify/route.ts) - обработчик подтверждения email
- [`app/auth/register/actions.ts`](../app/auth/register/actions.ts) - действия регистрации
- [`.env.local`](../.env.local) - переменные окружения
- [`lib/supabase/server.ts`](../lib/supabase/server.ts) - серверный клиент Supabase

## История изменений

- **2025-12-09**: Исправлена проблема с редиректом на localhost при подтверждении email