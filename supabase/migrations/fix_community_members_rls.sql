-- Проверяем и создаем RLS политики для community_members

-- Включаем RLS на таблице
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики, если они существуют
DROP POLICY IF EXISTS "Users can view community members" ON community_members;
DROP POLICY IF EXISTS "Users can join communities" ON community_members;
DROP POLICY IF EXISTS "Users can leave communities" ON community_members;
DROP POLICY IF EXISTS "Community owners can manage members" ON community_members;

-- Политика: любой может просматривать участников
CREATE POLICY "Users can view community members"
ON community_members
FOR SELECT
TO authenticated, anon
USING (true);

-- Политика: авторизованные пользователи могут вступать в сообщества
CREATE POLICY "Users can join communities"
ON community_members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND role = 'member');

-- Политика: пользователи могут покидать сообщества (удалять свои записи)
CREATE POLICY "Users can leave communities"
ON community_members
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Политика: владельцы сообществ могут управлять участниками
CREATE POLICY "Community owners can manage members"
ON community_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM communities
    WHERE communities.id = community_members.community_id
    AND communities.owner_id = auth.uid()
  )
);