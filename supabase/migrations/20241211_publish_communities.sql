-- Публикация всех существующих сообществ
-- Это обновление нужно для того, чтобы сообщества стали видны на публичных страницах

UPDATE communities
SET is_published = true
WHERE is_published = false;

-- Проверка: показать все сообщества и их статус публикации
SELECT 
  id,
  name,
  slug,
  is_published,
  created_at
FROM communities
ORDER BY created_at DESC;