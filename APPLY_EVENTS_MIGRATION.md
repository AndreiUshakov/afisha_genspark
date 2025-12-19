# Применение миграции для страницы мероприятий

## Обзор
Эта инструкция описывает процесс применения миграций для реализации страницы мероприятий с фильтрами.

## Необходимые миграции

### 1. Таблица категорий
**Файл:** `supabase/migrations/20241219_create_categories_table.sql`

Создает таблицу категорий с предзаполненными данными.

### 2. Поля для фильтрации событий
**Проверьте наличие файла:** `supabase/migrations/add_event_filter_fields.sql`

Если этого файла нет, создайте его (см. раздел "Создание миграции для полей фильтрации")

## Способ 1: Через Supabase CLI (рекомендуется)

### Шаг 1: Убедитесь что Supabase CLI установлен
```bash
npx supabase --version
```

### Шаг 2: Примените миграцию
```bash
npx supabase db push
```

Эта команда автоматически применит все миграции из папки `supabase/migrations/`.

### Альтернатива - применение конкретной миграции:
```bash
npx supabase db execute --file supabase/migrations/20241219_create_categories_table.sql
```

## Способ 2: Через Supabase Dashboard

### Шаг 1: Откройте Supabase Dashboard
1. Перейдите на https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в SQL Editor

### Шаг 2: Скопируйте содержимое миграции
Откройте файл `supabase/migrations/20241219_create_categories_table.sql` и скопируйте его содержимое.

### Шаг 3: Выполните SQL
1. Вставьте скопированный SQL в SQL Editor
2. Нажмите "Run" или Ctrl/Cmd + Enter

### Шаг 4: Проверьте результат
В Table Editor должна появиться таблица `categories` с 15 записями.

## Создание миграции для полей фильтрации

Если миграция для добавления полей фильтрации в таблицу events не существует, создайте файл:

**Файл:** `supabase/migrations/20241219_add_event_filter_fields.sql`

```sql
-- Добавление полей для фильтрации в таблицу events
ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS event_type TEXT,
  ADD COLUMN IF NOT EXISTS target_audience TEXT[],
  ADD COLUMN IF NOT EXISTS wishes TEXT[],
  ADD COLUMN IF NOT EXISTS age_categories TEXT[];

-- Создание индексов для фильтрации
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_target_audience ON public.events USING GIN(target_audience);
CREATE INDEX IF NOT EXISTS idx_events_wishes ON public.events USING GIN(wishes);
CREATE INDEX IF NOT EXISTS idx_events_age_categories ON public.events USING GIN(age_categories);

-- Комментарии
COMMENT ON COLUMN public.events.event_type IS 'Тип мероприятия (связан с категорией)';
COMMENT ON COLUMN public.events.target_audience IS 'Целевая аудитория (массив)';
COMMENT ON COLUMN public.events.wishes IS 'Что хочет получить посетитель (массив)';
COMMENT ON COLUMN public.events.age_categories IS 'Возрастные категории (массив)';
```

Затем примените эту миграцию одним из способов выше.

## Проверка применения миграций

### Через SQL Editor:
```sql
-- Проверка таблицы categories
SELECT COUNT(*) FROM public.categories;
-- Должно вернуть 15

-- Проверка структуры таблицы events
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' 
  AND column_name IN ('event_type', 'target_audience', 'wishes', 'age_categories');
-- Должно показать 4 колонки

-- Проверка индексов
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'events' 
  AND indexname LIKE 'idx_events_%';
-- Должно показать индексы для фильтрации
```

### Через Supabase CLI:
```bash
npx supabase db diff --schema public
```

## Тестовые данные

После применения миграций рекомендуется добавить тестовые события с заполненными полями фильтрации:

```sql
-- Пример обновления существующего события
UPDATE public.events
SET 
  event_type = 'concerts-music',
  target_audience = ARRAY['Молодежь', 'Студенты'],
  wishes = ARRAY['Послушать музыку', 'Повеселиться'],
  age_categories = ARRAY['Взрослые 18+']
WHERE id = 'your-event-id';
```

## Откат миграций (если необходимо)

### Удаление таблицы categories:
```sql
DROP TABLE IF EXISTS public.categories CASCADE;
```

### Удаление полей фильтрации:
```sql
ALTER TABLE public.events 
  DROP COLUMN IF EXISTS event_type,
  DROP COLUMN IF EXISTS target_audience,
  DROP COLUMN IF EXISTS wishes,
  DROP COLUMN IF EXISTS age_categories;
```

## Следующие шаги после применения

1. Перезапустите dev сервер:
   ```bash
   npm run dev
   ```

2. Откройте страницу `/events` в браузере

3. Проверьте работу фильтров

4. Добавьте тестовые события через админ-панель

## Возможные проблемы

### Ошибка: "function update_updated_at_column() does not exist"

Создайте функцию:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Ошибка: "relation profiles does not exist"

Проверьте наличие таблицы profiles или измените RLS политику для categories.

### Ошибка при вставке категорий

Если категории уже существуют, они будут пропущены благодаря `ON CONFLICT (slug) DO NOTHING`.

## Поддержка

Если возникли проблемы:
1. Проверьте логи Supabase
2. Убедитесь что все переменные окружения настроены
3. Проверьте RLS политики
4. Обратитесь к документации Supabase