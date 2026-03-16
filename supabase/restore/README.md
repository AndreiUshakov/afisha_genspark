# Инструкция по восстановлению Supabase

## Обзор

Эта папка содержит полный набор скриптов для восстановления базы данных Supabase проекта "Афиша Иркутска" после потери доступа к серверу.

## Содержимое

1. **[`01_complete_database_restore.sql`](01_complete_database_restore.sql)** - Полное восстановление структуры базы данных
2. **[`02_storage_buckets_restore.sql`](02_storage_buckets_restore.sql)** - Восстановление Storage buckets и политик
3. **`README.md`** - Данная инструкция

## Что восстанавливается

### Скрипт 01: База данных
- ✅ Расширения PostgreSQL (uuid-ossp, pg_trgm)
- ✅ Базовые функции и триггеры
- ✅ 14 таблиц с полной структурой:
  - `profiles` - Профили пользователей
  - `categories` - Категории мероприятий
  - `communities` - Сообщества
  - `experts` - Эксперты
  - `events` - События и мероприятия
  - `posts` - Публикации
  - `favorites` - Избранное
  - `event_registrations` - Регистрации на события
  - `reviews` - Отзывы
  - `community_members` - Участники сообществ
  - `moderation_tasks` - Задачи модерации
  - `community_content_blocks` - Блоки контента сообществ
  - `event_content_blocks` - Блоки контента событий
  - `community_media` - Медиа-файлы сообществ
- ✅ Все индексы для оптимизации запросов
- ✅ RLS (Row Level Security) политики для всех таблиц
- ✅ Триггеры для автоматизации (updated_at, счетчики, модерация)
- ✅ Функции для мягкого удаления и статистики
- ✅ Начальные данные (15 категорий мероприятий)

### Скрипт 02: Storage
- ✅ 3 Storage buckets:
  - `profiles` - Аватары пользователей (5MB, публичный)
  - `communities` - Изображения сообществ (10MB, публичный)
  - `community-media` - Медиа-галерея сообществ (10MB, публичный)
- ✅ RLS политики для storage.objects
- ✅ Ограничения по размеру и типам файлов

## Порядок выполнения

### Шаг 1: Подготовка

1. Создайте новый проект в Supabase
2. Получите доступ к SQL Editor в панели Supabase
3. Убедитесь, что у вас есть права администратора

### Шаг 2: Восстановление базы данных

1. Откройте SQL Editor в Supabase Dashboard
2. Скопируйте содержимое файла [`01_complete_database_restore.sql`](01_complete_database_restore.sql)
3. Вставьте в SQL Editor
4. Нажмите **Run** (или Ctrl+Enter)
5. Дождитесь завершения выполнения (может занять 1-2 минуты)

**Ожидаемый результат:**
- Все таблицы созданы
- Индексы установлены
- RLS политики активированы
- 15 категорий добавлены в таблицу `categories`

### Шаг 3: Восстановление Storage

1. В том же SQL Editor
2. Скопируйте содержимое файла [`02_storage_buckets_restore.sql`](02_storage_buckets_restore.sql)
3. Вставьте в SQL Editor
4. Нажмите **Run**
5. Дождитесь завершения выполнения

**Ожидаемый результат:**
- 3 bucket созданы и настроены
- RLS политики для storage активированы

### Шаг 4: Проверка

#### Проверка таблиц
```sql
-- Проверить созданные таблицы
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Должно быть 14 таблиц:
- categories
- communities
- community_content_blocks
- community_media
- community_members
- event_content_blocks
- event_registrations
- events
- experts
- favorites
- moderation_tasks
- posts
- profiles
- reviews

#### Проверка категорий
```sql
-- Проверить категории
SELECT name, slug, icon, color 
FROM categories 
ORDER BY sort_order;
```

Должно быть 15 категорий.

#### Проверка Storage buckets
```sql
-- Проверить buckets
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
ORDER BY name;
```

Должно быть 3 bucket:
- communities (10MB)
- community-media (10MB)
- profiles (5MB)

#### Проверка RLS политик
```sql
-- Проверить политики для таблицы communities
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'communities';
```

Должно быть 5 политик для communities.

### Шаг 5: Настройка переменных окружения

Обновите файл `.env.local` в вашем проекте:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key
```

Получить ключи можно в:
- **Settings** → **API** → **Project API keys**

### Шаг 6: Создание первого администратора

После восстановления БД нужно создать первого пользователя с ролью admin:

1. Зарегистрируйтесь через интерфейс приложения
2. Найдите свой ID пользователя в таблице `auth.users`
3. Обновите роль в таблице `profiles`:

```sql
-- Замените YOUR_USER_ID на ваш реальный UUID
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'YOUR_USER_ID';
```

## Важные замечания

### ⚠️ Безопасность

1. **Service Role Key** - храните в секрете, не коммитьте в Git
2. **RLS политики** - все таблицы защищены RLS, проверьте их работу
3. **Storage политики** - файлы доступны только владельцам

### 📝 Миграции данных

Если у вас есть резервная копия данных из старой БД:

1. Сначала выполните скрипты восстановления структуры
2. Затем импортируйте данные через SQL или CSV
3. Проверьте целостность связей (foreign keys)

### 🔄 Обновления схемы

Если в будущем потребуется обновить схему:

1. Создайте новую миграцию в папке `supabase/migrations/`
2. Примените через Supabase CLI или SQL Editor
3. Обновите скрипты восстановления

## Структура проекта

```
supabase/
├── restore/
│   ├── 01_complete_database_restore.sql  # Основная БД
│   ├── 02_storage_buckets_restore.sql    # Storage
│   └── README.md                          # Эта инструкция
├── migrations/                            # Исторические миграции
│   ├── 20231209_create_profiles_bucket_v2.sql
│   ├── 20241211_create_admin_moderation.sql
│   ├── 20241212_add_community_status.sql
│   └── ... (другие миграции)
└── schema.sql                             # Базовая схема
```

## Решение проблем

### Ошибка: "relation already exists"

Если таблица уже существует:
```sql
-- Удалите таблицу и создайте заново
DROP TABLE IF EXISTS table_name CASCADE;
```

Затем повторно выполните скрипт.

### Ошибка: "policy already exists"

Политики автоматически удаляются перед созданием (`DROP POLICY IF EXISTS`). Если ошибка сохраняется:
```sql
-- Удалите все политики для таблицы
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### Ошибка: "bucket already exists"

Скрипт использует `ON CONFLICT DO UPDATE`, поэтому bucket будет обновлен, а не создан заново.

### Проблемы с RLS

Если данные не отображаются:
1. Проверьте, что RLS включен: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. Проверьте политики: `SELECT * FROM pg_policies WHERE tablename = 'table_name';`
3. Проверьте роль пользователя в таблице `profiles`

## Контакты и поддержка

При возникновении проблем:
1. Проверьте логи в Supabase Dashboard → Logs
2. Проверьте SQL Editor → History для просмотра выполненных запросов
3. Обратитесь к документации Supabase: https://supabase.com/docs

## Версия

- **Дата создания:** 2026-03-15
- **Версия проекта:** afisha_genspark
- **Supabase:** Compatible with Supabase v2.x

---

**Успешного восстановления! 🚀**
