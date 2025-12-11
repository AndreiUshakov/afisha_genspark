-- ============================================
-- Миграция для админ-панели и модерации
-- ============================================

-- Таблица задач модерации
CREATE TABLE IF NOT EXISTS moderation_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Тип контента для модерации
  content_type TEXT NOT NULL CHECK (content_type IN ('community', 'event', 'post', 'expert')),
  content_id UUID NOT NULL,
  
  -- Статус задачи
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
  
  -- Информация о модерации
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  review_comment TEXT,
  
  -- Приоритет
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Метаданные
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для moderation_tasks
CREATE INDEX IF NOT EXISTS idx_moderation_content_type ON moderation_tasks(content_type);
CREATE INDEX IF NOT EXISTS idx_moderation_content_id ON moderation_tasks(content_id);
CREATE INDEX IF NOT EXISTS idx_moderation_status ON moderation_tasks(status);
CREATE INDEX IF NOT EXISTS idx_moderation_assigned ON moderation_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_moderation_priority ON moderation_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_moderation_created ON moderation_tasks(created_at DESC);

-- RLS политики для moderation_tasks
ALTER TABLE moderation_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Только админы видят задачи модерации" ON moderation_tasks;
CREATE POLICY "Только админы видят задачи модерации" ON moderation_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Только админы управляют задачами модерации" ON moderation_tasks;
CREATE POLICY "Только админы управляют задачами модерации" ON moderation_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_moderation_tasks_updated_at ON moderation_tasks;
CREATE TRIGGER update_moderation_tasks_updated_at
  BEFORE UPDATE ON moderation_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Обновление RLS политик для админов
-- ============================================

-- Админы видят все сообщества
DROP POLICY IF EXISTS "Админы видят все сообщества" ON communities;
CREATE POLICY "Админы видят все сообщества" ON communities
  FOR SELECT USING (
    is_published = true 
    OR owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Админы могут обновлять любые сообщества
DROP POLICY IF EXISTS "Админы могут обновлять сообщества" ON communities;
CREATE POLICY "Админы могут обновлять сообщества" ON communities
  FOR UPDATE USING (
    auth.uid() = owner_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Админы видят все события
DROP POLICY IF EXISTS "Админы видят все события" ON events;
CREATE POLICY "Админы видят все события" ON events
  FOR SELECT USING (
    is_published = true 
    OR organizer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Админы могут обновлять любые события
DROP POLICY IF EXISTS "Админы могут обновлять события" ON events;
CREATE POLICY "Админы могут обновлять события" ON events
  FOR UPDATE USING (
    auth.uid() = organizer_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Админы видят все посты
DROP POLICY IF EXISTS "Админы видят все посты" ON posts;
CREATE POLICY "Админы видят все посты" ON posts
  FOR SELECT USING (
    is_published = true 
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Админы могут обновлять любые посты
DROP POLICY IF EXISTS "Админы могут обновлять посты" ON posts;
CREATE POLICY "Админы могут обновлять посты" ON posts
  FOR UPDATE USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Админы видят всех экспертов
DROP POLICY IF EXISTS "Админы видят всех экспертов" ON experts;
CREATE POLICY "Админы видят всех экспертов" ON experts
  FOR SELECT USING (
    is_active = true 
    OR profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Админы могут обновлять любых экспертов
DROP POLICY IF EXISTS "Админы могут обновлять экспертов" ON experts;
CREATE POLICY "Админы могут обновлять экспертов" ON experts
  FOR UPDATE USING (
    auth.uid() = profile_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================
-- Функция для создания задачи модерации при создании сообщества
-- ============================================

CREATE OR REPLACE FUNCTION create_community_moderation_task()
RETURNS TRIGGER AS $$
BEGIN
  -- Создаем задачу модерации только для новых неопубликованных сообществ
  IF NEW.is_published = false THEN
    INSERT INTO moderation_tasks (content_type, content_id, status, priority, metadata)
    VALUES (
      'community',
      NEW.id,
      'pending',
      'normal',
      jsonb_build_object(
        'name', NEW.name,
        'slug', NEW.slug,
        'owner_id', NEW.owner_id
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS create_community_moderation_task_trigger ON communities;
CREATE TRIGGER create_community_moderation_task_trigger
  AFTER INSERT ON communities
  FOR EACH ROW
  EXECUTE FUNCTION create_community_moderation_task();

-- ============================================
-- Функция для автоматического обновления статуса задачи при публикации
-- ============================================

CREATE OR REPLACE FUNCTION update_moderation_task_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем задачу модерации при изменении статуса публикации
  IF OLD.is_published = false AND NEW.is_published = true THEN
    UPDATE moderation_tasks
    SET 
      status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid()
    WHERE content_id = NEW.id
      AND content_type = TG_TABLE_NAME::text
      AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_community_moderation_task_trigger ON communities;
CREATE TRIGGER update_community_moderation_task_trigger
  AFTER UPDATE ON communities
  FOR EACH ROW
  WHEN (OLD.is_published IS DISTINCT FROM NEW.is_published)
  EXECUTE FUNCTION update_moderation_task_on_publish();

DROP TRIGGER IF EXISTS update_event_moderation_task_trigger ON events;
CREATE TRIGGER update_event_moderation_task_trigger
  AFTER UPDATE ON events
  FOR EACH ROW
  WHEN (OLD.is_published IS DISTINCT FROM NEW.is_published)
  EXECUTE FUNCTION update_moderation_task_on_publish();

DROP TRIGGER IF EXISTS update_post_moderation_task_trigger ON posts;
CREATE TRIGGER update_post_moderation_task_trigger
  AFTER UPDATE ON posts
  FOR EACH ROW
  WHEN (OLD.is_published IS DISTINCT FROM NEW.is_published)
  EXECUTE FUNCTION update_moderation_task_on_publish();

DROP TRIGGER IF EXISTS update_expert_moderation_task_trigger ON experts;
CREATE TRIGGER update_expert_moderation_task_trigger
  AFTER UPDATE ON experts
  FOR EACH ROW
  WHEN (OLD.is_active IS DISTINCT FROM NEW.is_active)
  EXECUTE FUNCTION update_moderation_task_on_publish();

-- ============================================
-- Вспомогательные функции для админов
-- ============================================

-- Функция для получения статистики модерации
CREATE OR REPLACE FUNCTION get_moderation_stats()
RETURNS TABLE (
  pending_count BIGINT,
  in_review_count BIGINT,
  approved_today BIGINT,
  rejected_today BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status = 'pending'),
    COUNT(*) FILTER (WHERE status = 'in_review'),
    COUNT(*) FILTER (WHERE status = 'approved' AND reviewed_at >= CURRENT_DATE),
    COUNT(*) FILTER (WHERE status = 'rejected' AND reviewed_at >= CURRENT_DATE)
  FROM moderation_tasks;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;