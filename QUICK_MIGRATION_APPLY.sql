-- ===============================================
-- БЫСТРОЕ ПРИМЕНЕНИЕ МИГРАЦИЙ ДЛЯ СТРАНИЦЫ СОБЫТИЙ
-- ===============================================
-- Скопируйте этот файл целиком и выполните в Supabase SQL Editor

-- 1. Добавление недостающих колонок в таблицу categories
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

-- Индексы для категорий (если не существуют)
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

-- Комментарии для новых полей категорий
COMMENT ON COLUMN public.categories.parent_id IS 'Ссылка на родительскую категорию для иерархии';
COMMENT ON COLUMN public.categories.sort_order IS 'Порядок сортировки категорий';
COMMENT ON COLUMN public.categories.is_active IS 'Активна ли категория';

-- 2. Добавление полей для фильтрации в таблицу events (если не существуют)
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

-- Комментарии для полей events
COMMENT ON COLUMN public.events.event_type IS 'Тип мероприятия (связан с категорией)';
COMMENT ON COLUMN public.events.target_audience IS 'Целевая аудитория (массив)';
COMMENT ON COLUMN public.events.wishes IS 'Что хочет получить посетитель (массив)';
COMMENT ON COLUMN public.events.age_categories IS 'Возрастные категории (массив)';

-- ===============================================
-- ГОТОВО! Миграция применена.
-- ===============================================

-- Проверка результата:
SELECT 'Категорий в БД:' as check_type, COUNT(*) as count FROM public.categories
UNION ALL
SELECT 'Активных категорий:', COUNT(*) FROM public.categories WHERE is_active = true
UNION ALL
SELECT 'Колонок фильтрации:', COUNT(*) 
FROM information_schema.columns 
WHERE table_name = 'events' 
  AND column_name IN ('event_type', 'target_audience', 'wishes', 'age_categories');