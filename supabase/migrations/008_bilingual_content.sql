-- 008_bilingual_content.sql
-- Arabic versions of the public content (Phase 3, "migration A").
--
-- Additive only: new nullable text columns, nothing altered or dropped.
-- English stays in the existing columns, and NULL/empty Arabic makes the
-- site fall back to English, so existing rows keep working unchanged.
--
-- Access: every new column inherits the existing table-level grants (anon
-- SELECT, authenticated INSERT/UPDATE) and the existing row-level policies
-- (public reads published rows, only is_admin() writes). No policy or grant
-- changes are needed.
--
-- JSONB content gets Arabic as sibling keys inside the same objects; JSONB
-- accepts them without DDL (documented in the comments below):
--   portfolio_settings.profile       full_name_ar, title_ar, tagline_ar, bio_ar, location_ar
--   portfolio_settings.site_settings site_title_ar, site_description_ar
--   portfolio_settings.seo_settings  meta_title_ar, meta_description_ar
--   portfolio_settings.career_data   philosophy_ar, mission_ar,
--                                    timeline[] title_ar, company_ar, description_ar
--                                    values[] title_ar, description_ar
--                                    interests[] name_ar
--   projects.content_sections[]      title_ar, content_ar
--   projects.testimonials[]          content_ar, name_ar, role_ar, company_ar
--
-- Category, tags and project type come from fixed lists in the admin and are
-- translated in the site code, so they get no columns.
--
-- Apply in the Supabase SQL editor (or as a migration) for project
-- islvhbgogwxgconhldsi. Safe to run twice.

begin;

alter table public.projects
  add column if not exists title_ar text,
  add column if not exists description_ar text,
  add column if not exists client_ar text,
  add column if not exists problem_ar text,
  add column if not exists solution_ar text,
  add column if not exists results_ar text,
  add column if not exists meta_title_ar text,
  add column if not exists meta_description_ar text;

alter table public.skill_categories
  add column if not exists title_ar text;

alter table public.skills
  add column if not exists name_ar text;

comment on column public.projects.title_ar is 'Arabic title; NULL falls back to title.';
comment on column public.projects.description_ar is 'Arabic short summary; NULL falls back to description.';
comment on column public.projects.client_ar is 'Arabic client name; NULL falls back to client.';
comment on column public.projects.problem_ar is 'Arabic problem write-up; NULL falls back to problem.';
comment on column public.projects.solution_ar is 'Arabic solution write-up; NULL falls back to solution.';
comment on column public.projects.results_ar is 'Arabic results write-up; NULL falls back to results.';
comment on column public.projects.meta_title_ar is 'Arabic SEO title; NULL falls back to meta_title.';
comment on column public.projects.meta_description_ar is 'Arabic SEO description; NULL falls back to meta_description.';
comment on column public.skill_categories.title_ar is 'Arabic category title; NULL falls back to title.';
comment on column public.skills.name_ar is 'Arabic skill name, only for non-technology words; NULL falls back to name.';

comment on column public.projects.content_sections is
  'Array of {id, title, title_ar, content, content_ar, order}. *_ar keys are optional Arabic versions.';
comment on column public.projects.testimonials is
  'Array of {id, name, name_ar, role, role_ar, company, company_ar, content, content_ar, avatar}. *_ar keys are optional.';
comment on column public.portfolio_settings.profile is
  'Profile JSON. Optional Arabic keys: full_name_ar, title_ar, tagline_ar, bio_ar, location_ar.';
comment on column public.portfolio_settings.career_data is
  'Career JSON. Optional Arabic keys: philosophy_ar, mission_ar; timeline[] title_ar/company_ar/description_ar; values[] title_ar/description_ar; interests[] name_ar.';

commit;

-- Check after applying (expects 10 rows):
-- select table_name, column_name from information_schema.columns
--  where table_schema = 'public' and column_name like '%\_ar' escape '\'
--  order by table_name, column_name;
--
-- Rollback (only if needed; deletes any Arabic text saved in these columns):
-- alter table public.projects
--   drop column if exists title_ar, drop column if exists description_ar,
--   drop column if exists client_ar, drop column if exists problem_ar,
--   drop column if exists solution_ar, drop column if exists results_ar,
--   drop column if exists meta_title_ar, drop column if exists meta_description_ar;
-- alter table public.skill_categories drop column if exists title_ar;
-- alter table public.skills drop column if exists name_ar;
