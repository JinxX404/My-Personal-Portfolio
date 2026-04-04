-- 001_initial_schema.sql
-- Full schema with RLS policies for Moataz's Portfolio

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== PROJECTS ====================
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  client text,
  technologies text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  demo_url text,
  repository_url text,
  status text DEFAULT 'draft',
  publishing_status text DEFAULT 'draft',
  featured boolean DEFAULT false,
  visibility text DEFAULT 'public',
  hero_images text[] DEFAULT '{}',
  screenshots jsonb DEFAULT '[]',
  mockups jsonb DEFAULT '[]',
  problem text,
  solution text,
  results text,
  testimonials jsonb DEFAULT '[]',
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  USING (publishing_status = 'published' AND visibility = 'public');

CREATE POLICY "Authenticated users can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- ==================== SKILL CATEGORIES ====================
CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  title text NOT NULL,
  icon text,
  color text,
  order_index integer DEFAULT 0
);

ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view skill categories"
  ON skill_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage skill categories"
  ON skill_categories FOR ALL
  TO authenticated
  USING (true);

-- ==================== SKILLS ====================
CREATE TABLE IF NOT EXISTS skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES skill_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  level integer DEFAULT 50,
  icon text,
  order_index integer DEFAULT 0
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  TO authenticated
  USING (true);

-- ==================== TECH STACK ====================
CREATE TABLE IF NOT EXISTS tech_stack (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  order_index integer DEFAULT 0
);

ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tech stack"
  ON tech_stack FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage tech stack"
  ON tech_stack FOR ALL
  TO authenticated
  USING (true);

-- ==================== PORTFOLIO SETTINGS ====================
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile jsonb DEFAULT '{}',
  social_links jsonb DEFAULT '{}',
  site_settings jsonb DEFAULT '{}',
  seo_settings jsonb DEFAULT '{}',
  career_data jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view settings"
  ON portfolio_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update settings"
  ON portfolio_settings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert settings"
  ON portfolio_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ==================== CONTACT SUBMISSIONS ====================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  inquiry_type text DEFAULT 'general',
  budget text,
  timeline text,
  event_date date,
  event_location text,
  audience_size text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);
