# VK ID Авторизация - Документация

## 🎯 Прямой ответ на ваш вопрос

**Доверенный Redirect URL для VK ID:**
```
http://supabase.sober-automation.ru/auth/v1/callback
```

## 📚 Документация

### Для быстрого старта
👉 **[VK_ID_QUICK_START.md](VK_ID_QUICK_START.md)** - начните отсюда (5 минут)

### Подробные инструкции
- **[VK_ID_SETUP.md](VK_ID_SETUP.md)** - полная инструкция по настройке
- **[VK_ID_AMVERA_DEPLOYMENT.md](VK_ID_AMVERA_DEPLOYMENT.md)** - деплой на Amvera

## 🎨 Что реализовано

### Код
- ✅ [`app/auth/login/vk-actions.ts`](app/auth/login/vk-actions.ts) - server action для VK OAuth
- ✅ [`app/auth/login/page.tsx`](app/auth/login/page.tsx) - обновлена кнопка VK с функционалом
- ✅ [`app/auth/callback/route.ts`](app/auth/callback/route.ts) - callback route (уже был готов)

### Конфигурация
- ✅ [`.env.example`](.env.example) - добавлены переменные для VK ID
- ✅ Инструкции по настройке Supabase
- ✅ Инструкции по настройке VK ID приложения

## ⚙️ Настройка (следуйте по порядку)

### 1. VK ID приложение
```
Домен: .gorodzhivet.ru
Redirect URL: http://supabase.sober-automation.ru/auth/v1/callback
```

### 2. Supabase Dashboard
```
Провайдер: VK
Client ID: App ID из VK
Client Secret: Secure key из VK
```

### 3. Переменные окружения
```env
NEXT_PUBLIC_SITE_URL=https://dev.gorodzhivet.ru
NEXT_PUBLIC_VK_CLIENT_ID=ваш_app_id
```

## 🚀 Запуск

```bash
npm run dev
```

Откройте http://localhost:3000/auth/login и нажмите кнопку "VK"

## 📋 Чеклист

- [ ] Создано приложение в VK ID
- [ ] Настроен VK провайдер в Supabase
- [ ] Добавлены переменные окружения
- [ ] Протестирована авторизация
- [ ] Задеплоено на Amvera

## 🆘 Помощь

Если что-то не работает, см. раздел "Troubleshooting" в:
- [VK_ID_SETUP.md](VK_ID_SETUP.md#возможные-проблемы)
- [VK_ID_AMVERA_DEPLOYMENT.md](VK_ID_AMVERA_DEPLOYMENT.md#troubleshooting)