# 📧 Настройка Email подтверждения с UniSender Go

## 🔍 Проблема

При регистрации на сайте появляется ошибка: **"Ошибка! Error sending confirmation email"**

## 📊 Текущая ситуация

### Что есть сейчас:
- ✅ Supabase сервер воссоздан и работает
- ✅ Регистрация пользователей работает (пользователь создаётся в БД)
- ❌ Email подтверждения не отправляются
- ✅ Есть доступ к UniSender Go с API ключом
- ⚠️ В `.env.local` установлен `GOTRUE_MAILER_AUTOCONFIRM=true` (временное решение)

### Почему не работает:
Supabase использует встроенный сервис GoTrue для аутентификации. По умолчанию GoTrue пытается отправлять email через встроенный SMTP, но:
1. Self-hosted Supabase не имеет преднастроенного SMTP
2. Необходимо настроить внешний SMTP-сервер (UniSender Go)
3. Нужно правильно сконфигурировать GoTrue для работы с внешним SMTP

## 🎯 Решен��е

### Вариант 1: Настройка SMTP в Supabase (Рекомендуется)

Настроить GoTrue для использования UniSender Go через SMTP.

**Преимущества:**
- ✅ Полная интеграция с Supabase Auth
- ✅ Автоматическая отправка всех системных email (подтверждение, сброс пароля)
- ✅ Использование шаблонов Supabase

**Недостатки:**
- ⚠️ Требует доступа к конфигурации GoTrue на сервере
- ⚠️ Может быть сложно настроить на self-hosted версии

### Вариант 2: Кастомная отправка через API UniSender Go

Отправлять email вручную ч��рез API UniSender Go после регистрации.

**Преимущества:**
- ✅ Полный контроль над содержимым писем
- ✅ Гибкость в настройке шаблонов
- ✅ Не зависит от конфигурации Supabase

**Недостатки:**
- ❌ Нужно реализовывать логику для всех типов email
- ❌ Дополнительный код и поддержка

## 📋 План действий

### Этап 1: Проверка текущей конфигурации Supabase

**Что нужно проверить:**

1. **Supabase Dashboard → Authentication → Email Templates**
   - Проверить, какие шаблоны доступны
   - Посмотреть настройки SMTP

2. **Supabase Dashboard → Project Settings → API**
   - Убедиться, что URL и ключи корректны

3. **Проверить docker-compose.yml или конфигурацию GoTrue**
   - Найти файл конфигурации GoTrue
   - Проверить текущие настройки SMTP

### Этап 2: Получение данных UniSender Go

**Необходимая информация:**

```
SMTP Host: smtp.unisender.com
SMTP Port: 587 (или 465 для SSL)
SMTP Username: ваш_email_или_логин
SMTP Password: ваш_api_ключ_или_пароль
From Email: noreply@yourdomain.com (или ваш email)
From Name: Афиша Иркутска
```

