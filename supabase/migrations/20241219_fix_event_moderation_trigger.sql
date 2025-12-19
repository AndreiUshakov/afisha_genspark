-- ============================================
-- Миграция: Исправление триггера модерации для events
-- Дата: 2024-12-19
-- Описание: Создание отдельной функции для обновления задач модерации events (используют is_published вместо status)
-- ============================================

-- Создаем функцию специально для events (работает с is_published)
CREATE OR REPLACE FUNCTION update_event_moderation_task_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем задачу модерации при публикации события
  IF NEW.is_published = true AND OLD.is_published = false THEN
    UPDATE moderation_tasks
    SET 
      status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid()
    WHERE content_id = NEW.id
      AND content_type = 'event'
      AND status IN ('pending', 'in_review');
  -- Если событие снято с публикации
  ELSIF NEW.is_published = false AND OLD.is_published = true THEN
    -- Можно добавить логику, если нужно
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем функцию специально для posts (работает с is_published)
CREATE OR REPLACE FUNCTION update_post_moderation_task_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем задачу модерации при публикации поста
  IF NEW.is_published = true AND OLD.is_published = false THEN
    UPDATE moderation_tasks
    SET 
      status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid()
    WHERE content_id = NEW.id
      AND content_type = 'post'
      AND status IN ('pending', 'in_review');
  -- Если пост снят с публикации
  ELSIF NEW.is_published = false AND OLD.is_published = true THEN
    -- Можно добавить логику, если нужно
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем функцию специально для experts (работает с is_active)
CREATE OR REPLACE FUNCTION update_expert_moderation_task_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем задачу модерации при активации эксперта
  IF NEW.is_active = true AND OLD.is_active = false THEN
    UPDATE moderation_tasks
    SET 
      status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid()
    WHERE content_id = NEW.id
      AND content_type = 'expert'
      AND status IN ('pending', 'in_review');
  -- Если эксперт деактивирован
  ELSIF NEW.is_active = false AND OLD.is_active = true THEN
    -- Можно добавить логику, если нужно
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Пересоздаем триггеры с правильными функциями
DROP TRIGGER IF EXISTS update_event_moderation_task_trigger ON events;
CREATE TRIGGER update_event_moderation_task_trigger
  AFTER UPDATE ON events
  FOR EACH ROW
  WHEN (OLD.is_published IS DISTINCT FROM NEW.is_published)
  EXECUTE FUNCTION update_event_moderation_task_on_publish();

DROP TRIGGER IF EXISTS update_post_moderation_task_trigger ON posts;
CREATE TRIGGER update_post_moderation_task_trigger
  AFTER UPDATE ON posts
  FOR EACH ROW
  WHEN (OLD.is_published IS DISTINCT FROM NEW.is_published)
  EXECUTE FUNCTION update_post_moderation_task_on_publish();

DROP TRIGGER IF EXISTS update_expert_moderation_task_trigger ON experts;
CREATE TRIGGER update_expert_moderation_task_trigger
  AFTER UPDATE ON experts
  FOR EACH ROW
  WHEN (OLD.is_active IS DISTINCT FROM NEW.is_active)
  EXECUTE FUNCTION update_expert_moderation_task_on_publish();

-- Комментарии
COMMENT ON FUNCTION update_event_moderation_task_on_publish() IS 'Обновляет задачи модерации при изменении is_published для events';
COMMENT ON FUNCTION update_post_moderation_task_on_publish() IS 'Обновляет задачи модерации при изменении is_published для posts';
COMMENT ON FUNCTION update_expert_moderation_task_on_publish() IS 'Обновляет задачи модерации при изменении is_active для experts';