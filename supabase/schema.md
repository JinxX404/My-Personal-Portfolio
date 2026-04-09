# Supabase Database Schema

This document contains the complete database schema for Moataz's Portfolio.

## Tables

### skill_categories

```sql
CREATE TABLE skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code',
  color TEXT NOT NULL DEFAULT 'accent',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON skill_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON skill_categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON skill_categories FOR DELETE USING (true);
```

### skills

```sql
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  icon TEXT NOT NULL DEFAULT 'Code',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON skills FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON skills FOR DELETE USING (true);
```

### tech_stack

```sql
CREATE TABLE tech_stack (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON tech_stack FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON tech_stack FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON tech_stack FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON tech_stack FOR DELETE USING (true);
```

### projects

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT,
  project_type TEXT,
  category TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  description TEXT NOT NULL,
  hero_images JSONB DEFAULT '[]'::jsonb,
  screenshots JSONB DEFAULT '[]'::jsonb,
  mockups JSONB DEFAULT '[]'::jsonb,
  before_after JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  complexity TEXT,
  metrics JSONB DEFAULT '[]'::jsonb,
  repository_url TEXT,
  demo_url TEXT,
  problem TEXT,
  solution TEXT,
  results TEXT,
  prototype_url TEXT,
  testimonials JSONB DEFAULT '[]'::jsonb,
  publishing_status TEXT NOT NULL DEFAULT 'draft',
  visibility TEXT NOT NULL DEFAULT 'public',
  password TEXT,
  featured BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  enable_case_study BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read all" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON projects FOR DELETE USING (true);
```

### blogs

```sql
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  reading_time INTEGER,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read all" ON blogs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON blogs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON blogs FOR DELETE USING (true);
```

### portfolio_settings

```sql
CREATE TABLE portfolio_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile JSONB DEFAULT '{
    "full_name": "",
    "title": "",
    "tagline": "",
    "bio": "",
    "avatar": "",
    "resume_url": "",
    "cv_url": "",
    "email": "",
    "phone": "",
    "location": "",
    "availability": "available"
  }'::jsonb,
  social_links JSONB DEFAULT '{
    "github": "",
    "linkedin": "",
    "twitter": "",
    "dribbble": "",
    "behance": "",
    "instagram": "",
    "facebook": "",
    "youtube": "",
    "medium": "",
    "dev_to": "",
    "stackoverflow": "",
    "codepen": ""
  }'::jsonb,
  site_settings JSONB DEFAULT '{
    "site_title": "Portfolio",
    "site_description": "",
    "site_keywords": "",
    "logo_url": "",
    "favicon_url": "",
    "primary_color": "#3B82F6",
    "accent_color": "#8B5CF6",
    "show_theme_toggle": true,
    "enable_animations": true,
    "enable_blog_comments": false,
    "enable_contact_form": true
  }'::jsonb,
  seo_settings JSONB DEFAULT '{
    "meta_title": "",
    "meta_description": "",
    "og_image": "",
    "twitter_handle": "",
    "google_analytics_id": "",
    "google_site_verification": ""
  }'::jsonb,
  career_data JSONB DEFAULT '{}'::jsonb,
  freelance_projects integer DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON portfolio_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON portfolio_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON portfolio_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON portfolio_settings FOR DELETE USING (true);

CREATE INDEX idx_portfolio_settings_updated_at ON portfolio_settings(updated_at DESC);

CREATE OR REPLACE FUNCTION check_single_row_portfolio_settings()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM portfolio_settings) >= 1 THEN
    RAISE EXCEPTION 'Only one row is allowed in portfolio_settings table. Update the existing row instead.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_row_portfolio_settings
  BEFORE INSERT ON portfolio_settings
  FOR EACH ROW
  EXECUTE FUNCTION check_single_row_portfolio_settings();

INSERT INTO portfolio_settings (profile, social_links, site_settings, seo_settings)
SELECT 
  '{
    "full_name": "Your Name",
    "title": "Full Stack Developer",
    "tagline": "Crafting Digital Experiences That Matter",
    "bio": "Passionate developer with expertise in modern web technologies.",
    "avatar": "",
    "resume_url": "",
    "cv_url": "",
    "email": "contact@example.com",
    "phone": "",
    "location": "",
    "availability": "available"
  }'::jsonb,
  '{
    "github": "",
    "linkedin": "",
    "twitter": "",
    "dribbble": "",
    "behance": "",
    "instagram": "",
    "facebook": "",
    "youtube": "",
    "medium": "",
    "dev_to": "",
    "stackoverflow": "",
    "codepen": ""
  }'::jsonb,
  '{
    "site_title": "Portfolio",
    "site_description": "Professional portfolio showcasing my work and expertise",
    "site_keywords": "web developer, designer, react, nodejs",
    "logo_url": "",
    "favicon_url": "",
    "primary_color": "#3B82F6",
    "accent_color": "#8B5CF6",
    "show_theme_toggle": true,
    "enable_animations": true,
    "enable_blog_comments": false,
    "enable_contact_form": true
  }'::jsonb,
  '{
    "meta_title": "Professional Portfolio",
    "meta_description": "Showcasing innovative projects and technical expertise",
    "og_image": "",
    "twitter_handle": "",
    "google_analytics_id": "",
    "google_site_verification": ""
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM portfolio_settings LIMIT 1);
```

### contact_submissions

```sql
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general',
  budget TEXT,
  timeline TEXT,
  event_date DATE,
  event_location TEXT,
  audience_size TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all insert" ON contact_submissions FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "Allow all select" ON contact_submissions FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Allow all update" ON contact_submissions FOR UPDATE TO PUBLIC USING (true);
CREATE POLICY "Allow all delete" ON contact_submissions FOR DELETE TO PUBLIC USING (true);
```

## Triggers

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON skill_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tech_stack_updated_at BEFORE UPDATE ON tech_stack
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Storage

### Buckets

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;
```

### Storage Policies

```sql
-- project-images
CREATE POLICY "Public can view project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Authenticated users can upload project images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Authenticated users can update project images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images') WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Authenticated users can delete project images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');

-- portfolio-assets
CREATE POLICY "Public can view portfolio assets" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Authenticated users can upload portfolio assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Authenticated users can update portfolio assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Authenticated users can delete portfolio assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets');
```

## Seed Data

```sql
INSERT INTO skill_categories (key, title, icon, color, order_index) VALUES
  ('frontend', 'Frontend Development', 'Monitor', 'accent', 1),
  ('backend', 'Backend Development', 'Server', 'success', 2),
  ('mobile', 'Mobile Development', 'Smartphone', 'cta', 3),
  ('tools', 'Tools & Technologies', 'Settings', 'primary', 4);

INSERT INTO tech_stack (name, order_index) VALUES
  ('React', 1),
  ('TypeScript', 2),
  ('Node.js', 3),
  ('PostgreSQL', 4),
  ('Tailwind CSS', 5);
```

## Verification Queries

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('blogs', 'projects', 'skills', 'skill_categories', 'tech_stack', 'portfolio_settings', 'contact_submissions');

-- Check all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('blogs', 'projects', 'skills', 'skill_categories', 'tech_stack', 'portfolio_settings', 'contact_submissions');

-- Verify storage buckets
SELECT id, name, public FROM storage.buckets;
```
