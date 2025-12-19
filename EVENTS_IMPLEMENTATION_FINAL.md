# Реализация страницы мероприятий /events - ФИНАЛЬНАЯ ВЕРСИЯ

## ✅ Статус: Готово к применению миграции

### Что исправлено в последней версии:
1. ✅ Исправлен SQL скрипт миграции - добавление колонок в существующую таблицу `categories`
2. ✅ Исправлены запросы к БД (`event_date` → `start_date`)
3. ✅ Исправлена проверка `window` в клиентском компоненте
4. ✅ Исправлены фильтры для `deleted_at` (`.eq()` → `.is()`)

---

## 🚀 ПРИМЕНЕНИЕ МИГРАЦИИ

### Шаг 1: Скопируйте и выполните SQL

Откройте Supabase Dashboard → SQL Editor и выполните:

```sql
-- Добавление недостающих колонок в существующую таблицу categories
ALTER TABLE public.categories 
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Установить значения по умолчанию для существующих записей
UPDATE public.categories 
SET is_active = true 
WHERE is_active IS NULL;

UPDATE public.categories 
SET sort_order = 0 
WHERE sort_order IS NULL;

-- Индексы для категорий
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

-- Добавление полей для фильтрации в таблицу events
ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS event_type TEXT,
  ADD COLUMN IF NOT EXISTS target_audience TEXT[],
  ADD COLUMN IF NOT EXISTS wishes TEXT[],
  ADD COLUMN IF NOT EXISTS age_categories TEXT[];

-- Создание GIN индексов для массивов
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_target_audience ON public.events USING GIN(target_audience);
CREATE INDEX IF NOT EXISTS idx_events_wishes ON public.events USING GIN(wishes);
CREATE INDEX IF NOT EXISTS idx_events_age_categories ON public.events USING GIN(age_categories);
```

**ИЛИ** просто скопируйте весь файл [`QUICK_MIGRATION_APPLY.sql`](QUICK_MIGRATION_APPLY.sql:1) и выполните его целиком.

### Шаг 2: Проверьте результат

```sql
-- Должно вернуть 3 новые колонки
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'categories' 
  AND column_name IN ('parent_id', 'sort_order', 'is_active');

-- Должно вернуть 4 новые колонки
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'events' 
  AND column_name IN ('event_type', 'target_audience', 'wishes', 'age_categories');
```

### Шаг 3: Откройте страницу

После применения миграции откройте: http://localhost:3000/events

Ошибки должны исчезнуть, страница загрузится корректно.

---

## 📁 Созданные/Измененные файлы

### Новые файлы:
- [`app/events/actions.ts`](app/events/actions.ts:1) - Server actions для работы с событиями
- [`app/api/events/route.ts`](app/api/events/route.ts:1) - API endpoint
- [`components/events/EventsPageClient.tsx`](components/events/EventsPageClient.tsx:1) - Клиентский компонент
- [`supabase/migrations/20241219_create_categories_table.sql`](supabase/migrations/20241219_create_categories_table.sql:1) - Миграция (не применима, т.к. таблица существует)
- [`QUICK_MIGRATION_APPLY.sql`](QUICK_MIGRATION_APPLY.sql:1) - **ИСПОЛЬЗУЙТЕ ЭТОТ ФАЙЛ**
- Документация: `EVENTS_PAGE_IMPLEMENTATION.md`, `APPLY_EVENTS_MIGRATION.md`, `EVENTS_IMPLEMENTATION_README.md`

### Измененные файлы:
- [`app/events/page.tsx`](app/events/page.tsx:1) - Обновлено для работы с БД

---

## 🎯 Функциональность

### Поддерживаемые фильтры:

1. **По категориям** - кнопки с иконками (`🎵 Концерты`, `🎭 Театр`, и т.д.)
2. **Сортировка** - по дате/популярности/цене
3. **Пагинация** - навигация по страницам
4. **Поиск** - через query параметр `search`

