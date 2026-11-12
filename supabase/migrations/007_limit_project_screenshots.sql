-- Cap each project's screenshot list at 15.
--
-- The column stays JSONB. Existing URL strings and objects
-- ({ url, layout, caption }) remain valid. Null and non-array values are
-- left alone so an older row still loads. Apply this in the Supabase SQL
-- editor after 006_restrict_admin_access.sql.

ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS projects_screenshots_max_length;

ALTER TABLE projects
  ADD CONSTRAINT projects_screenshots_max_length
  CHECK (
    screenshots IS NULL
    OR jsonb_typeof(screenshots) IS DISTINCT FROM 'array'
    OR jsonb_array_length(screenshots) <= 15
  );
