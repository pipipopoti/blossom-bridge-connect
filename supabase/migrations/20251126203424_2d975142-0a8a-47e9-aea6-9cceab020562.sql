-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('hero-images', 'hero-images', true),
  ('story-images', 'story-images', true),
  ('program-images', 'program-images', true);

-- Storage policies for hero images
CREATE POLICY "Anyone can view hero images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-images');

CREATE POLICY "Admins can upload hero images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hero-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update hero images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hero-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete hero images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hero-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Storage policies for story images
CREATE POLICY "Anyone can view story images"
ON storage.objects FOR SELECT
USING (bucket_id = 'story-images');

CREATE POLICY "Admins can upload story images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'story-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update story images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'story-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete story images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'story-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Storage policies for program images
CREATE POLICY "Anyone can view program images"
ON storage.objects FOR SELECT
USING (bucket_id = 'program-images');

CREATE POLICY "Admins can upload program images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'program-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update program images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'program-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete program images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'program-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Update stories table to support multiple sections
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb;

-- Update program_details to add image_shape column
ALTER TABLE program_details
ADD COLUMN IF NOT EXISTS image_shape TEXT DEFAULT 'rectangle';