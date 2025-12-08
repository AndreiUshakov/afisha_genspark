# Настройка подтверждения Email для Production

## Проблема

При регистрации пользователя ссылка подтверждения email ведет на `https://supabase.sober-automation.ru` вместо сайта приложения `https://afisa-ushakovandrei.amvera.io/`.

## Решение

### 1. Настройка переменных окружения в Amvera

В панели управления Amvera обновите переменную окружения:

```
NEXT_PUBLIC_SITE_URL=https://afisa-ushakovandrei.amvera.io
```

**Важно:** Удалите `http://localhost:3000` и замените на production URL.

### 2. Настройка Supabase Auth (контейнер supabase-auth)

В конфигурации контейнера `supabase-auth` установите следующие переменные:

```yaml
environment:
  SITE_URL: "https://afisa-ushakovandrei.amvera.io"
  ADDITIONAL_REDIRECT_URLS: "https://afisa-ushakovandrei.amvera.io/auth/callback"
  GOTRUE_MAILER_AUTOCONFIRM: "false"  # Отключите автоподтверждение для production
```

### 3. Настройка SMTP для отправки email

Убедитесь, что в конфигурации `supabase-auth` настроены параметры SMTP:

```yaml
environment:
  GOTRUE_SMTP_HOST: "ваш-smtp-сервер"
  GOTRUE_SMTP_PORT: "587"
  GOTRUE_SMTP_USER: "info@garant-city.ru"
  GOTRUE_SMTP_PASS: "ваш-пароль"
  GOTRUE_SMTP_ADMIN_EMAIL: "info@garant-city.ru"
  GOTRUE_MAILER_SUBJECTS_CONFIRMATION: "Подтвердите ваш email"
```

### 4. Проверка изменений в коде

Код уже обновлен для корректной работы:

#### [`app/auth/register/actions.ts`](../app/auth/register/actions.ts)
- Добавлен параметр `emailRedirectTo` с динамическим URL из `NEXT_PUBLIC_SITE_URL`
- Ссылка подтверждения теперь ведет на `${SITE_URL}/auth/callback`

#### [`app/auth/callback/route.ts`](../app/auth/callback/route.ts)
- Улучшена обработка ошибок при обмене кода на сессию
- Добавлена поддержка параметра `next` для гибкого редиректа
- Логирование ошибок для отладки

## Процесс регистрации после настройки

1. **Пользователь регистрируется** на `/auth/register`
2. **Создается аккаунт** в Supabase
3. **Отправляется email** с ссылкой подтверждения
4. **Ссылка ведет на** `https://afisa-ushakovandrei.amvera.io/auth/callback?code=...`
5. **Callback обменивает код** на сессию
6. **Пользователь перенаправляется** на `/dashboard`

## Тестирование

### Локально (development)

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Amvera)

```bash
# Переменные окружения в Amvera
NEXT_PUBLIC_SITE_URL=https://afisa-ushakovandrei.amvera.io
```

## Проверка работы

1. Зарегистрируйте нового пользователя
2. Проверьте email - ссылка должна вести на `https://afisa-ushakovandrei.amvera.io/auth/callback?code=...`
3. Кликните по ссылке
4. Должен произойти редирект на `/dashboard` с активной сессией

## Возможные проблемы

### Ссылка все еще ведет на supabase.sober-automation.ru

**Решение:** Проверьте, что в Supabase Auth установлен `SITE_URL=https://afisa-ushakovandrei.amvera.io`

### Ошибка "Invalid redirect URL"

**Решение:** Добавьте URL в `ADDITIONAL_REDIRECT_URLS` в конфигурации Supabase Auth

### Email не приходит

**Решение:** Проверьте настройки SMTP в конфигурации `supabase-auth`

### Ошибка при переходе по ссылке

**Решение:** Проверьте логи в `/auth/callback/route.ts` - там будет информация об ошибке

## Дополнительная информация

- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth/auth-email)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)