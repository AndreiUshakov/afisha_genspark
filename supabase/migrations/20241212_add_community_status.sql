-- ============================================
-- Миграция: Добавление статусов для сообществ
-- Дата: 2024-12-12
-- Описание: Замена is_published на status enum с поддержкой черновиков и модерации
-- ============================================

-- Создаем enum тип для статусов сообщества
DO $$ BEGIN
  CREATE TYPE community_status AS ENUM ('draft', 'pending_moderation', 'published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Добавляем новое поле status
ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS status community_status DEFAULT 'draft';

-- Мигрируем данные из is_published в status
UPDATE communities
SET status = CASE 
  WHEN is_published = true THEN 'published'::community_status
  ELSE 'draft'::community_status
END
WHERE status = 'draft'; -- обновляем только те, где еще не установлен статус

-- Создаем индекс для нового поля
CREATE INDEX IF NOT EXISTS idx_communities_status ON communities(status);

-- Обновляем RLS политики для communities

-- Политика для SELECT: видны опубликованные сообщества всем, владелец видит свои в любом статусе, админы видят все
DROP POLICY IF EXISTS "Опубликованные сообщества видны всем" ON communities;
CREATE POLICY "Опубликованные сообщества видны всем" ON communities
  FOR SELECT USING (
    status = 'published' 
    OR owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Обновляем RLS политику для админов (уже обновлена выше, но оставим для явности)
DROP POLICY IF EXISTS "Админы видят все сообщества" ON communities;
CREATE POLICY "Админы видят все сообщества" ON communities
  FOR SELECT USING (
    status = 'published'
    OR owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================
-- Обновление функций и триггеров
-- ============================================

-- Обновляем функцию создания задачи модерации при создании сообщества
DROP FUNCTION IF EXISTS create_community_moderation_task() CASCADE;
CREATE OR REPLACE FUNCTION create_community_moderation_task()
RETURNS TRIGGER AS $$
BEGIN
  -- Создаем задачу модерации только когда статус становится 'pending_moderation'
  IF NEW.status = 'pending_moderation' THEN
    -- Проверяем, нет ли уже активной задачи
    IF NOT EXISTS (
      SELECT 1 FROM moderation_tasks
      WHERE content_type = 'community'
        AND content_id = NEW.id
        AND status IN ('pending', 'in_review')
    ) THEN
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
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Пересоздаем триггер для INSERT
DROP TRIGGER IF EXISTS create_community_moderation_task_trigger ON communities;
CREATE TRIGGER create_community_moderation_task_trigger
  AFTER INSERT ON communities
  FOR EACH ROW
  WHEN (NEW.status = 'pending_moderation')
  EXECUTE FUNCTION create_community_moderation_task();

-- Создаем новый триггер для UPDATE (когда статус меняется на pending_moderation)
DROP TRIGGER IF EXISTS update_community_status_trigger ON communities;
CREATE TRIGGER update_community_status_trigger
  AFTER UPDATE ON communities
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'pending_moderation')
  EXECUTE FUNCTION create_community_moderation_task();

-- Обновляем функцию для автоматического обновления статуса задачи при публикации
DROP FUNCTION IF EXISTS update_moderation_task_on_publish() CASCADE;
CREATE OR REPLACE FUNCTION update_moderation_task_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем задачу модерации при публикации
  IF NEW.status = 'published' AND OLD.status = 'pending_moderation' THEN
    UPDATE moderation_tasks
    SET 
      status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid()
    WHERE content_id = NEW.id
      AND content_type = 'community'
      AND status IN ('pending', 'in_review');
  -- Если статус сменился на черновик из модерации, отклоняем задачу
  ELSIF NEW.status = 'draft' AND OLD.status = 'pending_moderation' THEN
    UPDATE moderation_tasks
    SET 
      status = 'rejected',
      reviewed_at = NOW(),
      reviewed_by = auth.uid(),
      review_comment = 'Возвращено в черновики'
    WHERE content_id = NEW.id
      AND content_type = 'community'
      AND status IN ('pending', 'in_review');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Пересоздаем триггер для communities
DROP TRIGGER IF EXISTS update_community_moderation_task_trigger ON communities;
CREATE TRIGGER update_community_moderation_task_trigger
  AFTER UPDATE ON communities
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_moderation_task_on_publish();

-- Обновляем триггеры для events (они используют is_published)
DROP TRIGGER IF EXISTS update_event_moderation_task_trigger ON events;
CREATE TRIGGER update_event_moderation_task_trigger
  AFTER UPDATE ON events
  FOR EACH ROW
  WHEN (OLD.is_published IS DISTINCT FROM NEW.is_published AND NEW.is_published = true)
  EXECUTE FUNCTION update_moderation_task_on_publish();

-- Обновляем триггеры для posts (они используют is_published)
DROP TRIGGER IF EXISTS update_post_moderation_task_trigger ON posts;
CREATE TRIGGER update_post_moderation_task_trigger
  AFTER UPDATE ON posts
  FOR EACH ROW
  WHEN (OLD.is_published IS DISTINCT FROM NEW.is_published AND NEW.is_published = true)
  EXECUTE FUNCTION update_moderation_task_on_publish();

-- Обновляем триггеры для experts (они используют is_active)
DROP TRIGGER IF EXISTS update_expert_moderation_task_trigger ON experts;
CREATE TRIGGER update_expert_moderation_task_trigger
  AFTER UPDATE ON experts
  FOR EACH ROW
  WHEN (OLD.is_active IS DISTINCT FROM NEW.is_active AND NEW.is_active = true)
  EXECUTE FUNCTION update_moderation_task_on_publish();

-- ============================================
-- Комментарии
-- ============================================

COMMENT ON COLUMN communities.status IS 'Статус сообщества: draft (черновик), pending_moderation (на модерации), published (опубликовано)';
COMMENT ON TYPE community_status IS 'Типы статусов сообщества: draft - черновик, pending_moderation - на модерации, published - опубликовано';

-- После успешной миграции можно будет удалить is_published:
-- ALTER TABLE communities DROP COLUMN IF EXISTS is_published;
-- Но пока оставим для совместимости и безопасности