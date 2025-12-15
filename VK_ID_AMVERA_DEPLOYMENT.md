# Деплой VK ID авторизации на Amvera

## Быстрая инструкция

### 1. Настройка переменных окружения на Amvera

1. Откройте панель управления Amvera
2. Выберите ваш проект
3. Перейдите в **Settings → Environment Variables**
4. Добавьте следующие переменные:

```
NEXT_PUBLIC_SUPABASE_URL=http://supabase.sober-automation.ru
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
NEXT_PUBLIC_SITE_URL=https://dev.gorodzhivet.ru
NEXT_PUBLIC_VK_CLIENT_ID=ваш_vk_app_id
```

### 2. Настройка VK ID приложения

В настройках вашего приложения на [id.vk.com](https://id.vk.com):

- **Базовый домен**: `.gorodzhivet.ru`
- **Доверенный Redirect URL**: `http://supabase.sober-automation.ru/auth/v1/callback`

### 3. Настройка Supabase

В [Supabase Studio](http://studio.sober-automation.ru):

1. **Authentication** → **Providers** → **VK**
2. Включите провайдер
3. Укажите:
   - **VK Client ID**: App ID из VK
   - **VK Client Secret**: Secure key из VK
4. В **Redirect URLs** добавьте:
   - `https://dev.gorodzhivet.ru/auth/callback`

### 4. Деплой

```bash
git add .
git commit -m "Add VK ID authentication"
git push
```

Amvera автоматически задеплоит изменения.

## Проверка

1. Откройте https://dev.gorodzhivet.ru/auth/login
2. Нажмите кнопку "VK"
3. Авторизуйтесь через VK ID
4. После успешной авторизации вы будете перенаправлены в `/dashboard`

## Troubleshooting

### "Invalid redirect_uri"
- Проверьте Redirect URL в VK ID: `http://supabase.sober-automation.ru/auth/v1/callback`
- Убедитесь, что базовый домен указан правильно: `.gorodzhivet.ru`

### "Provider not enabled"
- Проверьте, что VK провайдер включён в Supabase Dashboard
- Убедитесь, что Client ID и Secret указаны правильно

### Переменные окружения не работают
- Убедитесь, что все переменные добавлены в Amvera
- Сделайте redeploy после добавления переменных
- Проверьте логи: `Settings → Logs`

## Полная документация

См. [`VK_ID_SETUP.md`](VK_ID_SETUP.md) для подробных инструкций.