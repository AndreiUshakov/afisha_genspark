-- Create the community-media storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-media',
  'community-media',
  true,
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Community owners can upload to their folder
CREATE POLICY "Community owners can upload media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'community-media'
  AND auth.uid() IN (
    SELECT owner_id FROM communities
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Policy: Community owners can view their media
CREATE POLICY "Community owners can view their media"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'community-media'
  AND auth.uid() IN (
    SELECT owner_id FROM communities
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Policy: Community owners can delete their media
CREATE POLICY "Community owners can delete their media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'community-media'
  AND auth.uid() IN (
    SELECT owner_id FROM communities
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Policy: Public can view media from published communities
CREATE POLICY "Public can view published community media"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'community-media'
  AND EXISTS (
    SELECT 1 FROM communities
    WHERE id::text = (storage.foldername(name))[1]
    AND is_published = true
  )
);