**Где найти:**
- Войдите в [UniSender Go Dashboard](https://go.unisender.com/)
- Перейдите в раздел **Настройки → SMTP**
- Скопируйте данные для подключения

### Этап 3: Настройка SMTP в Supabase

#### Способ A: Через переменные окружения (для self-hosted)

Добавьте в конфигурацию GoTrue (обычно в `docker-compose.yml` или `.env`):

```env
# GoTrue SMTP Configuration
GOTRUE_SMTP_HOST=smtp.unisender.com
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=ваш_smtp_username
GOTRUE_SMTP_PASS=ваш_smtp_password
GOTRUE_SMTP_ADMIN_EMAIL=noreply@yourdomain.com
GOTRUE_SMTP_SENDER_NAME=Афиша Иркутска

# Отключить автоподтверждение
GOTRUE_MAILER_AUTOCONFIRM=false

# URL для редиректа после подтверждения
GOTRUE_SITE_URL=https://afisa-ushakovandrei.amvera.io
```

#### Способ B: Через Supabase Dashboard (для hosted)

1. Откройте **Supabase Dashboard**
2. Перейдите в **Authentication → Settings**
3. Найдите раздел **SMTP Settings**
4. Заполните данные UniSender Go
5. Сохраните изменения

### Этап 4: Обновл��ние кода регистрации

Обновите [`app/auth/register/actions.ts`](../app/auth/register/actions.ts):

```typescript
export async function signUp(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Валидация...
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: {
          email,
        }
      }
    })

    if (error) {
      // Обработка ошибок SMTP
      if (error.message.includes('confirmation email')) {
        console.error('SMTP Error:', error)
        
        // Опция 1: Вернуть успех, но предупредить пользователя
        return { 
          success: true, 
          warning: 'Регистрация успешна, но письмо не отправлено. Обратитесь к администратору.' 
        }
        
        // Опция 2: Отправить email через UniSender Go API
        // await sendConfirmationEmailViaUniSender(email, data.user.id)
      }
      
      return { error: error.message }
    }

    if (!data.user) {
      return { error: 'Не удалось создать пользователя' }
    }

    return { 
      success: true,
      message: 'Проверьте email для подтверждения регистрации'
    }
  } catch (err) {
    console.error('Registration error:', err)
    return { error: 'Произошла ошибка при регистрации' }
  }
}
```

### Этап 5: Альтернатива - Отправка через UniSender Go API

Если настройка SMTP не работает, можно отправлять email напрямую через API:

**Создайте файл:** `lib/email/unisender.ts`

```typescript
interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmailViaUniSender({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.UNISENDER_API_KEY
  
  if (!apiKey) {
    throw new Error('UNISENDER_API_KEY not configured')
  }

  const response = await fetch('https://go1.unisender.ru/ru/transactional/api/v1/email/send.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify({
      message: {
        recipients: [{ email: to }],
        subject,
        body: {
          html,
        },
        from_email: 'noreply@yourdomain.com',
        from_name: 'Афиша Иркутска',
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`UniSender error: ${JSON.stringify(error)}`)
  }

  return response.json()
}

export async function sendConfirmationEmail(email: string, confirmationUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>Подтвердите регистрацию</h1>
        <p>Спасибо за регистрацию на Афише Иркутска!</p>
        <p>Для завершения регистрации перейдите по ссылке:</p>
        <a href="${confirmationUrl}">Подтвердить email</a>
        <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
      </body>
    </html>
  `

  return sendEmailViaUniSender({
    to: email,
    subject: 'Подтвердите регистрацию на Афише Иркутска',
    html,
  })
}
```

**Обновите `.env.local`:**

```env
# UniSender Go API
UNISENDER_API_KEY=ваш_api_ключ
```

**Используйте в регистрации:**

```typescript
import { sendConfirmationEmail } from '@/lib/email/unisender'

// После успешной регистрации
if (data.user && !data.session) {
  // Пользователь создан, но не подтверждён
  const confirmationUrl = `${siteUrl}/auth/v1/verify?token=${data.user.confirmation_token}&type=signup`
  
  try {
    await sendConfirmationEmail(email, confirmationUrl)
    return { 
      success: true,
      message: 'Проверьте email для подтверждения регистрации'
    }
  } catch (emailError) {
    console.error('Email sending error:', emailError)
    return {
      success: true,
      warning: 'Регистрация успешна, но письмо не отправлено'
    }
  }
}
```

## 🔧 Конфигурация для разных окружений

### Локальная разработка

```env
# .env.local
GOTRUE_MAILER_AUTOCONFIRM=true  # Автоподтверждение для разработки
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Amvera)

```env
# Переменные окружения в Amvera
GOTRUE_MAILER_AUTOCONFIRM=false
GOTRUE_SMTP_HOST=smtp.unisender.com
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=ваш_username
GOTRUE_SMTP_PASS=ваш_password
GOTRUE_SMTP_ADMIN_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://afisa-ushakovandrei.amvera.io
```

## 📝 Шаблоны Email

