-- 006_restrict_admin_access.sql
-- Replace "any signed-in user" write/read policies with an admin allowlist.
--
-- DO NOT run this against production from the app. Apply it yourself in the
-- Supabase SQL editor (or the Supabase CLI) for project islvhbgogwxgconhldsi.
--
-- After it succeeds:
--   1. Find your user id:  select id, email from auth.users;
--   2. Allow that user:    insert into public.admin_users (user_id) values ('<uuid>');
--      Alternatively set the user's Auth app_metadata to {"is_admin": true}.
--      Both checks are honored by public.is_admin() and by the admin UI.
--   3. In Authentication > Providers > Email, disable new signups.
--      This migration does not change Auth dashboard settings.
--
-- Until step 2 is done, nobody can change content or read contact submissions.
-- The public site can still read published projects, skills, and settings,
-- and visitors can still insert contact submissions.

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own admin membership" ON public.admin_users;
CREATE POLICY "Users can read own admin membership"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

REVOKE ALL ON TABLE public.admin_users FROM anon;
GRANT SELECT ON TABLE public.admin_users TO authenticated;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = auth.uid()
      )
      OR COALESCE(auth.jwt() -> 'app_metadata' ->> 'is_admin', '') = 'true'
    );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- ==================== PROJECTS ====================
DROP POLICY IF EXISTS "Authenticated users can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read all" ON public.projects;
DROP POLICY IF EXISTS "Allow public insert" ON public.projects;
DROP POLICY IF EXISTS "Allow public update" ON public.projects;
DROP POLICY IF EXISTS "Allow public delete" ON public.projects;

DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Public can view published and in-progress projects" ON public.projects;
CREATE POLICY "Public can view published and in-progress projects"
  ON public.projects
  FOR SELECT
  USING (publishing_status IN ('published', 'in_progress') AND visibility = 'public');

CREATE POLICY "Admins can view all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ==================== SKILL CATEGORIES ====================
DROP POLICY IF EXISTS "Authenticated users can manage skill categories" ON public.skill_categories;
DROP POLICY IF EXISTS "Allow public insert" ON public.skill_categories;
DROP POLICY IF EXISTS "Allow public update" ON public.skill_categories;
DROP POLICY IF EXISTS "Allow public delete" ON public.skill_categories;

DROP POLICY IF EXISTS "Public can view skill categories" ON public.skill_categories;
DROP POLICY IF EXISTS "Allow public read access" ON public.skill_categories;
CREATE POLICY "Public can view skill categories"
  ON public.skill_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage skill categories"
  ON public.skill_categories
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==================== SKILLS ====================
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON public.skills;
DROP POLICY IF EXISTS "Allow public insert" ON public.skills;
DROP POLICY IF EXISTS "Allow public update" ON public.skills;
DROP POLICY IF EXISTS "Allow public delete" ON public.skills;

DROP POLICY IF EXISTS "Public can view skills" ON public.skills;
DROP POLICY IF EXISTS "Allow public read access" ON public.skills;
CREATE POLICY "Public can view skills"
  ON public.skills
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage skills"
  ON public.skills
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==================== TECH STACK ====================
DROP POLICY IF EXISTS "Authenticated users can manage tech stack" ON public.tech_stack;
DROP POLICY IF EXISTS "Allow public insert" ON public.tech_stack;
DROP POLICY IF EXISTS "Allow public update" ON public.tech_stack;
DROP POLICY IF EXISTS "Allow public delete" ON public.tech_stack;

DROP POLICY IF EXISTS "Public can view tech stack" ON public.tech_stack;
DROP POLICY IF EXISTS "Allow public read access" ON public.tech_stack;
CREATE POLICY "Public can view tech stack"
  ON public.tech_stack
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tech stack"
  ON public.tech_stack
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==================== PORTFOLIO SETTINGS ====================
DROP POLICY IF EXISTS "Authenticated users can update settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Enable update for all users" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.portfolio_settings;

DROP POLICY IF EXISTS "Public can view settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.portfolio_settings;
CREATE POLICY "Public can view settings"
  ON public.portfolio_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert settings"
  ON public.portfolio_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update settings"
  ON public.portfolio_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete settings"
  ON public.portfolio_settings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ==================== CONTACT SUBMISSIONS ====================
-- Visitors may insert a row, but cannot read it back. The client must not
-- chain .select() onto the insert.
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can update submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can delete submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow all select" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow all update" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow all delete" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow all insert" ON public.contact_submissions;

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update submissions"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete submissions"
  ON public.contact_submissions
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ==================== STORAGE ====================
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio assets" ON storage.objects;

CREATE POLICY "Admins can upload project images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admins can update project images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admins can delete project images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admins can upload portfolio assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admins can update portfolio assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admins can delete portfolio assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin());