### Готовые расширения (в коде, нужен UI):

- Фильтр "Я хочу" (wishes)
- Фильтр "Для кого" (target_audience)
- Возрастные категории (age_categories)
- Формат (онлайн/офлайн)
- Тип цены (бесплатно/платно)
- Диапазон дат

### Query параметры URL:

```
/events?category=<uuid>              # Фильтр по категории
/events?sortBy=date&sortOrder=asc    # Сортировка
/events?page=2                       # Пагинация
/events?search=концерт               # Поиск
/events?wishes=Послушать,Развлечься  # Множественный фильтр
```

---

## 🔧 Исправленные проблемы

### 1. ❌ → ✅ Ошибка: "column events.event_date does not exist"
**Было:** Запросы использовали несуществующую колонку `event_date`  
**Исправлено:** Все запросы обновлены на использование `start_date`

### 2. ❌ → ✅ Ошибка: "column categories.is_active does not exist"
**Было:** Таблица существовала без колонки `is_active`  
**Исправлено:** Миграция добавляет колонку `is_active` (+ `parent_id`, `sort_order`)

### 3. ❌ → ✅ Ошибка: "window.addEventListener is not a function"
**Было:** Использование `window` без проверки  
**Исправлено:** Добавлена проверка `typeof window !== 'undefined'`

### 4. ❌ → ✅ Ошибка с фильтром deleted_at
**Было:** `.eq('deleted_at', null)`  
**Исправлено:** `.is('deleted_at', null)`

---

## 📊 Структура БД после миграции

### Таблица `categories`:
```
id              UUID PRIMARY KEY
name            TEXT NOT NULL
slug            TEXT NOT NULL UNIQUE
description     TEXT
icon            TEXT
color           TEXT NOT NULL
featured_on_hero BOOLEAN DEFAULT false
parent_id       UUID (новая)
sort_order      INTEGER DEFAULT 0 (новая)
is_active       BOOLEAN DEFAULT true (новая)
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### Таблица `events` (новые колонки):
```
event_type       TEXT
target_audience  TEXT[]
wishes           TEXT[]
age_categories   TEXT[]
```

---

## 🧪 Тестирование

### После применения миграции:

1. Откройте `/events` - страница должна загрузиться без ошибок
2. Нажмите на категорию - URL должен обновиться, данные перезагрузятся
3. Измените сортировку - события должны пересортироваться
4. Если есть события на 2+ страницах - протестируйте пагинацию

### Если страница пустая:

Это нормально, если в БД нет опубликованных событий. Создайте тестовое событие:

```sql
-- Обновите существующее событие для тестирования фильтров
UPDATE public.events
SET 
  event_type = (SELECT id FROM categories WHERE slug = 'concerts-music' LIMIT 1),
  target_audience = ARRAY['Молодежь', 'Студенты'],
  wishes = ARRAY['Послушать музыку', 'Повеселиться'],
  age_categories = ARRAY['Взрослые 18+'],
  is_published = true
WHERE id = '<your-event-id>';
```

---

## 📞 Если что-то не работает

### Проверьте:

1. ✅ Миграция применена успешно (проверка SQL выше)
2. ✅ Dev сервер перезапущен после изменений
3. ✅ Нет ошибок в консоли браузера
4. ✅ Нет ошибок в терминале Next.js
5. ✅ Переменные окружения `.env.local` настроены

### Логи:

- **Supabase Dashboard** → Logs → для ошибок БД
- **Browser Console** → для ошибок фронтенда
- **Terminal** → для ошибок Next.js

---

## ✨ Готово!

После выполнения SQL миграции страница `/events` будет полностью функциональна с:
- ✅ Загрузкой событий из БД
- ✅ Фильтрацией по категориям
- ✅ Сортировкой
- ✅ Пагинацией
- ✅ Интеграцией с URL
- ✅ Готовностью к расширению дополнительными фильтрами