### Подтверждение регистрации

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background: #4F46E5; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Добро пожаловать на Афишу Иркутска! 🎉</h1>
    <p>Спасибо за регистрацию!</p>
    <p>Для завершения регистрации подтвердите ваш email адрес:</p>
    <p>
      <a href="{{ .ConfirmationURL }}" class="button">Подтвердить email</a>
    </p>
    <p>Или скопируйте эту ссылку в браузер:</p>
    <p>{{ .ConfirmationURL }}</p>
    <hr>
    <p style="color: #666; font-size: 12px;">
      Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
    </p>
  </div>
</body>
</html>
```

### Сброс пароля

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background: #4F46E5; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Сброс пароля</h1>
    <p>Вы запросили сброс пароля для вашего аккаунта на Афише Иркутска.</p>
    <p>Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
    <p>
      <a href="{{ .ConfirmationURL }}" class="button">Сбросить пароль</a>
    </p>
    <p>Или скопируйте эту ссылку в браузер:</p>
    <p>{{ .ConfirmationURL }}</p>
    <p>Ссылка действительна в течение 1 часа.</p>
    <hr>
    <p style="color: #666; font-size: 12px;">
      Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
    </p>
  </div>
</body>
</html>
```

## 🧪 Тестирование

### 1. Проверка SMTP подключения

```bash
# Используйте telnet или openssl для проверки
openssl s_client -connect smtp.unisender.com:587 -starttls smtp
```

### 2. Тест регистрации

1. Откройте сайт
2. Перейдите на страницу регистрации
3. Зарегистрируйте тестовый аккаунт
4. Проверьте:
   - Пользователь создан в БД
   - Email отправлен
   - Ссылка подтверждения работает

### 3. Проверка логов

```bash
# Проверьте логи Supabase
docker logs supabase-auth

# Или в Supabase Dashboard → Logs
```

## 🔍 Диагностика проблем

### Ошибка: "Error sending confirmation email"

**Возможные причины:**
1. SMTP не настроен
2. Неверные учётные данные UniSender
3. Блокировка порта 587/465
4. Неверный формат email отправителя

**Решение:**
- Проверьте логи GoTrue
- Убедитесь, что SMTP данные корректны
- Попробуйте другой порт (587 → 465)
- Проверьте, что email отправителя подтверждён в UniSender

### Ошибка: "Invalid SMTP credentials"

**Решение:**
- Проверьте API ключ UniSender
- Убедитесь, что используете правильный username/password
- Проверьте, что аккаунт UniSender активен

### Email не приходит

**Проверьте:**
1. Папку "Спам"
2. Логи UniSender Dashboard
3. Квоту отправки в UniSender
4. Правильность email адреса получателя

## 📚 Полезные ссылки

- [UniSender Go API Documentation](https://www.unisender.com/ru/support/api/api/)
- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
- [GoTrue SMTP Settings](https://github.com/supabase/gotrue#smtp-configuration)

## ✅ Чеклист настройки

- [ ] Получить SMTP данные из UniSender Go
- [ ] Настроить SMTP в Supabase/GoTrue
- [ ] Обновить переменные окружения
- [ ] Отключить `GOTRUE_MAILER_AUTOCONFIRM`
- [ ] Создать email шаблоны
- [ ] Протестировать регистрацию
- [ ] Протестировать сброс пароля
- [ ] Проверить все типы email уведомлений
- [ ] Задеплоить на production
- [ ] Проверить работу на production

## 🎯 Следующие шаги

1. **Соберите данные UniSender Go:**
   - SMTP host, port, username, password
   - API ключ (если будете использовать API)

2. **Выберите подход:**
   - Вариант 1: Настройка SMTP в GoTrue (рекомендуется)
   - Вариант 2: Отправка через API UniSender Go

3. **Реализуйте выбранный вариант**

4. **Протестируйте на локальной машине**

5. **Задеплойте на production**

---

**Готовы начать? Сообщите, какой вариант вы выбрали, и я помогу с реализацией!** 🚀
