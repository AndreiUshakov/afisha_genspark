-- Создание таблицы для блоков контента страницы "О сообществе"
CREATE TABLE IF NOT EXISTS community_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('heading', 'text', 'image')),
  content JSONB NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, position)
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_content_blocks_community ON community_content_blocks(community_id);
CREATE INDEX idx_content_blocks_position ON community_content_blocks(community_id, position);

-- RLS политики
ALTER TABLE community_content_blocks ENABLE ROW LEVEL SECURITY;

-- Владелец сообщества может управлять блоками
CREATE POLICY "Community owners can manage content blocks"
  ON community_content_blocks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_content_blocks.community_id
      AND communities.owner_id = auth.uid()
    )
  );

-- Все могут читать блоки опубликованных сообществ
CREATE POLICY "Anyone can view published community content blocks"
  ON community_content_blocks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_content_blocks.community_id
      AND communities.status = 'published'
    )
  );

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_community_content_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_content_blocks_updated_at
  BEFORE UPDATE ON community_content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_community_content_blocks_updated_at();

-- Комментарии к таблице и столбцам
COMMENT ON TABLE community_content_blocks IS 'Блоки контента для страницы "О сообществе"';
COMMENT ON COLUMN community_content_blocks.block_type IS 'Тип блока: heading (заголовок h2), text (форматированный текст), image (изображение из галереи)';
COMMENT ON COLUMN community_content_blocks.content IS 'JSON-структура с данными блока: {text: string} для heading, {html: string} для text, {url: string, alt: string, caption: string} для image';
COMMENT ON COLUMN community_content_blocks.position IS 'Позиция блока в списке (для сортировки)';