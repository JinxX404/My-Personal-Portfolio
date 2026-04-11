-- 005_add_in_progress_status.sql
-- Add in_progress status to publishing_status

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_publishing_status_check;

ALTER TABLE projects ADD CONSTRAINT projects_publishing_status_check 
  CHECK (publishing_status IN ('draft', 'in_progress', 'review', 'approved', 'published', 'archived'));