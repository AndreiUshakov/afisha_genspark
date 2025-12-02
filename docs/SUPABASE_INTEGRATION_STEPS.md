# Пошаговая инструкция по интеграции Supabase

## ✅ Выполненные шаги

### 1. Установка пакетов ✅
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D tsx dotenv
```

### 2. Создание клиентов Supabase ✅
- ✅ [`lib/supabase/server.ts`](../lib/supabase/server.ts) - для Server Components
- ✅ [`lib/supabase/client.ts`](../lib/supabase/client.ts) - для Client Components
- ✅ [`middleware.ts`](../middleware.ts) - для аутентификации

### 3. Создание SQL схемы ✅
- ✅ [`supabase/schema.sql`](../supabase/schema.sql) - полная схема БД

## 🔄 Следующие шаги

### Шаг 1: Исправить URL Supabase

**Текущая проблема:** URL в `.env.local` указывает на студию Supabase, а не на API.

**Действия:**
1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings → API**
4. Скопируйте правильные значения:
   - **Project URL** (должен быть вида `https://xxx.supabase.co`)
   - **anon public key** (начинается с `eyJ...`)
   - **service_role key** (начинается с `eyJ...`)

5. Обновите `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

6. Проверьте подключение:
```bash
npm run test:connection
```

### Шаг 2: Создать схему базы данных

1. Откройте Supabase Dashboard
2. Перейдите в **SQL Editor**
3. Создайте новый запрос
4. Скопируйте содержимое файла [`supabase/schema.sql`](../supabase/schema.sql)
5. Вставьте в редактор и выполните (Run)

**Что будет создано:**
- ✅ 10 таблиц (profiles, categories, communities, experts, events, posts, favorites, event_registrations, reviews, community_members)
- ✅ Все индексы для оптимизации запросов
- ✅ RLS (Row Level Security) политики
- ✅ Триггеры для автоматического обновления полей
- ✅ Функции для подсчета статистики

### Шаг 3: Настроить Storage Buckets

1. Откройте **Storage** в Supabase Dashboard
2. Создайте следующие buckets:

#### Bucket: `avatars`
- Public: ✅ Yes
- File size limit: 2MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

#### Bucket: `covers`
- Public: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

#### Bucket: `events`
- Public: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

#### Bucket: `communities`
- Public: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

#### Bucket: `posts`
- Public: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

### Шаг 4: Настроить Storage Policies

Для каждого bucket выполните в SQL Editor:

```sql
-- Для bucket 'avatars'
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
```

Повторите для остальных buckets, заменяя `'avatars'` на соответствующее имя.

### Шаг 5: Создать TypeScript типы

Supabase может автоматически генерировать типы из схемы БД:

```bash
npx supabase gen types typescript --project-id [your-project-ref] > types/database.types.ts
```

Или создайте вручную файл `types/database.types.ts` на основе схемы.

### Шаг 6: Создать утилиты для работы с изображениями

Файл уже подготовлен в плане интеграции. Создайте `lib/storage.ts`:

```typescript
import { createClient } from '@/lib/supabase/client'

export async function uploadImage(
  file: File,
  bucket: string,
  path: string
): Promise<string | null> {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${path}/${fileName}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}
```

### Шаг 7: Создать скрипты миграции данных

Создайте скрипты для миграции mock-данных:
- `scripts/migrate-categories.ts`
- `scripts/migrate-events.ts`
- `scripts/migrate-communities.ts`
- `scripts/migrate-experts.ts`
- `scripts/migrate-posts.ts`

Примеры есть в [`docs/SUPABASE_INTEGRATION_PLAN.md`](./SUPABASE_INTEGRATION_PLAN.md) (раздел 6.1-6.2).

### Шаг 8: Запустить миграцию данных

```bash
npm run migrate:categories
npm run migrate:events
npm run migrate:communities
npm run migrate:experts
npm run migrate:posts
```

Или все сразу:
```bash
npm run migrate:all
```

### Шаг 9: Создать Server Actions

Создайте файлы в `app/actions/`:
- `events.ts` - для работы с событиями
- `communities.ts` - для работы с сообществами
- `experts.ts` - для работы с экспертами
- `posts.ts` - для работы с постами

Примеры есть в плане интеграции (раздел 7.1).

### Шаг 10: Обновить компоненты

Обновите существующие компоненты для работы с реальными данными из Supabase вместо mock-данных.

## 📝 Проверка выполнения

После каждого шага проверяйте:

1. **После создания схемы:**
```bash
npm run test:connection
```
Должно показать: "✅ Таблица profiles существует"

2. **После миграции данных:**
Откройте Table Editor в Supabase Dashboard и проверьте наличие данных.

3. **После обновления компонентов:**
Запустите приложение и проверьте отображение данных:
```bash
npm run dev
```

## 🆘 Помощь

- [Инструкции по настройке](./SUPABASE_SETUP_INSTRUCTIONS.md)
- [План интеграции](./SUPABASE_INTEGRATION_PLAN.md)
- [Архитектура Supabase](./SUPABASE_ARCHITECTURE.md)

## 📊 Прогресс

- [x] Установка пакетов
- [x] Создание клиентов
- [x] Создание middleware
- [x] Создание SQL схемы
- [ ] Исправление URL Supabase
- [ ] Применение SQL схемы
- [ ] Настройка Storage
- [ ] Создание TypeScript типов
- [ ] Создание утилит
- [ ] Миграция данных
- [ ] Создание Server Actions
- [ ] Обновление компонентов