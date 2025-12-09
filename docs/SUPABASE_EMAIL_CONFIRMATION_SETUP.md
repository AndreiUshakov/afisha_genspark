# Настройка Supabase для входа с неподтвержденным email

## Проблема

Supabase по умолчанию блокирует вход пользователей с неподтвержденным email на уровне API, возвращая ошибку:
```
Error [AuthApiError]: Email not confirmed
code: 'email_not_confirmed'
status: 400
```

## Решение

Необходимо изменить настройки Supabase, чтобы разрешить вход с неподтвержденным email.

### Вариант 1: Через Supabase Dashboard (Рекомендуется)

1. Откройте ваш проект в [Supabase Dashboard](https://supabase.com/dashboard)

2. Перейдите в **Authentication** → **Settings** (или **Providers**)

3. Найдите секцию **Email Auth** или **Email Provider**

4. Найдите опцию **"Confirm email"** или **"Enable email confirmations"**

5. **ОТКЛЮЧИТЕ** эту опцию или измените на **"Users can sign in without confirming their email"**

6. Сохраните изменения

### Вариант 2: Через SQL (Если нет доступа к Dashboard)

Выполните следующий SQL запрос в Supabase SQL Editor:

```sql
-- Отключить требование подтверждения email для входа
UPDATE auth.config 
SET email_confirm_required = false;
```

### Вариант 3: Через переменные окружения (Self-hosted Supabase)

Если вы используете self-hosted Supabase, добавьте в `.env`:

```env
GOTRUE_MAILER_AUTOCONFIRM=true
```

Или:

```env
GOTRUE_DISABLE_SIGNUP=false
GOTRUE_MAILER_AUTOCONFIRM=false
GOTRUE_EXTERNAL_EMAIL_ENABLED=true
```

## Проверка настроек

После изменения настроек:

1. Перезапустите сервер разработки Next.js
2. Попробуйте войти с неподтвержденным email
3. Вход должен быть успешным
4. В личном кабинете появится баннер с просьбой подтвердить email

## Альтернативное решение (если настройки недоступны)

Если вы не можете изменить настройки Supabase, можно использовать обходной путь:

### Автоматическое подтверждение при регистрации

Обновите триггер создания пользователя в БД:

```sql
-- Функция для автоматического подтверждения email
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Автоматически подтверждаем email
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер на создание пользователя
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();
```

**⚠️ ВНИМАНИЕ:** Это автоматически подтверждает все email при регистрации, что может быть небезопасно для production.

## Рекомендуемая конфигурация для разработки

Для локальной разработки рекомендуется:

1. Отключить требование подтверждения email для входа
2. Оставить отправку писем подтверждения (если настроено)
3. Показывать баннер в UI для неподтвержденных пользователей
4. Ограничивать функционал до подтверждения

## Рекомендуемая конфигурация для production

Для production рекомендуется:

1. **Включить** требование подтверждения email для входа
2. Настроить SMTP для отправки писем
3. Добавить страницу с инструкциями по подтверждению
4. Реализовать повторную отправку письма подтверждения

## Текущая реализация в проекте

Наш код уже готов к работе с неподтвержденными пользователями:

- ✅ Вход разрешен (после настройки Supabase)
- ✅ Баннер уведомления в личном кабинете
- ✅ Ограничение создания сообществ/экспертов
- ✅ Пустые состояния для отсутствующих данных

После настройки Supabase всё будет работать корректно!

## Проверка текущих настроек

Чтобы проверить текущие настройки Supabase, выполните:

```sql
SELECT * FROM auth.config;
```

Или проверьте переменные окружения:

```bash
echo $GOTRUE_MAILER_AUTOCONFIRM
```

## Поддержка

Если возникли проблемы:
1. Проверьте логи Supabase
2. Убедитесь, что настройки сохранены
3. Перезапустите сервер
4. Очистите кэш браузера и cookies