# Настройка авторизации через VK ID

## 1. Регистрация приложения в VK ID

1. Перейдите на [id.vk.com](https://id.vk.com)
2. Создайте приложение "Город Живёт"
3. Укажите:
   - **Базовый домен**: `.gorodzhivet.ru`
   - **Доверенный Redirect URL**: `http://supabase.sober-automation.ru/auth/v1/callback`

> ⚠️ **ВАЖНО**: Используйте именно URL вашего Supabase instance, а НЕ URL сайта!

4. После создания приложения скопируйте:
   - **App ID** (ID приложения)
   - **Secure key** (Защищённый ключ)

## 2. Настройка VK OAuth в Supabase Dashboard

1. Откройте [Supabase Studio](http://studio.sober-automation.ru)
2. Перейдите в **Authentication** → **Providers**
3. Найдите **VK** в списке провайдеров
4. Включите провайдер и укажите:
   - **VK Client ID**: ваш App ID из VK
   - **VK Client Secret**: ваш Secure key из VK
5. В разделе **Redirect URLs** добавьте:
   - `https://dev.gorodzhivet.ru/auth/callback`
6. Сохраните изменения

## 3. Добавление переменных окружения

Добавьте в `.env.local`:

```env
# URL сайта (для OAuth редиректов)
NEXT_PUBLIC_SITE_URL=https://dev.gorodzhivet.ru

# VK ID OAuth
NEXT_PUBLIC_VK_CLIENT_ID=your_vk_app_id
```

На продакшене (Amvera) добавьте обе переменные в **Settings → Environment Variables**:
- `NEXT_PUBLIC_SITE_URL` = `https://dev.gorodzhivet.ru` (или ваш продакшен домен)
- `NEXT_PUBLIC_VK_CLIENT_ID` = ваш App ID из VK

## 4. Проверка настроек

После настройки убедитесь:
- ✅ VK провайдер включён в Supabase
- ✅ Redirect URL правильный: `http://supabase.sober-automation.ru/auth/v1/callback`
- ✅ В VK ID приложении указан правильный домен
- ✅ Переменные окружения добавлены

## 5. Тестирование

1. Откройте https://dev.gorodzhivet.ru/auth/login
2. Нажмите кнопку "VK"
3. Авторизуйтесь через VK ID
4. После успешной авторизации вы будете перенаправлены в `/dashboard`

## Возможные проблемы

### Ошибка "Invalid redirect_uri"
- Проверьте, что в VK ID указан правильный Redirect URL
- URL должен быть: `http://supabase.sober-automation.ru/auth/v1/callback`

### Ошибка "Provider not enabled"
- Убедитесь, что VK провайдер включён в Supabase Dashboard
- Проверьте правильность Client ID и Secret

### Пользователь не создаётся
- Проверьте настройки Email confirmation в Supabase
- VK ID предоставляет подтверждённый email автоматически