# Инструкции по настройке Supabase

## ⚠️ Важно: Проверка URL и ключей

Текущий URL в `.env.local` указывает на `https://studio.sober-automation.ru`, что является URL студии Supabase, а не API.

## Как получить правильные учетные данные

### Шаг 1: Откройте Supabase Dashboard

1. Перейдите на [https://supabase.com](https://supabase.com)
2. Войдите в свой аккаунт
3. Выберите ваш проект или создайте новый

### Шаг 2: Получите API credentials

1. В левом меню выберите **Settings** (⚙️)
2. Перейдите в раздел **API**
3. Найдите следующие значения:

#### Project URL
- Должен выглядеть как: `https://[your-project-ref].supabase.co`
- Например: `https://abcdefghijklmnop.supabase.co`
- **НЕ** должен содержать слово "studio"

#### API Keys
- **anon/public key** - публичный ключ (начинается с `eyJ...`)
- **service_role key** - приватный ключ (также начинается с `eyJ...`)

### Шаг 3: Обновите .env.local

Замените значения в файле `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (ваш anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (ваш service role key)

# Optional: для production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Шаг 4: Проверьте подключение

После обновления `.env.local` запустите:

```bash
npm run test:connection
```

Вы должны увидеть:
```
✅ Подключение к Supabase установлено!
```

## Следующие шаги после успешного подключения

1. **Создать схему базы данных**
   - Откройте SQL Editor в Supabase Dashboard
   - Выполните SQL скрипты из плана интеграции

2. **Настроить Storage buckets**
   - Создайте buckets для изображений
   - Настройте политики доступа

3. **Мигрировать данные**
   - Запустите скрипты миграции mock-данных

## Проверка правильности URL

Правильный URL API должен:
- ✅ Содержать `.supabase.co`
- ✅ Иметь формат: `https://[project-ref].supabase.co`
- ❌ НЕ содержать слово "studio"
- ❌ НЕ быть кастомным доменом (если не настроен специально)

## Troubleshooting

### Ошибка: "fetch failed"
- Проверьте правильность URL
- Убедитесь, что проект Supabase активен
- Проверьте интернет-соединение

### Ошибка: "Invalid API key"
- Убедитесь, что скопировали полный ключ
- Проверьте, что используете anon key, а не service role key для публичных запросов

### Ошибка: "Project paused"
- Ваш проект Supabase может быть приостановлен
- Перейдите в Dashboard и активируйте проект

## Полезные ссылки

- [Supabase Documentation](https://supabase.com/docs)
- [API Settings](https://supabase.com/dashboard/project/_/settings/api)
- [Database Settings](https://supabase.com/dashboard/project/_/settings/database)