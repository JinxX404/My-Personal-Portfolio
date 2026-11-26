-- 010_project_share_images.sql
-- Link preview ("share") images per project, one per language (Phase 5, "migration C").
--
-- Additive only: two nullable text columns on projects. Nothing existing is
-- changed. The images are PNG files (1200x630) generated in the admin
-- browser and uploaded to the existing public "project-images" bucket under
-- share/<project id>/; these columns hold their public URLs.
--
-- Access is unchanged: the existing projects policies already cover new
-- columns (public reads of published rows, admin-only writes via is_admin()).
-- Until this runs, the edge function and the site fall back to the project's
-- cover image, and the admin shows a notice instead of saving.
-- Safe to run twice.

begin;

alter table public.projects
  add column if not exists share_image text
    check (share_image is null or (char_length(share_image) <= 2048 and share_image ~ '^https://')),
  add column if not exists share_image_ar text
    check (share_image_ar is null or (char_length(share_image_ar) <= 2048 and share_image_ar ~ '^https://'));

comment on column public.projects.share_image is 'Link preview image (1200x630) for the English page; generated in the admin.';
comment on column public.projects.share_image_ar is 'Link preview image (1200x630) for the Arabic page (/ar); generated in the admin.';

commit;

-- Check after applying (expects 2 rows):
-- select column_name, data_type, is_nullable from information_schema.columns
--  where table_schema = 'public' and table_name = 'projects' and column_name like 'share_image%';
--
-- Rollback (only if needed):
-- alter table public.projects drop column if exists share_image, drop column if exists share_image_ar;
