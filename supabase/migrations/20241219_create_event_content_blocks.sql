-- Создание таблицы для блоков контента мероприятий
CREATE TABLE IF NOT EXISTS event_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('heading', 'text', 'image', 'carousel')),
  content JSONB NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, position)
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_event_content_blocks_event ON event_content_blocks(event_id);
CREATE INDEX idx_event_content_blocks_position ON event_content_blocks(event_id, position);

-- RLS политики
ALTER TABLE event_content_blocks ENABLE ROW LEVEL SECURITY;

-- Владелец сообщества (через событие) может управлять блоками
CREATE POLICY "Community owners can manage event content blocks"
  ON event_content_blocks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      JOIN communities ON communities.id = events.community_id
      WHERE events.id = event_content_blocks.event_id
      AND communities.owner_id = auth.uid()
      AND events.deleted_at IS NULL
    )
  );

-- Все могут читать блоки опубликованных событий
CREATE POLICY "Anyone can view published event content blocks"
  ON event_content_blocks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_content_blocks.event_id
      AND events.is_published = true
      AND events.deleted_at IS NULL
    )
  );

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_event_content_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_content_blocks_updated_at
  BEFORE UPDATE ON event_content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_event_content_blocks_updated_at();

-- Комментарии к таблице и столбцам
COMMENT ON TABLE event_content_blocks IS 'Блоки контента для детального описания мероприятий';
COMMENT ON COLUMN event_content_blocks.block_type IS 'Тип блока: heading (заголовок h2), text (форматированный текст), image (изображение из галереи), carousel (карусель изображений)';
COMMENT ON COLUMN event_content_blocks.content IS 'JSON-структура с данными блока: {text: string} для heading, {html: string} для text, {url: string, alt: string} для image, {images: array, slidesPerView: number, slidesPerViewMobile: number} для carousel';
COMMENT ON COLUMN event_content_blocks.position IS 'Позиция блока в списке (для сортировки)';