-- 009_services_faq.sql
-- Services and FAQ for the public site (Phase 4, "migration B").
--
-- Additive only: two new tables, nothing existing is altered or dropped.
-- Both are bilingual from day one: English in the base column, Arabic in the
-- matching "_ar" column (NULL/empty Arabic falls back to English on /ar).
--
-- Access, same model as projects:
--   * anon / visitors: SELECT published rows only
--   * admins (public.is_admin()): read everything, insert, update, delete
--   * table grants match the rest of the schema: anon SELECT,
--     authenticated SELECT/INSERT/UPDATE/DELETE (rows still filtered by RLS)
--
-- Other Phase 4 content needs no DDL:
--   * homepage testimonials reuse projects.testimonials[] with "featured": true
--   * WhatsApp number lives in portfolio_settings.profile ->> 'whatsapp'
--   * EGP/USD budget ranges are stored in contact_submissions.budget as a key
--     such as 'egp-10k-30k' (existing text column)
--
-- Nothing is seeded: the site hides Services and FAQ until rows are published.
-- Safe to run twice.

begin;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  title_ar text check (title_ar is null or char_length(title_ar) <= 120),
  description text check (description is null or char_length(description) <= 1000),
  description_ar text check (description_ar is null or char_length(description_ar) <= 1000),
  -- [{ "text": "...", "text_ar": "..." }, ...]
  deliverables jsonb not null default '[]'::jsonb check (jsonb_typeof(deliverables) = 'array'),
  -- Optional starting price. NULL shows "Contact for a quote".
  price_from numeric(12, 2) check (price_from is null or price_from >= 0),
  currency text not null default 'EGP' check (currency in ('EGP', 'USD')),
  price_note text check (price_note is null or char_length(price_note) <= 120),
  price_note_ar text check (price_note_ar is null or char_length(price_note_ar) <= 120),
  icon text not null default 'Briefcase' check (char_length(icon) <= 40),
  order_index integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 300),
  question_ar text check (question_ar is null or char_length(question_ar) <= 300),
  answer text not null check (char_length(answer) between 1 and 3000),
  answer_ar text check (answer_ar is null or char_length(answer_ar) <= 3000),
  order_index integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_published_order_idx on public.services (published, order_index);
create index if not exists faqs_published_order_idx on public.faqs (published, order_index);

drop trigger if exists update_services_updated_at on public.services;
create trigger update_services_updated_at
  before update on public.services
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_faqs_updated_at on public.faqs;
create trigger update_faqs_updated_at
  before update on public.faqs
  for each row execute function public.update_updated_at_column();

-- Grants: the same shape as the other content tables.
revoke all on table public.services, public.faqs from anon, authenticated;
grant select on table public.services, public.faqs to anon;
grant select, insert, update, delete on table public.services, public.faqs to authenticated;

-- Row-level security.
alter table public.services enable row level security;
alter table public.faqs enable row level security;

drop policy if exists "Public can view published services" on public.services;
create policy "Public can view published services" on public.services
  for select to anon, authenticated using (published = true);
drop policy if exists "Admins can view all services" on public.services;
create policy "Admins can view all services" on public.services
  for select to authenticated using (public.is_admin());
drop policy if exists "Admins can insert services" on public.services;
create policy "Admins can insert services" on public.services
  for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins can update services" on public.services;
create policy "Admins can update services" on public.services
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can delete services" on public.services;
create policy "Admins can delete services" on public.services
  for delete to authenticated using (public.is_admin());

drop policy if exists "Public can view published faqs" on public.faqs;
create policy "Public can view published faqs" on public.faqs
  for select to anon, authenticated using (published = true);
drop policy if exists "Admins can view all faqs" on public.faqs;
create policy "Admins can view all faqs" on public.faqs
  for select to authenticated using (public.is_admin());
drop policy if exists "Admins can insert faqs" on public.faqs;
create policy "Admins can insert faqs" on public.faqs
  for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins can update faqs" on public.faqs;
create policy "Admins can update faqs" on public.faqs
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can delete faqs" on public.faqs;
create policy "Admins can delete faqs" on public.faqs
  for delete to authenticated using (public.is_admin());

comment on table public.services is 'Services offered, bilingual (*_ar = Arabic). Only published rows are public.';
comment on column public.services.deliverables is 'Array of {text, text_ar}.';
comment on column public.services.price_from is 'Optional starting price in currency; NULL shows "Contact for a quote".';
comment on table public.faqs is 'FAQ shown on the Services page, bilingual (*_ar = Arabic). Only published rows are public.';
comment on column public.projects.testimonials is
  'Array of {id, name, name_ar, role, role_ar, company, company_ar, content, content_ar, avatar, featured}. *_ar keys are optional; featured=true shows it on the homepage.';

commit;

-- Check after applying:
-- select tablename, policyname, cmd, roles from pg_policies
--  where schemaname = 'public' and tablename in ('services', 'faqs') order by 1, 3;  -- expects 10 rows
-- select table_name, grantee, string_agg(privilege_type, ',' order by privilege_type)
--   from information_schema.role_table_grants
--  where table_schema = 'public' and table_name in ('services', 'faqs') and grantee in ('anon', 'authenticated')
--  group by 1, 2;  -- anon SELECT; authenticated DELETE,INSERT,SELECT,UPDATE
--
-- Rollback (only if needed; deletes all services and FAQ entries):
-- drop table if exists public.services; drop table if exists public.faqs;
