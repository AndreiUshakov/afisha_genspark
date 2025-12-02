# Руководство по настройке Supabase

## Шаг 1: Создание таблиц в базе данных

### Вариант А: Через SQL Editor (Рекомендуется)

1. **Откройте Supabase Dashboard**
   - Перейдите на https://supabase.com/dashboard
   - Выберите ваш проект

2. **Откройте SQL Editor**
   - В левом меню найдите **SQL Editor**
   - Нажмите **New query**

3. **Выполните SQL-скрипт**
   - Откройте файл `supabase/schema.sql` в вашем проекте
   - Скопируйте **ВСЁ** содержимое файла
   - Вставьте в SQL Editor
   - Нажмите **Run** (или Ctrl+Enter)

4. **Проверьте результат**
   - Если всё прошло успешно, вы увидите сообщение "Success. No rows returned"
   - Перейдите в **Table Editor** → вы должны увидеть все созданные таблицы:
     - profiles
     - categories
     - communities
     - experts
     - events
     - posts
     - favorites
     - event_registrations
     - reviews
     - community_members

### Вариант Б: Через Supabase CLI

```bash
# 1. Установите Supabase CLI (если еще не установлен)
npm install -g supabase

# 2. Войдите в аккаунт
supabase login

# 3. Свяжите проект
supabase link --project-ref your-project-ref

# 4. Примените схему
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

---

## Шаг 2: Создание Storage Buckets

1. **Откройте Storage**
   - В левом меню выберите **Storage**

2. **Создайте buckets** (для каждого нажмите "New bucket"):

   **Bucket: avatars**
   - Name: `avatars`
   - Public: ✅ Yes
   - File size limit: 2 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

   **Bucket: covers**
   - Name: `covers`
   - Public: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

   **Bucket: events**
   - Name: `events`
   - Public: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

   **Bucket: communities**
   - Name: `communities`
   - Public: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

   **Bucket: posts**
   - Name: `posts`
   - Public: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

3. **Настройте Storage Policies**
   
   Для каждого bucket выполните в SQL Editor:

   ```sql
   -- Политики для bucket 'avatars'
   CREATE POLICY "Аватары видны всем"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'avatars');

   CREATE POLICY "Пользователи могут загружать свои аватары"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'avatars' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   CREATE POLICY "Пользователи могут обновлять свои аватары"
   ON storage.objects FOR UPDATE
   USING (
     bucket_id = 'avatars' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   CREATE POLICY "Пользователи могут удалять свои аватары"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'avatars' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- Повторите аналогичные политики для остальных buckets
   -- (covers, events, communities, posts)
   ```

---

## Шаг 3: Настройка Authentication

1. **Откройте Authentication**
   - В левом меню выберите **Authentication**

2. **Настройте Email Provider**
   - Перейдите в **Providers**
   - Email уже должен быть включен по умолчанию
   - Включите **Confirm email** для верификации
   - Включите **Secure email change**

3. **Настройте Email Templates** (опционально)
   - Перейдите в **Email Templates**
   - Отредактируйте шаблоны на русском языке

4. **Настройте OAuth Providers** (опционально)
   - Google OAuth
   - VK OAuth (для российской аудитории)

---

## Шаг 4: Проверка подключения

Выполните тестовый скрипт для проверки подключения:

```bash
npm run test:connection
```

Или создайте тестовый файл:

```typescript
// scripts/test-connection.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testConnection() {
  console.log('🔍 Проверка подключения к Supabase...')
  
  // Тест 1: Проверка подключения
  const { data, error } = await supabase
    .from('categories')
    .select('count')
    .limit(1)
  
  if (error) {
    console.error('❌ Ошибка подключения:', error.message)
    return
  }
  
  console.log('✅ Подключение успешно!')
  
  // Тест 2: Проверка таблиц
  const tables = [
    'profiles',
    'categories', 
    'communities',
    'experts',
    'events',
    'posts',
    'favorites',
    'event_registrations',
    'reviews',
    'community_members'
  ]
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('count').limit(1)
    if (error) {
      console.error(`❌ Таблица ${table}: ${error.message}`)
    } else {
      console.log(`✅ Таблица ${table} доступна`)
    }
  }
  
  console.log('\n✨ Все проверки пройдены!')
}

testConnection()
```

Запустите:
```bash
npx tsx scripts/test-connection.ts
```

---

## Шаг 5: Миграция mock-данных

После успешной проверки подключения, выполните миграцию данных:

```bash
# Установите tsx для запуска TypeScript
npm install -D tsx

# Мигрируйте категории
npm run migrate:categories

# Мигрируйте события
npm run migrate:events

# Мигрируйте сообщества
npm run migrate:communities

# Мигрируйте экспертов
npm run migrate:experts

# Мигрируйте посты
npm run migrate:posts

# Или всё сразу
npm run migrate:all
```

---

## Проверка результатов

1. **В Supabase Dashboard**
   - Откройте **Table Editor**
   - Проверьте каждую таблицу на наличие данных

2. **Проверьте RLS политики**
   - Откройте любую таблицу
   - Перейдите на вкладку **Policies**
   - Убедитесь, что политики активны

3. **Проверьте Storage**
   - Откройте **Storage**
   - Убедитесь, что все buckets созданы

---

## Возможные проблемы и решения

### Ошибка: "relation does not exist"
**Решение:** Таблица не создана. Выполните SQL-скрипт заново.

### Ошибка: "permission denied for table"
**Решение:** Проверьте RLS политики. Возможно, нужно временно отключить RLS для миграции.

### Ошибка: "duplicate key value violates unique constraint"
**Решение:** Данные уже существуют. Очистите таблицу или измените данные.

### Ошибка подключения
**Решение:** Проверьте переменные окружения в `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Следующие шаги

После успешной настройки:

1. ✅ Создайте Supabase клиенты (server/client)
2. ✅ Обновите компоненты для работы с реальными данными
3. ✅ Протестируйте функционал
4. ✅ Разверните на production

---

## Полезные команды

```bash
# Проверка подключения
npm run test:connection

# Миграция всех данных
npm run migrate:all

# Запуск dev-сервера
npm run dev

# Сборка проекта
npm run build
```

---

## Документация

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)