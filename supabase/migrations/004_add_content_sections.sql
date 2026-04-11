-- 004_add_content_sections.sql
-- Add dynamic content sections for projects

ALTER TABLE projects ADD COLUMN IF NOT EXISTS content_sections jsonb DEFAULT '[]';

-- Optional: Add index for better query performance on content sections
CREATE INDEX IF NOT EXISTS idx_projects_content_sections ON projects USING gin (content_sections);

COMMENT ON COLUMN projects.content_sections IS 'Array of content sections with structure: [{title: string, content: string, order: number}]';
