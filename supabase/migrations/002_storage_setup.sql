-- =============================================
-- STORAGE SETUP SCRIPT FOR MOATAZ'S PORTFOLIO
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- Enable storage extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CREATE STORAGE BUCKETS
-- =============================================

-- Create 'project-images' bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Create 'portfolio-assets' bucket for CV/resume files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. STORAGE POLICIES FOR project-images
-- =============================================

-- Allow anyone to view (read) project images
CREATE POLICY "Public can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

-- Allow authenticated users to upload project images
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- Allow authenticated users to update project images
CREATE POLICY "Authenticated users can update project images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images')
WITH CHECK (bucket_id = 'project-images');

-- Allow authenticated users to delete project images
CREATE POLICY "Authenticated users can delete project images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');

-- =============================================
-- 3. STORAGE POLICIES FOR portfolio-assets
-- =============================================

-- Allow anyone to view (read) portfolio assets (CV/resume)
CREATE POLICY "Public can view portfolio assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- Allow authenticated users to upload portfolio assets
CREATE POLICY "Authenticated users can upload portfolio assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets');

-- Allow authenticated users to update portfolio assets
CREATE POLICY "Authenticated users can update portfolio assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-assets')
WITH CHECK (bucket_id = 'portfolio-assets');

-- Allow authenticated users to delete portfolio assets
CREATE POLICY "Authenticated users can delete portfolio assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-assets');

-- =============================================
-- 4. VERIFICATION
-- =============================================

-- Check buckets were created
SELECT id, name, public FROM storage.buckets;

-- Expected output:
-- | id               | name               | public |
-- |------------------|--------------------|--------|
-- | project-images   | project-images     | true   |
-- | portfolio-assets | portfolio-assets   | true   |

-- =============================================
-- 5. USAGE EXAMPLES
-- =============================================

-- After running this script:
-- 1. Upload files via the app (authenticated users only)
-- 2. Files will be publicly accessible via URLs like:
--    - https://[your-project].supabase.co/storage/v1/object/public/project-images/...
--    - https://[your-project].supabase.co/storage/v1/object/public/portfolio-assets/...

-- =============================================
-- TROUBLESHOOTING
-- =============================================

-- If buckets exist but policies fail, drop and recreate:
-- DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
-- (run the CREATE POLICY statements again)
