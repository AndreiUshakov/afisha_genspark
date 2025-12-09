# Исправление проблемы 404 при подтверждении email

## Проблема

При переходе по ссылке подтверждения email из письма Supabase отображалась страница 404 Not Found.

### Пример ссылки из письма:
```
https://afisa-ushakovandrei.amvera.io/auth/v1/verify?token=pkce_...&type=signup&redirect_to=https://afisa-ushakovandrei.amvera.io/auth/callback
```

## Причина

Supabase формирует ссылки подтверждения email используя путь `/auth/v1/verify`, который является внутренним API endpoint Supabase. В приложении Next.js этот маршрут не был реализован, что приводило к ошибке 404.

## Решение

Создан новый маршрут [`app/auth/v1/verify/route.ts`](../app/auth/v1/verify/route.ts), который:

1. **Принимает параметры из ссылки подтверждения:**
   - `token` - токен подтверждения от Supabase
   - `type` - тип подтверждения (signup, recovery, email_change)
   - `redirect_to` - URL для перенаправления после подтверждения

2. **Обрабатывает подтверждение email:**
   ```typescript
   const { data, error } = await supabase.auth.verifyOtp({
     token_hash: token,
     type: 'signup'
   })
   ```

3. **Перенаправляет пользователя:**
   - При успехе → на `/dashboard` или указанный `redirect_to`
   - При ошибке → на `/auth/login` с сообщением об ошибке

## Структура маршрута

```
app/
  auth/
    v1/
      verify/
        route.ts  ← Новый файл
```

## Как работает

### 1. Пользователь регистрируется
```typescript
// app/auth/register/actions.ts
await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${siteUrl}/auth/callback`
  }
})
```

### 2. Supabase отправляет письмо
Письмо содержит ссылку вида:
```
https://your-site.com/auth/v1/verify?token=...&type=signup&redirect_to=...
```

### 3. Пользователь кликает по ссылке
Запрос попадает на маршрут `/auth/v1/verify`

### 4. Маршрут обрабатывает подтверждение
```typescript
// app/auth/v1/verify/route.ts
export async function GET(request: NextRequest) {
  const token = requestUrl.searchParams.get('token')
  const type = requestUrl.searchParams.get('type')
  
  if (type === 'signup') {
    await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup'
    })
  }
  
  return NextResponse.redirect(`${origin}/dashboard`)
}
```

### 5. Пользователь перенаправляется
После успешного подтверждения пользователь попадает в личный кабинет с подтвержденным email.

## Логирование

Маршрут включает подробное логирование для отладки:

```typescript
console.log('=== EMAIL VERIFICATION REQUEST ===')
console.log('Token:', token ? 'present' : 'missing')
console.log('Type:', type)
console.log('Redirect to:', redirectTo)
```

## Обработка ошибок

### Отсутствует токен
```
Redirect → /auth/login?error=Неверная ссылка подтверждения
```

### Ошибка подтверждения
```
Redirect → /auth/login?error=Не удалось подтвердить email. Попробуйте войти или запросите новое письмо.
```

### Неожиданная ошибка
```
Redirect → /auth/login?error=Произошла ошибка при подтверждении email
```

## Связанные файлы

- [`app/auth/v1/verify/route.ts`](../app/auth/v1/verify/route.ts) - Новый маршрут подтверждения
- [`app/auth/callback/route.ts`](../app/auth/callback/route.ts) - Существующий callback (для OAuth)
- [`app/auth/register/actions.ts`](../app/auth/register/actions.ts) - Регистрация пользователя
- [`docs/EMAIL_VERIFICATION_IMPLEMENTATION.md`](./EMAIL_VERIFICATION_IMPLEMENTATION.md) - Общая документация

## Тестирование

После деплоя на хостинг:

1. Зарегистрируйте нового пользователя
2. Проверьте почту и найдите письмо от Supabase
3. Кликните по ссылке подтверждения
4. Убедитесь, что вы перенаправлены на `/dashboard`
5. Проверьте, что баннер "Подтвердите email" больше не отображается

## Важные замечания

- Маршрут работает только для GET запросов
- Токен используется один раз и становится недействительным после подтверждения
- Если пользователь уже подтвержден, повторное подтверждение не требуется
- Ссылка подтверждения имеет ограниченный срок действия (обычно 24 часа)

## Дальнейшие улучшения

1. Добавить страницу успешного подтверждения вместо прямого редиректа
2. Реализовать повторную отправку письма подтверждения
3. Добавить обработку истекших токенов
4. Создать красивую страницу ошибки вместо редиректа с параметром error