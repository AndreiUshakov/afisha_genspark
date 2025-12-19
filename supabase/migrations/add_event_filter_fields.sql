-- Добавляем новые поля фильтрации для мероприятий
-- Эти поля будут использоваться для фильтрации мероприятий в каталоге

ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS event_type TEXT,
ADD COLUMN IF NOT EXISTS target_audience TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS wishes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS age_categories TEXT[] DEFAULT '{}';

-- Добавляем комментарии к полям
COMMENT ON COLUMN public.events.event_type IS 'Тип мероприятия (из категории сообщества)';
COMMENT ON COLUMN public.events.target_audience IS 'Для кого - массив целевой аудитории';
COMMENT ON COLUMN public.events.wishes IS 'Я хочу - массив целей/желаний';
COMMENT ON COLUMN public.events.age_categories IS 'Возрастные категории';

-- Создаем индексы для эффективной фильтрации
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events USING btree (event_type);
CREATE INDEX IF NOT EXISTS idx_events_target_audience ON public.events USING gin (target_audience);
CREATE INDEX IF NOT EXISTS idx_events_wishes ON public.events USING gin (wishes);
CREATE INDEX IF NOT EXISTS idx_events_age_categories ON public.events USING gin (age_categories);