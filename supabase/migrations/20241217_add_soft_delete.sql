-- ============================================
-- Миграция: Добавление поддержки мягкого удаления
-- Дата: 2024-12-17
-- Описание: Добавление полей deleted_at для мягкого удаления сообществ и событий
-- ============================================

-- Добавляем поле deleted_at в таблицу communities
ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Добавляем поле deleted_at в таблицу events
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Создаем индексы для быстрой фильтрации
CREATE INDEX IF NOT EXISTS idx_communities_deleted_at ON communities(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events(deleted_at) WHERE deleted_at IS NULL;

-- ============================================
-- Обновление RLS политик для communities
-- ============================================

-- Обновляем политику SELECT: исключаем удаленные сообщества для обычных пользователей
DROP POLICY IF EXISTS "Опубликованные сообщества видны всем" ON communities;
CREATE POLICY "Опубликованные сообщества видны всем" ON communities
  FOR SELECT USING (
    deleted_at IS NULL AND (
      status = 'published' 
      OR owner_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );

-- Политика для админов: видят ВСЕ сообщества, включая удаленные
DROP POLICY IF EXISTS "Админы видят все сообщества включая удаленные" ON communities;
CREATE POLICY "Админы видят все сообщества включая удаленные" ON communities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================
-- Обновление RLS политик для events
-- ============================================

-- Обновляем политику SELECT: исключаем удаленные события для обычных пользователей
DROP POLICY IF EXISTS "Опубликованные события видны всем" ON events;
CREATE POLICY "Опубликованные события видны всем" ON events
  FOR SELECT USING (
    deleted_at IS NULL AND (
      is_published = true
      OR organizer_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );

-- Политика для админов: видят ВСЕ события, включая удаленные
DROP POLICY IF EXISTS "Админы видят все события включая удаленные" ON events;
CREATE POLICY "Админы видят все события включая удаленные" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================
-- Функции для мягкого удаления
-- ============================================

-- Функция для мягкого удаления сообщества
CREATE OR REPLACE FUNCTION soft_delete_community(
  p_community_id UUID,
  delete_option TEXT DEFAULT 'all' -- 'all' или 'future'
)
RETURNS JSON AS $$
DECLARE
  v_deleted_events INT := 0;
  v_future_events_count INT := 0;
  v_community_name TEXT;
BEGIN
  -- Проверяем существование сообщества
  SELECT name INTO v_community_name
  FROM communities
  WHERE id = p_community_id AND deleted_at IS NULL;
  
  IF v_community_name IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Сообщество не найдено или уже удалено'
    );
  END IF;

  -- Подсчитываем будущие события
  SELECT COUNT(*) INTO v_future_events_count
  FROM events
  WHERE events.community_id = p_community_id
    AND events.deleted_at IS NULL
    AND events.start_date > NOW();

  -- Мягко удаляем события в зависимости от опции
  IF delete_option = 'all' THEN
    -- Удаляем все события сообщества
    UPDATE events
    SET deleted_at = NOW()
    WHERE events.community_id = p_community_id
      AND events.deleted_at IS NULL;
    
    GET DIAGNOSTICS v_deleted_events = ROW_COUNT;
    
  ELSIF delete_option = 'future' THEN
    -- Удаляем только будущие события
    UPDATE events
    SET deleted_at = NOW()
    WHERE events.community_id = p_community_id
      AND events.deleted_at IS NULL
      AND events.start_date > NOW();
    
    GET DIAGNOSTICS v_deleted_events = ROW_COUNT;
  END IF;

  -- Мягко удаляем сообщество
  UPDATE communities
  SET deleted_at = NOW()
  WHERE id = p_community_id;

  RETURN json_build_object(
    'success', true,
    'deleted_events', v_deleted_events,
    'future_events_count', v_future_events_count,
    'community_name', v_community_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для восстановления сообщества (для админов)
CREATE OR REPLACE FUNCTION restore_community(p_community_id UUID)
RETURNS JSON AS $$
DECLARE
  v_community_name TEXT;
BEGIN
  -- Проверяем существование удаленного сообщества
  SELECT name INTO v_community_name
  FROM communities
  WHERE id = p_community_id AND deleted_at IS NOT NULL;
  
  IF v_community_name IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Удаленное сообщество не найдено'
    );
  END IF;

  -- Восстанавливаем сообщество
  UPDATE communities
  SET deleted_at = NULL
  WHERE id = p_community_id;

  RETURN json_build_object(
    'success', true,
    'community_name', v_community_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для окончательного удаления сообщества (только для админов)
CREATE OR REPLACE FUNCTION hard_delete_community(p_community_id UUID)
RETURNS JSON AS $$
DECLARE
  v_community_name TEXT;
  v_deleted_events INT := 0;
BEGIN
  -- Проверяем существование сообщества
  SELECT name INTO v_community_name
  FROM communities
  WHERE id = p_community_id;
  
  IF v_community_name IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Сообщество не найдено'
    );
  END IF;

  -- Удаляем все связанные события
  DELETE FROM events
  WHERE events.community_id = p_community_id;
  
  GET DIAGNOSTICS v_deleted_events = ROW_COUNT;

  -- Удаляем медиа-файлы сообщества
  DELETE FROM community_media
  WHERE community_media.community_id = p_community_id;

  -- Удаляем контент-блоки сообщества
  DELETE FROM community_content_blocks
  WHERE community_content_blocks.community_id = p_community_id;

  -- Удаляем сообщество
  DELETE FROM communities
  WHERE id = p_community_id;

  RETURN json_build_object(
    'success', true,
    'deleted_events', v_deleted_events,
    'community_name', v_community_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Комментарии
-- ============================================

COMMENT ON COLUMN communities.deleted_at IS 'Дата и время мягкого удаления. NULL = не удалено';
COMMENT ON COLUMN events.deleted_at IS 'Дата и время мягкого удаления. NULL = не удалено';

COMMENT ON FUNCTION soft_delete_community IS 'Мягкое удаление сообщества с опциями удаления событий (all/future)';
COMMENT ON FUNCTION restore_community IS 'Восстановление мягко удаленного сообщества (только для админов)';
COMMENT ON FUNCTION hard_delete_community IS 'Окончательное удаление сообщества из БД (только для админов)';