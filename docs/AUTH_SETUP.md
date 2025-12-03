# 🔐 Настройка аутентификации

## Обзор

Система аутентификации реализована с использованием Supabase Auth и включает:
- Регистрацию по email и паролю
- Вход в систему
- Автоматическое создание профиля пользователя
- Подтверждение email

## Файлы системы

### Server Actions
- [`app/auth/register/actions.ts`](../app/auth/register/actions.ts) - регистрация пользователя
- [`app/auth/login/actions.ts`](../app/auth/login/actions.ts) - вход в систему

### Страницы
- [`app/auth/register/page.tsx`](../app/auth/register/page.tsx) - форма регистрации
- [`app/auth/login/page.tsx`](../app/auth/login/page.tsx) - форма входа
- [`app/auth/callback/route.ts`](../app/auth/callback/route.ts) - обработка подтверждения email

### Supabase клиенты
- [`lib/supabase/client.ts`](../lib/supabase/client.ts) - клиент для браузера
- [`lib/supabase/server.ts`](../lib/supabase/server.ts) - клиент для сервера

## Процесс регистрации

### 1. Пользователь заполняет форму
```tsx
// app/auth/register/page.tsx
- Email
- Пароль (минимум 8 символов)
- Подтверждение пароля
- Согласие с условиями
```

### 2. Валидация на клиенте
- Проверка заполнения всех полей
- Совпадение паролей
- Минимальная длина пароля
- Формат email
- Согласие с условиями

### 3. Server Action обрабатывает регистрацию
```typescript
// app/auth/register/actions.ts
export async function signUp(formData: FormData) {
  // Валидация данных
  // Регистрация через Supabase Auth
  // Автоматическое создание профиля через триггер БД
  // Перенаправление на страницу входа
}
```

### 4. Автоматическое создание профиля
```sql
-- supabase/schema.sql
-- Триггер handle_new_user автоматически создает запись в таблице profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 5. Подтверждение email
- Supabase отправляет письмо с ссылкой подтверждения
- Ссылка ведет на `/auth/callback?code=...`
- Callback обменивает код на сессию
- Пользователь перенаправляется в dashboard

## Процесс входа

### 1. Пользователь вводит credentials
```tsx
// app/auth/login/page.tsx
- Email
- Пароль
- Опционально: "Запомнить меня"
```

### 2. Server Action выполняет вход
```typescript
// app/auth/login/actions.ts
export async function signIn(formData: FormData) {
  // Валидация
  // Вход через Supabase Auth
  // Перенаправление в dashboard
}
```

## Структура таблицы profiles

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'expert', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Безопасность

### Row Level Security (RLS)
Все таблицы защищены RLS политиками:

```sql
-- Профили видны всем
CREATE POLICY "Профили видны всем" ON profiles
  FOR SELECT USING (true);

-- Пользователи могут обновлять только свой профиль
CREATE POLICY "Пользователи могут обновлять свой профиль" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Валидация
- **Email**: проверка формата через regex
- **Пароль**: минимум 8 символов
- **CSRF**: защита через Next.js Server Actions
- **XSS**: автоматическая защита через React

## Переменные окружения

Убедитесь, что в `.env.local` настроены:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Настройка Supabase Dashboard

### 1. Email Templates
В Supabase Dashboard → Authentication → Email Templates настройте:
- **Confirm signup**: шаблон подтверждения регистрации
- **Magic Link**: для входа без пароля (опционально)
- **Reset Password**: для восстановления пароля

### 2. URL Configuration
В Authentication → URL Configuration:
- **Site URL**: `http://localhost:3000` (для dev) или ваш production URL
- **Redirect URLs**: добавьте `http://localhost:3000/auth/callback`

### 3. Email Auth
В Authentication → Providers:
- Включите **Email** провайдер
- Настройте **Confirm email** (рекомендуется для production)

## Тестирование

### Локальное тестирование
1. Запустите dev-сервер: `npm run dev`
2. Откройте `http://localhost:3000/auth/register`
3. Зарегистрируйте тестового пользователя
4. Проверьте Supabase Dashboard → Authentication → Users
5. Проверьте таблицу `profiles` в Database

### Проверка создания профиля
```sql
-- В Supabase SQL Editor
SELECT * FROM profiles WHERE email = 'test@example.com';
```

## Обработка ошибок

### Типичные ошибки и решения

**"User already registered"**
- Пользователь с таким email уже существует
- Предложите войти или восстановить пароль

**"Invalid login credentials"**
- Неверный email или пароль
- Проверьте правильность ввода

**"Email not confirmed"**
- Email не подтвержден
- Отправьте повторное письмо подтверждения

## Расширение функционала

### Добавление OAuth провайдеров
```typescript
// Пример для Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

### Восстановление пароля
Создайте страницу `/auth/reset-password` и используйте:
```typescript
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/update-password`
})
```

## Полезные ссылки

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Поддержка

При возникновении проблем:
1. Проверьте логи в Supabase Dashboard → Logs
2. Проверьте консоль браузера на ошибки
3. Убедитесь, что таблицы созданы корректно
4. Проверьте переменные окружения