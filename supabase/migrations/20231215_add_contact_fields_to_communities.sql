-- Добавление полей для контактной информации и обновление age_category
-- Migration: 20231215_add_contact_fields_to_communities

-- Добавляем поля contact_email и contact_phone
ALTER TABLE communities
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Переименовываем age_category в age_categories и меняем тип на массив
-- Сначала добавляем новое поле
ALTER TABLE communities
ADD COLUMN IF NOT EXISTS age_categories TEXT[] DEFAULT '{}';

-- Копируем данные из старого поля в новое (если есть значение)
UPDATE communities
SET age_categories = ARRAY[age_category]
WHERE age_category IS NOT NULL AND age_category != '';

-- Удаляем старое поле (опционально, можно оставить для совместимости)
-- ALTER TABLE communities DROP COLUMN IF EXISTS age_category;

-- Добавляем комментарии к новым полям
COMMENT ON COLUMN communities.contact_email IS 'Email для связи с сообществом';
COMMENT ON COLUMN communities.contact_phone IS 'Телефон для связи с сообществом';
COMMENT ON COLUMN communities.age_categories IS 'Возрастные категории (массив)';