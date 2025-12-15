# VK ID - Быстрый старт

## ✅ Что уже сделано в коде

- ✅ Создан server action [`app/auth/login/vk-actions.ts`](app/auth/login/vk-actions.ts)
- ✅ Обновлена страница логина [`app/auth/login/page.tsx`](app/auth/login/page.tsx)
- ✅ Добавлены переменные окружения в [`.env.example`](.env.example)
- ✅ Callback route уже настроен [`app/auth/callback/route.ts`](app/auth/callback/route.ts)

## 🎯 Что нужно сделать вам (5 минут)

### Шаг 1: VK ID приложение (2 мин)

1. Откройте [id.vk.com](https://id.vk.com)
2. Создайте приложение "Город Живёт"
3. Укажите:
   - **Базовый домен**: `.gorodzhivet.ru`
   - **Доверенный Redirect URL**: `http://supabase.sober-automation.ru/auth/v1/callback`
4. Скопируйте **App ID** и **Secure key**

### Шаг 2: Supabase настройка (2 мин)

1. Откройте [http://studio.sober-automation.ru](http://studio.sober-automation.ru)
2. **Authentication** → **Providers** → найдите **VK**
3. Включите провайдер и вставьте:
   - **Client ID**: App ID из VK
   - **Client Secret**: Secure key из VK
4. Сохраните

### Шаг 3: Переменные окружения (1 мин)

Создайте `.env.local` (если его нет) и добавьте:

```env
NEXT_PUBLIC_SUPABASE_URL=http://supabase.sober-automation.ru
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
NEXT_PUBLIC_SITE_URL=https://dev.gorodzhivet.ru
NEXT_PUBLIC_VK_CLIENT_ID=ваш_app_id_из_vk
```

### Шаг 4: Запуск

```bash
npm run dev
```

Откройте http://localhost:3000/auth/login и нажмите кнопку VK!

## 📝 Ответ на ваш вопрос

**Доверенный Redirect URL для VK ID:**
```
http://supabase.sober-automation.ru/auth/v1/callback
```

Это стандартный callback URL для Supabase OAuth. Обратите внимание:
- ✅ Используется URL вашего **Supabase instance**, а не URL сайта
- ✅ Путь всегда `/auth/v1/callback`
- ✅ После авторизации Supabase перенаправит на ваш сайт

## 🚀 Деплой на Amvera

См. подробную инструкцию: [`VK_ID_AMVERA_DEPLOYMENT.md`](VK_ID_AMVERA_DEPLOYMENT.md)

## 📖 Полная документация

Для детальной информации см. [`VK_ID_SETUP.md`](VK_ID_SETUP.md)

## 🆘 Проблемы?

### Ошибка: "Invalid redirect_uri"
```
Решение: Проверьте URL в VK ID - должен быть:
http://supabase.sober-automation.ru/auth/v1/callback
```

### Ошибка: "Provider not enabled"
```
Решение: Включите VK провайдер в Supabase Dashboard
```

### Кнопка VK не работает
```
Решение: Проверьте консоль браузера на ошибки,
убедитесь что NEXT_PUBLIC_SITE_URL установлена