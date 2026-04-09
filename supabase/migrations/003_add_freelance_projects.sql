-- =============================================
-- MIGRATION: Add freelance_projects column
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- Drop if exists and recreate as integer
ALTER TABLE portfolio_settings
DROP COLUMN IF EXISTS freelance_projects;

ALTER TABLE portfolio_settings
ADD COLUMN freelance_projects integer DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN portfolio_settings.freelance_projects IS 'Number of freelance projects completed (e.g., 10)';

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'portfolio_settings' 
AND column_name = 'freelance_projects';
