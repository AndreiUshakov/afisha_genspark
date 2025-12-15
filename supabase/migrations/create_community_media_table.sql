-- Create community_media table for storing community gallery images
CREATE TABLE IF NOT EXISTS community_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_media_community_id ON community_media(community_id);
CREATE INDEX IF NOT EXISTS idx_community_media_uploaded_at ON community_media(uploaded_at DESC);

-- Enable Row Level Security
ALTER TABLE community_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Community owners can view their community's media
CREATE POLICY "Community owners can view their media"
  ON community_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_media.community_id
      AND communities.owner_id = auth.uid()
    )
  );

-- Policy: Community owners can insert media
CREATE POLICY "Community owners can insert media"
  ON community_media
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_media.community_id
      AND communities.owner_id = auth.uid()
    )
  );

-- Policy: Community owners can delete their media
CREATE POLICY "Community owners can delete media"
  ON community_media
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_media.community_id
      AND communities.owner_id = auth.uid()
    )
  );

-- Policy: Public can view media from published communities (optional - для публичного просмотра)
CREATE POLICY "Public can view media from published communities"
  ON community_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_media.community_id
      AND communities.is_published = true
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_community_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_media_updated_at
  BEFORE UPDATE ON community_media
  FOR EACH ROW
  EXECUTE FUNCTION update_community_media_updated_at();