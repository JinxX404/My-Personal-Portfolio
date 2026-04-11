-- Complete fix for publishing_status - run this in Supabase SQL Editor

-- 1. First find and drop any existing constraint
DO $$ 
BEGIN
  -- Try to find and drop constraints that might be blocking
  EXECUTE (
    SELECT string_agg(
      'ALTER TABLE projects DROP CONSTRAINT IF EXISTS ' || conname || ';',
      ' '
    )
    FROM pg_constraint
    WHERE conrelid = 'projects'::regclass
    AND contype = 'c'
    AND conname LIKE '%publishing_status%'
  );
END $$;

-- 2. Add the new constraint
ALTER TABLE projects 
ADD CONSTRAINT projects_publishing_status_valid 
CHECK (publishing_status IN ('draft', 'in_progress', 'review', 'approved', 'published', 'archived'));

-- 3. Update RLS policy to include in_progress
DROP POLICY IF EXISTS "Public can view published projects" ON projects;
CREATE POLICY "Public can view published and in-progress projects"
  ON projects FOR SELECT
  USING (publishing_status IN ('published', 'in_progress') AND visibility = 'public');