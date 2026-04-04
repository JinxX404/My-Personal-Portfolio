# CONTEXT.md — Moataz's Portfolio

> **Self-contained reference document for AI agents.** Reading this file should provide enough context to understand the architecture, data flow, styling, routing, and potential issues of the project so that meaningful changes can be made without re-exploring the codebase.

---

## 1. Project Overview

**Moataz's Portfolio** is a personal full-stack portfolio website built with React 18, Vite, Tailwind CSS, and Supabase. It serves two audiences:

| Audience | Purpose |
|---|---|
| **Visitors** | Browse projects, read case studies, view skills, contact the developer |
| **Admin (owner)** | CRUD-manage projects, skills, site settings, SEO, and profile info via a protected dashboard |

The platform features a content management system (CMS) backed by Supabase (PostgreSQL + Auth + Storage), real-time-ish data flow via React Context API, a dark/light theme system, animated sections with Framer Motion, and full responsiveness.

**Target audience:** Recruiters, potential clients, collaborators, and the general public exploring the developer's work.

---

## 2. Architecture & Directory Structure

### Full `src/` Tree

```
src/
├── App.jsx                          # Root component — wraps providers + Routes
├── index.jsx                        # Entry point — mounts ThemeProvider + App
├── Routes.jsx                       # All route definitions, lazy-loaded pages
│
├── components/                      # Shared top-level components
│   ├── AdminLayout.jsx              # Layout wrapper for admin pages (sidebar + content)
│   ├── AppIcon.jsx                  # Lucide icon proxy — maps name → Lucide component
│   ├── AppImage.jsx                 # Image wrapper with fallback on error
│   ├── ErrorBoundary.jsx            # Class-based React error boundary
│   ├── Footer.jsx                   # Site footer — profile, links, socials
│   ├── Layout.jsx                   # Public layout — Header + children + Footer
│   ├── RequireAuth.jsx              # Auth guard — redirects to /login if unauthenticated
│   ├── ScrollToTop.jsx              # Scrolls to top on route change
│   ├── Toast.jsx                    # Toast notification UI (renders ToastContext state)
│   └── ui/
│       ├── Header.jsx               # Site header — nav, theme toggle, mobile menu
│       └── Skeleton.jsx             # Skeleton loading presets (card, text, avatar, etc.)
│
├── context/                         # React Context providers (state management)
│   ├── AuthContext.jsx              # Supabase auth — session, sign-in, sign-out
│   ├── PortfolioSettingsContext.jsx # Site settings — profile, social, SEO, branding
│   ├── ProjectsContext.jsx          # Projects CRUD wrapper around projectsService
│   ├── SkillsContext.jsx            # Skills/tech stack CRUD with localStorage fallback
│   ├── ThemeContext.jsx             # Dark/light mode with system preference detection
│   └── ToastContext.jsx             # Toast notification queue (success/error/warning/info)
│
├── debug/
│   └── supabaseTest.js              # Debug utility — tests Supabase connection & RLS
│
├── hooks/
│   └── useDebounce.js               # Generic debounce hook for search inputs
│
├── lib/
│   ├── logger.js                    # Dev-only logger (stripped in production)
│   ├── supabase.js                  # Supabase client + helper utilities
│   └── validation.js                # Zod schemas for projects, contacts, auth, settings
│
├── pages/
│   ├── DebugPage.jsx                # Debug UI — runs supabaseTest.js
│   ├── DebugSupabase.jsx            # Supabase diagnostic page
│   ├── NotFound.jsx                 # 404 fallback page
│   │
│   ├── about-story/
│   │   └── index.jsx                # About me — bio, timeline, skills, values
│   │
│   ├── admin-dashboard/
│   │   ├── index.jsx                # Admin overview — metrics, quick actions, charts
│   │   └── components/
│   │       ├── ContentCalendar.jsx
│   │       ├── MetricCard.jsx       # Dashboard metric display card
│   │       ├── PerformanceCharts.jsx # Recharts bar/pie charts
│   │       ├── ProjectsManager.jsx  # Projects list CRUD in admin
│   │       ├── QuickActions.jsx     # Quick action buttons
│   │       ├── RecentActivity.jsx   # Activity feed
│   │       ├── SettingsManager.jsx  # Settings orchestrator (4 tabs)
│   │       ├── Sidebar.jsx          # Admin sidebar navigation
│   │       ├── SkillsManager.jsx    # Skills CRUD with modals
│   │       └── settings-tabs/
│   │           ├── ProfileSettingsTab.jsx
│   │           ├── SEOSettingsTab.jsx
│   │           ├── SiteSettingsTab.jsx
│   │           ├── SocialLinksTabDynamic.jsx
│   │           └── SocialLinksTab.jsx (if exists)
│   │
│   ├── case-study-detail/
│   │   └── index.jsx                # Individual project deep-dive
│   │
│   ├── contact-hub/
│   │   ├── index.jsx                # Contact hub — inquiry types, form, FAQ
│   │   └── components/
│   │       ├── ContactForm.jsx      # Multi-purpose contact form
│   │       ├── ContactInfo.jsx      # Contact details display
│   │       ├── FAQ.jsx              # FAQ accordion
│   │       └── SocialLinks.jsx      # Social links display
│   │
│   ├── homepage/
│   │   ├── index.jsx                # Homepage — hero, skills, CTA
│   │   └── components/
│   │       ├── FeaturedWork.jsx     # (Currently commented out)
│   │       ├── FloatingCTA.jsx      # Sticky CTA button
│   │       ├── HeroSection.jsx      # Hero with animated code snippets
│   │       ├── SkillsVisualization.jsx
│   │       └── SocialProof.jsx      # (Currently commented out)
│   │
│   ├── login/
│   │   └── index.jsx                # Supabase email/password login
│   │
│   ├── portfolio-gallery/
│   │   └── index.jsx                # Project listing with filtering/search
│   │
│   └── project-manager/
│       ├── index.jsx                # Project creation/edit form (5 sections)
│       └── components/
│           ├── BasicInformation.jsx
│           ├── CaseStudyContent.jsx
│           ├── PublishingOptions.jsx
│           ├── TechnicalDetails.jsx
│           └── VisualAssets.jsx
│
├── services/
│   ├── projectsService.js           # All CRUD for projects table
│   └── skillsService.js             # All CRUD for skill_categories, skills, tech_stack
│
└── styles/
    ├── index.css                    # Base resets
    └── tailwind.css                 # Tailwind imports, CSS variables, dark mode, components
```

### Directory Roles

| Directory | Role |
|---|---|
| `components/` | Shared UI primitives and layout components used across pages |
| `components/ui/` | Reusable UI elements (Header, Skeleton presets) |
| `context/` | Global state via Context API — auth, settings, projects, skills, theme, toasts |
| `hooks/` | Custom React hooks (`useDebounce`) |
| `lib/` | Infrastructure utilities (Supabase client, Zod validation, logger) |
| `services/` | Data access layer — Supabase queries wrapped in functions |
| `pages/` | Route-level page components, each with optional sub-components |
| `styles/` | Global CSS — Tailwind imports, CSS custom properties, component classes |
| `debug/` | Diagnostic utilities (should be removed in production) |

### Component Hierarchy

```
ThemeProvider (index.jsx)
  └── App (App.jsx)
        ├── AuthProvider
        │     └── ToastProvider
        │           └── PortfolioSettingsProvider
        │                 └── SkillsProvider
        │                       └── ProjectsProvider
        │                             ├── Routes
        │                             │     └── BrowserRouter
        │                             │           └── ErrorBoundary
        │                             │                 └── ScrollToTop
        │                             │                 └── Layout
        │                             │                       └── Suspense
        │                             │                             └── RouterRoutes
        │                             └── Toast (notification renderer)
```

**Key nesting order rationale:**
1. `AuthProvider` first — auth state is needed by all downstream providers
2. `ToastProvider` before data providers — so services can show toasts
3. `PortfolioSettingsProvider` loads site config (used by Header/Footer/Hero)
4. `SkillsProvider` / `ProjectsProvider` load content data
5. `Toast` sits at root level so it's always rendered regardless of route

---

## 3. Technology Stack

### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | 18.2.0 | UI library |
| `react-dom` | 18.2.0 | DOM rendering |
| `react-router-dom` | 6.0.2 | Client-side routing |
| `react-router-hash-link` | 2.4.3 | Hash-based scroll navigation |
| `react-helmet` | 6.1.0 | SEO meta tags management |
| `react-hook-form` | 7.55.0 | Form state & validation |
| `@supabase/supabase-js` | 2.75.0 | Supabase client (DB + Auth + Storage) |
| `framer-motion` | 10.16.4 | Animation library |
| `lucide-react` | 0.484.0 | Icon library (1000+ icons) |
| `recharts` | 2.15.2 | Data visualization (charts) |
| `zod` | 4.3.5 | Schema validation |
| `axios` | 1.8.4 | HTTP client |
| `date-fns` | 4.1.0 | Date formatting utilities |
| `tailwindcss` | 3.4.6 | Utility-first CSS framework |
| `@tailwindcss/forms` | 0.5.7 | Form reset styles |
| `@tailwindcss/typography` | 0.5.16 | Prose classes |
| `@tailwindcss/aspect-ratio` | 0.4.2 | Aspect ratio utilities |
| `@tailwindcss/container-queries` | 0.1.1 | Container queries plugin |
| `@tailwindcss/line-clamp` | 0.1.0 | Line clamp utilities |
| `tailwindcss-animate` | 1.0.7 | Animation utilities |
| `tailwindcss-elevation` | 2.0.0 | Elevation/shadow utilities |
| `tailwindcss-fluid-type` | 2.0.7 | Fluid typography scaling |
| `dotenv` | 16.0.1 | Environment variable loading |
| `@dhiwise/component-tagger` | 1.0.9 | Dev tool for component identification |
| `@testing-library/react` | 11.2.7 | Component testing |
| `@testing-library/jest-dom` | 5.15.1 | Jest DOM matchers |
| `@testing-library/user-event` | 12.8.3 | User event simulation |

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `vite` | 5.0.0 | Build tool + dev server |
| `@vitejs/plugin-react` | 4.3.4 | React Fast Refresh |
| `vite-tsconfig-paths` | 3.6.0 | Path alias resolution (`components/` → `src/components/`) |
| `tailwindcss` | 3.4.6 | Core Tailwind |
| `postcss` | 8.4.8 | CSS processing |
| `autoprefixer` | 10.4.2 | Vendor prefixing |
| `@playwright/test` | 1.56.0 | E2E test runner |
| `playwright` | 1.56.0 | Browser automation |

### Build Tooling

- **Vite** — Dev server on port `4028`, `strictPort: true`, host `0.0.0.0`
- **Chunk size warning limit:** 2000 KB (unusually high — indicates large bundles)
- **Plugins:** `tsconfigPaths`, `react`, `tagger`
- **Sourcemaps** enabled in build (`--sourcemap` flag)

### Testing Setup

- **Playwright** is configured via scripts but no test files or `playwright.config` exist in the repo
- Available scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:debug`
- Tests would target `blogs-manager`, `blog-detail` routes that don't exist in the current codebase
- **Conclusion:** Testing infrastructure is scaffolding-only; no actual tests exist

### Deployment

- **`public/_redirects`** contains `/* /index.html 200` — SPA fallback for Netlify/Vercel
- **No `netlify.toml` file** exists in the repo
- Deployment target appears to be Netlify (based on `_redirects` file)

---

## 4. Routing & Navigation Flow

### Route Table

| Path | Component | Layout | Protected? | Notes |
|---|---|---|---|---|
| `/` | `Homepage` | `Layout` (Header + Footer) | No | Alias to `/homepage` |
| `/homepage` | `Homepage` | `Layout` | No | Primary landing page |
| `/portfolio-gallery` | `PortfolioGallery` | `Layout` | No | Filterable project listing |
| `/case-study-detail/:id` | `CaseStudyDetail` | `Layout` | No | Deep-dive into single project |
| `/about-story` | `AboutStory` | `Layout` | No | Bio, timeline, skills |
| `/contact-hub` | `ContactHub` | `Layout` | No | Multi-purpose contact forms |
| `/login` | `Login` | `Layout` (hidden) | No | Supabase email/password auth |
| `/admin-dashboard` | `AdminDashboard` | `AdminLayout` | **Yes** | Admin overview |
| `/project-manager` | `ProjectManager` | None (self-contained) | **Yes** | Create/edit projects |
| `/skills-manager` | `SkillsManager` | `AdminLayout` | **Yes** | Skills CRUD |
| `/projects-manager` | `ProjectsManager` | `AdminLayout` | **Yes** | Projects list CRUD |
| `/settings-manager` | `SettingsManager` | `AdminLayout` | **Yes** | Site configuration |
| `/debug-supabase` | `DebugSupabase` | `Layout` | No | Diagnostic page |
| `/debug` (if routed) | `DebugPage` | `Layout` | No | Debug utility |
| `*` | `NotFound` | None (self-contained) | No | 404 catch-all |

> **Note:** `DebugPage` and `DebugSupabase` are NOT defined in `Routes.jsx` — they are orphaned page components.

### Layout System

**`Layout.jsx`** wraps all routes. It conditionally hides `Header` and `Footer` on admin/debug paths:
```js
const hideLayoutRoutes = ['/admin-dashboard', '/blog-editor', '/project-manager',
  '/skills-manager', '/projects-manager', '/blogs-manager', '/settings-manager'];
```
When the path starts with any of these, no Header/Footer is rendered.

**`AdminLayout.jsx`** provides:
- Responsive `Sidebar` component (collapsible on mobile)
- Mobile hamburger toggle with overlay
- `lg:ml-64` content offset for desktop sidebar
- White background with shadow-sm border

### Auth Guard (`RequireAuth.jsx`)

1. Shows loading spinner while `AuthContext.loading` is true
2. If Supabase is NOT configured (`!isConfigured`), renders children with a warning banner (dev mode)
3. If user is not authenticated, redirects to `/login` with `state.from` preserved
4. After login, user is redirected back to the original protected route

### `ScrollToTop.jsx`

Listens to `pathname` changes via `useLocation()` and calls `window.scrollTo(0, 0)` on every navigation. Simple and effective.

### `ErrorBoundary.jsx`

Class-based React error boundary wrapping the entire `Routes`. On error:
- Renders a centered "Something went wrong" message with a sad-face SVG
- Provides a "Back" button that navigates to `/`
- Logs error via `window.__COMPONENT_ERROR__?.(error, errorInfo)` hook

---

## 5. State Management (Context API)

### Context Provider Nesting in `App.jsx`

```
AuthProvider → ToastProvider → PortfolioSettingsProvider → SkillsProvider → ProjectsProvider → Routes + Toast
```

Plus `ThemeProvider` wrapping everything from `index.jsx`.

### `AuthContext.jsx`

| Aspect | Details |
|---|---|
| **State** | `user`, `session`, `loading`, `isConfigured`, `isAuthenticated` |
| **Init** | Calls `supabase.auth.getSession()` on mount |
| **Subscription** | `supabase.auth.onAuthStateChange()` — updates on login/logout |
| **Methods** | `signIn(email, password)`, `signOut()`, `signUp(email, password)` |
| **Session** | Persistent (`persistSession: true`, `autoRefreshToken: true` in Supabase config) |
| **Cleanup** | Unsubscribes auth listener on unmount |

### `ToastContext.jsx`

| Aspect | Details |
|---|---|
| **State** | `toasts` array — `{ id, message, type, bg }` |
| **Types** | `success` (5s), `error` (7s), `warning` (6s), `info` (5s) |
| **Methods** | `addToast(msg, type, duration)`, `removeToast(id)`, convenience: `success()`, `error()`, `warning()`, `info()` |
| **Auto-dismiss** | `setTimeout` per toast (no cleanup on unmount — potential minor leak) |

### `PortfolioSettingsContext.jsx`

| Aspect | Details |
|---|---|
| **State** | `settings` object with 4 sub-objects: `profile`, `social_links`, `site_settings`, `seo_settings` |
| **Default** | Full default object hardcoded (fallback when DB is empty) |
| **Load** | `supabase.from('portfolio_settings').select('*').limit(1)` |
| **Update** | Upsert pattern — checks for existing record, then `UPDATE` or `INSERT` |
| **Convenience getters** | `profile`, `socialLinks`, `siteSettings`, `seoSettings` |
| **No real-time** | Settings are loaded once on mount; no subscription |

### `SkillsContext.jsx`

| Aspect | Details |
|---|---|
| **State** | `skillCategories` (object keyed by category key), `techStack` (array) |
| **Fallback** | localStorage persistence — saves on every change, loads from localStorage if no Supabase |
| **CRUD** | `addCategory`, `updateCategory`, `deleteCategory`, `addSkill`, `updateSkill`, `deleteSkill`, `addTech`, `updateTech`, `deleteTech` |
| **Utilities** | `resetToDefaults()`, `resyncFromDatabase()` |
| **Supabase tables** | `skill_categories`, `skills`, `tech_stack` |

### `ProjectsContext.jsx`

| Aspect | Details |
|---|---|
| **State** | `projects` (array), `loading`, `error` |
| **Load** | `loadProjects(filters)` — calls `fetchProjects()` from service |
| **CRUD** | `addProject`, `editProject`, `removeProject`, `togglePublish`, `toggleFeatured`, `getStats` |
| **Helpers** | `getPublishedProjects()`, `getFeaturedProjects()`, `getProjectById(id)` |
| **No localStorage fallback** | Projects are Supabase-only |

### `ThemeContext.jsx`

| Aspect | Details |
|---|---|
| **Storage key** | `portfolio-theme-preference` (localStorage) |
| **Init** | localStorage → system preference (`prefers-color-scheme`) → `'light'` |
| **Apply** | Adds/removes `dark` class on `<html>` element |
| **System listener** | Listens to `prefers-color-scheme` changes (only if no explicit user preference stored) |
| **Value** | `{ theme, isDark, setTheme, toggleTheme }` |

### Why Nesting Order Matters

- `ThemeProvider` is outermost (in `index.jsx`) because it affects the entire DOM (including `Layout`)
- `AuthProvider` must wrap `RequireAuth` which guards admin routes
- `ToastProvider` wraps data providers so service-layer operations can show toasts
- `PortfolioSettingsProvider` before data providers because Header/Footer consume settings
- `SkillsProvider` / `ProjectsProvider` can be in any order — they're independent

---

## 6. Data Layer & Supabase Integration

### Client Initialization (`src/lib/supabase.js`)

```js
createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
  db: { schema: 'public' },
  global: { headers: { 'x-application-name': 'portfolio-pro' } }
});
```

**Helpers exported:**
- `isSupabaseConfigured()` — checks URL/key exist and aren't dummy values
- `handleSupabaseError(error, context)` — logs and formats error
- `formatSupabaseResponse(data, error)` — wraps response in `{ success, data, error }`

### Inferred Database Schema

Based on service calls and validation schemas:

#### `projects` table
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `title` | text | Required |
| `description` | text | Required |
| `category` | text | Required |
| `client` | text | Nullable |
| `technologies` | text[] | Array of tech names |
| `tags` | text[] | Array of tags |
| `demo_url` | text | Nullable URL |
| `repository_url` | text | Nullable URL |
| `status` | text | `draft` / `in-progress` / `completed` / `archived` |
| `publishing_status` | text | `draft` / `published` / `archived` |
| `featured` | boolean | Default false |
| `visibility` | text | `public` / `private` / `password` |
| `hero_images` | text[] / jsonb | Array of image URLs |
| `screenshots` | jsonb | Gallery images |
| `mockups` | jsonb | Mockup images |
| `problem` | text | Case study problem statement |
| `solution` | text | Case study solution |
| `results` | text | Case study results |
| `testimonials` | jsonb | Array of testimonial objects |
| `meta_title` | text | SEO |
| `meta_description` | text | SEO |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto |
| `published_at` | timestamptz | Nullable |

#### `skill_categories` table
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `key` | text | Unique slug (e.g., `frontend`) |
| `title` | text | Display name |
| `icon` | text | Lucide icon name |
| `color` | text | Tailwind color name |
| `order_index` | integer | Sort order |

#### `skills` table
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `category_id` | uuid | FK → skill_categories |
| `name` | text | Skill name |
| `level` | integer | 0–100 proficiency |
| `icon` | text | Lucide icon name |
| `order_index` | integer | Sort order |

#### `tech_stack` table
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | text | Technology name |
| `order_index` | integer | Sort order |

#### `portfolio_settings` table
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key (single row) |
| `profile` | jsonb | `{ full_name, title, tagline, bio, avatar, resume_url, cv_url, email, phone, location, availability }` |
| `social_links` | jsonb | `{ github, linkedin, twitter, ... }` |
| `site_settings` | jsonb | `{ site_title, site_description, site_keywords, logo_url, favicon_url, primary_color, ... }` |
| `seo_settings` | jsonb | `{ meta_title, meta_description, og_image, twitter_handle, google_analytics_id, ... }` |
| `updated_at` | timestamptz | Auto |

#### `blogs` table (referenced in debug code but NOT in current routes)
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `title` | text | |
| `slug` | text | Unique |
| `content` | text | |
| `excerpt` | text | |
| `status` | text | `draft` / `published` / `archived` |
| `featured` | boolean | |
| (and more per blogSchema in validation.js) | | |

### Row Level Security (RLS)

Inferred from service patterns:
- **`projects`**: SELECT allowed for public (published projects). INSERT/UPDATE/DELETE requires authentication
- **`skill_categories`**, **`skills`**, **`tech_stack`**: SELECT likely public. Mutations require auth
- **`portfolio_settings`**: SELECT public. UPDATE requires auth
- **`blogs`**: Similar pattern (but blog feature is not currently active in routes)

> **Actual RLS policies** must be checked in the Supabase dashboard — they're not version-controlled in this repo.

### Storage Bucket Usage

Inferred from settings and project forms:
- Images (hero images, screenshots, mockups) stored via URLs (could be Supabase Storage or external)
- Avatar upload for profile
- CV/resume file upload
- OG image for SEO
- Favicon upload

> **No explicit Supabase Storage client code** found — uploads appear to be URL-based (external hosting or manual URL entry).

### Real-Time Subscription

- **Auth:** `supabase.auth.onAuthStateChange()` — active, properly cleaned up
- **Projects/Skills/Settings:** **NO real-time subscriptions.** Data is fetched on mount and context updates only occur via CRUD operations
- The `SkillsContext` and `ProjectsContext` do NOT subscribe to Supabase Realtime channels

---

## 7. Page-by-Page Breakdown

### `homepage` (`src/pages/homepage/index.jsx`)

- **Purpose:** Landing page — first impression, showcases skills, drives to portfolio or contact
- **Key components:** `HeroSection` (animated code snippets), `SkillsVisualization`, `FloatingCTA`
- **Data:** Reads `profile` from `PortfolioSettingsContext` for hero text/availability
- **Interactions:** Scroll progress bar at top, rotating code snippets every 6 seconds, CTA buttons to portfolio/contact
- **Note:** `FeaturedWork` and `SocialProof` sections are commented out

### `portfolio-gallery` (`src/pages/portfolio-gallery/index.jsx`)

- **Purpose:** Browse all published projects with filtering and search
- **Key features:** Category filters, tech filters, search by title/description/tech, grid/list view toggle, project preview modal
- **Data:** Fetches ALL projects from Supabase (not just published), transforms client-side
- **Interactions:** Hover reveals action buttons (view, live demo, GitHub), click opens modal with details
- **Loading:** Skeleton cards while fetching, empty state with "View All Projects" CTA

### `case-study-detail` (`src/pages/case-study-detail/index.jsx`)

- **Purpose:** Deep-dive into a single project
- **Key features:** Sticky navigation sidebar, hero image, project metadata, description, tech tags, gallery, code snippets, testimonial, related projects
- **Data:** Fetches project by ID from `ProjectsContext`, transforms to case study format
- **Interactions:** Section scroll-spy, expandable code snippets, image lightbox modal
- **Fallback:** Redirects to gallery if project not found

### `about-story` (`src/pages/about-story/index.jsx`)

- **Purpose:** Personal bio, professional journey, skills, values, interests
- **Key features:** Profile image, biography, philosophy, values grid, expandable timeline, skill bars with animations, personal interests
- **Data:** **ALL HARDCODED** — no context or Supabase data used
- **Interactions:** Intersection Observer for scroll animations, expandable timeline items
- **Note:** Most timeline items are commented out; only education entry exists

### `contact-hub` (`src/pages/contact-hub/index.jsx`)

- **Purpose:** Multi-purpose contact interface
- **Key components:** `ContactForm`, `ContactInfo`, `FAQ`, `SocialLinks`
- **Data:** Inquiry type selector (project, collaboration, speaking, general) dynamically changes form fields
- **Interactions:** Form validation, simulated submission (no actual backend), success state with auto-reset
- **Note:** Contact form does NOT send data anywhere — it's a simulated submission

### `login` (`src/pages/login/index.jsx`)

- **Purpose:** Admin authentication via Supabase email/password
- **Key features:** Email + password fields, show/hide password toggle, Zod validation
- **Data:** Uses `AuthContext.signIn()`
- **Interactions:** On success, redirects to original protected route or `/admin-dashboard`

### `admin-dashboard` (`src/pages/admin-dashboard/index.jsx`)

- **Purpose:** Admin overview — metrics, quick actions, recent activity, charts
- **Key components:** `MetricCard`, `QuickActions`, `RecentActivity`, `PerformanceCharts`
- **Data:** Project stats from `ProjectsContext`, timeframe selector (24h/7d/30d/90d)
- **Charts:** Recharts composition chart (published vs drafts)
- **Note:** Blog-related metrics removed; "Pending Comments" stat is hardcoded

### `project-manager` (`src/pages/project-manager/index.jsx`)

- **Purpose:** Create/edit projects with rich multi-section form
- **Sections:** Basic Information, Visual Assets, Technical Details, Case Study Content, Publishing Options
- **Validation:** Minimal — only title, description, and category required
- **Auto-save:** Every 30 seconds if title is filled
- **Data:** `addProject()` from `ProjectsContext`
- **Features:** Completion percentage bar, save status indicators, draft vs publish flow

### `skills-manager` (Admin sub-page)

- **Purpose:** CRUD for skill categories, individual skills, and tech stack
- **Features:** Tabs for Categories/Tech Stack, modal dialogs for add/edit, level slider (0-100), icon/color pickers
- **Data:** `SkillsContext` (Supabase + localStorage fallback)
- **Actions:** "Resync from DB" and "Reset to Defaults" buttons

### `projects-manager` (Admin sub-page)

- **Purpose:** List view of all projects with quick actions
- **Features:** Search, filter by status (all/published/draft), toggle publish, toggle featured, edit link, delete with confirmation
- **Data:** `ProjectsContext`

### `settings-manager` (Admin sub-page)

- **Purpose:** Centralized site configuration
- **Tabs:** Profile Info, Social Links, Site Settings, SEO & Analytics
- **Features:** Individual tab components, save all at once, reset to last saved
- **Data:** `PortfolioSettingsContext`

### `NotFound` (404)

- Animated 404 with bounce effect
- Navigation options: Home, Portfolio, About, Blog (broken link), Contact

### `DebugPage.jsx` / `DebugSupabase.jsx`

- **Debug utilities** — test Supabase connection, table access, RLS policies
- **Should be removed** from production builds
- Not routed in `Routes.jsx` — orphaned pages

---

## 8. Component Library

### Core Components

| Component | File | Purpose |
|---|---|---|
| `AppIcon` | `components/AppIcon.jsx` | Lucide icon proxy. Accepts `name`, `size`, `color`, `className`, `strokeWidth`. Falls back to `HelpCircle` for missing icons. Uses dynamic import from `lucide-react` |
| `AppImage` | `components/AppImage.jsx` | Simple `<img>` wrapper with `onError` fallback to `/assets/images/no_image.png` |
| `Header` | `components/ui/Header.jsx` | Fixed header with logo, nav links, theme toggle, mobile menu. Throttled scroll handler for transparency effect. Mobile menu with overlay |
| `Footer` | `components/Footer.jsx` | 3-column footer: about/branding, quick links, social icons. Platform detection from URLs for icon mapping |
| `Layout` | `components/Layout.jsx` | Wraps routes with Header/Footer. Conditionally hides on admin paths |
| `AdminLayout` | `components/AdminLayout.jsx` | Sidebar + content wrapper. Mobile-responsive sidebar toggle |
| `RequireAuth` | `components/RequireAuth.jsx` | Auth guard. Shows loading → dev warning if no Supabase → redirect to `/login` |
| `ScrollToTop` | `components/ScrollToTop.jsx` | `useEffect` on `pathname` change → `window.scrollTo(0, 0)` |
| `ErrorBoundary` | `components/ErrorBoundary.jsx` | Class component `componentDidCatch` → friendly error UI |
| `Toast` | `components/Toast.jsx` | Fixed bottom-right toast stack with Framer Motion `AnimatePresence` |

### UI Components

| Component | File | Purpose |
|---|---|---|
| `Skeleton` | `components/ui/Skeleton.jsx` | Base skeleton with `width`, `height`, `rounded` props. Named presets: `SkeletonText`, `SkeletonAvatar`, `SkeletonImage`, `SkeletonCard`, `SkeletonProjectCard`, `SkeletonMetricCard`, `SkeletonListItem` |

---

## 9. Styling System

### Tailwind Configuration (`tailwind.config.js`)

**Dark mode:** `class` strategy — adds `.dark` class to `<html>`

**Custom color system:** ALL colors use CSS custom properties (CSS variables) via `withOpacity()` helper, enabling runtime color changes.

Color tokens defined:
- `background`, `surface`, `overlay`, `border`, `border-strong`
- `primary` (50–900 scale)
- `secondary` (50–800 scale)
- `text-primary`, `text-secondary`, `muted`
- `accent` (50–900 scale + hover)
- `success`, `warning`, `error` (50–800 scales)
- `cta` (50–800 scale)

**Custom fonts:**
- Sans: `Inter, system-ui, sans-serif`
- Mono: `JetBrains Mono, monospace`

**Custom spacing:** `18`, `88`, `128`

**Custom shadows:** `sm`, `DEFAULT`, `md`, `lg`, `xl`, `2xl`, `elevation`, `inner`

**Custom animations:** `fade-in`, `slide-up`, `slide-down`, `scale-in`, `pulse-soft`, `bounce-soft`

**Custom easing:** `out-expo`, `out-quart`, `in-out-back`

**Plugins:** `@tailwindcss/typography`, `@tailwindcss/forms`, `@tailwindcss/aspect-ratio`

### CSS Variables (`src/styles/tailwind.css`)

Two complete theme definitions:
- **`:root`** — Light mode colors (RGB triplets, e.g., `248 250 252`)
- **`.dark`** — Dark mode colors (inverted palette)

### Component Classes (`@layer components`)

- `.btn-primary` — Accent background, hover lift, focus ring
- `.btn-secondary` — Transparent with border, hover background
- `.card` — White bg, rounded, shadow, border, hover lift
- `.glass-panel` — Glassmorphism (blur + semi-transparent bg)
- `.text-gradient` — Gradient text via `bg-clip-text`

### Utility Classes

- `.transition-theme` — Smooth color transition (0.3s) for theme switching
- `.backdrop-blur-glass` — 14px backdrop blur
- `.animation-delay-200/400/600` — Staggered animation delays

### Animation System (Framer Motion)

Usage patterns across the app:
- Page entrance: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Staggered children: `containerVariants` with `staggerChildren: 0.1`
- Scroll-triggered: `whileInView` + `viewport={{ once: true }}`
- Modal/overlay: `AnimatePresence` with scale + opacity transitions
- Toast: slide-in from right with exit animation

### Responsive Design

- Mobile-first breakpoints: standard Tailwind (`sm:640`, `md:768`, `lg:1024`, `xl:1280`)
- Mobile menu in Header with hamburger toggle
- Admin sidebar: hidden on mobile, fixed overlay toggle
- Grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern common

---

## 10. Form Handling & Validation

### React Hook Form

**Status:** Imported in `package.json` but **NOT actually used** in any page component. All forms use manual `useState` + `onChange` handlers.

**Forms that could use it but don't:**
- `ContactForm.jsx` — manual state, manual validation
- `ProjectManager` sub-components — manual `formData` state
- `Login.jsx` — manual state
- Settings tabs — manual state

### Zod Validation (`src/lib/validation.js`)

| Schema | Used For |
|---|---|
| `projectSchema` / `projectCreateSchema` / `projectUpdateSchema` | Project creation/edit validation in `projectsService.js` |
| `contactFormSchema` | Contact form (NOT currently applied — ContactForm uses manual validation) |
| `loginSchema` | Login page validation |
| `signUpSchema` | Not currently used (no sign-up page) |
| `skillSchema` / `skillCategorySchema` | Skills (defined but NOT applied — SkillsManager has no validation) |
| `profileSettingsSchema` | Profile settings (defined but NOT applied) |
| `blogSchema` / `blogCreateSchema` / `blogUpdateSchema` | Blogs (feature not active) |

**Validation helper:** `validate(schema, data)` → `{ success: boolean, data?: object, errors?: object }`

### Form Submission Patterns

| Form | Submission | Backend |
|---|---|---|
| Login | `signIn()` → Supabase Auth | Supabase Auth |
| Contact | Simulated (2s delay) → success state | **No backend** |
| Project create/edit | `addProject()` → Supabase INSERT | Supabase `projects` table |
| Settings save | `updateSettings()` → Supabase upsert | Supabase `portfolio_settings` table |
| Skills CRUD | Supabase mutations + localStorage fallback | Supabase + localStorage |

---

## 11. SEO & Meta Tags

### React Helmet

**Status:** `react-helmet` is installed but **NOT actively used** in any page component. No `<Helmet>` imports found in the codebase.

### Meta Tag System (Potential)

The `PortfolioSettingsContext.seo_settings` stores:
- `meta_title`
- `meta_description`
- `og_image`
- `twitter_handle`
- `google_analytics_id`
- `google_site_verification`

**But these values are never rendered as actual `<meta>` tags.** The SEO settings exist only as data in the database.

### HTML Meta Tags (Static)

Static meta tags would be in `public/index.html` (not read in this analysis). The `_redirects` file exists for SPA routing.

### Gap

> **SEO settings from the admin dashboard do NOT propagate to actual meta tags.** The infrastructure (data storage) exists but the rendering (`<Helmet>` components) is missing.

---

## 12. Data Visualization

### Recharts Usage

**Location:** `src/pages/admin-dashboard/components/PerformanceCharts.jsx`

| Chart | Type | Data Source | Status |
|---|---|---|---|
| Top Posts | Bar chart (horizontal) | `data.topPosts` | **No data** — always shows "No view data" |
| Categories | Pie/donut chart | `data.categoryDist` | **No data** — always shows "No category data" |
| Composition | Bar chart | `data.composition` | **Active** — shows published vs draft counts |

### D3.js

**Status:** Listed in README but **NOT installed** in `package.json`. No D3 imports found in the codebase.

---

## 13. Hooks & Utilities

### `useDebounce.js`

```js
export const useDebounce = (value, delay) => { ... }
```
Standard debounce hook. **Not currently used anywhere in the codebase.** The search in `PortfolioGallery` uses direct `useState` without debouncing.

### `logger.js`

```js
logger.debug(...args)  // Only in DEV
logger.info(...args)   // Only in DEV
logger.warn(...args)   // Always
logger.error(...args)  // Always
```
Environment-aware logger. **Not actively used** — components use `console.log/error` directly.

### Other Utilities

- `isSupabaseConfigured()` — Used everywhere before Supabase calls
- `formatSupabaseResponse()` — Standardizes all service responses
- `handleSupabaseError()` — Error formatting (not widely used)

---

## 14. Testing Strategy

### Playwright

| Script | Command | Status |
|---|---|---|
| `test:e2e` | `playwright test` | No test files exist |
| `test:e2e:ui` | `playwright test --ui` | No test files exist |
| `test:e2e:headed` | `playwright test --headed` | No test files exist |
| `test:blogs` | `playwright test blogs-manager blog-detail` | Routes don't exist |
| `test:report` | `playwright show-report` | N/A |

### Coverage

- **No test files** exist (`.spec.js`, `.test.js`, or `playwright.config`)
- Blog-related test scripts reference non-existent routes
- **Action needed:** Either implement tests or remove test scripts from `package.json`

---

## 15. Build & Deployment

### Vite Configuration

```js
build: { chunkSizeWarningLimit: 2000 }
plugins: [tsconfigPaths(), react(), tagger()]
server: { port: 4028, host: "0.0.0.0", strictPort: true }
```

**Key details:**
- Dev server: `http://0.0.0.0:4028` (accessible from network)
- `strictPort: true` — fails if port 4028 is in use
- `tagger` plugin adds `data-component` attributes for debugging
- Chunk warning at 2000 KB (very high — suggests large bundles exist)

### Build Process

```bash
npm run build  # vite build --sourcemap
```
- Outputs to `dist/` (default Vite output)
- Sourcemaps generated
- No explicit `outDir` override

### Deployment

- **`public/_redirects`** — SPA routing rule for Netlify
- **No `netlify.toml`** — relies on Netlify auto-detection
- Build command: `npm run build`
- Publish directory: `dist/`

### Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |

Without these, the app runs in "dev mode" — auth is disabled, data providers skip Supabase calls, and localStorage fallback is used for skills.

---

## 16. Performance Analysis — Issues & Recommendations

### Bundle Size
- **Chunk warning at 2000 KB** — this is unusually high. Likely culprits: `framer-motion`, `recharts`, `lucide-react` (imports ALL icons dynamically), `@supabase/supabase-js`
- **Recommendation:** Use `chunkSizeWarningLimit: 500` after optimization. Audit with `vite-bundle-visualizer`

### Lazy Loading
- All pages are lazy-loaded via `React.lazy()` — good
- However, admin components (`SkillsManager`, `ProjectsManager`, etc.) are also lazy-loaded but nested under admin routes — acceptable
- **Gap:** No route-level prefetching. When a user hovers "Portfolio" link, the gallery chunk isn't preloaded

### Image Optimization
- `AppImage.jsx` has no lazy loading (`loading="lazy"`) or `srcset` support
- Hero images use external URLs (Unsplash, Reddit) — no local optimization
- No WebP/AVIF conversion pipeline
- **Recommendation:** Add `loading="lazy"` to `AppImage`, use `vite-plugin-image-optimizer` or serve through Supabase Storage with transformations

### Re-renders
- Context providers wrap the entire app — any state change in `PortfolioSettingsContext` triggers re-renders in ALL consumers (Header, Footer, Hero, etc.)
- `SkillsContext` saves to localStorage on every skill change — synchronous and blocking
- **Recommendation:** Split contexts further (e.g., `ProfileContext` vs `SEOContext`). Use `useMemo` in context values more aggressively

### Supabase Query Efficiency
- `fetchProjects()` has no pagination — loads ALL projects at once
- `fetchAllSkillsData()` makes 3 sequential queries (categories, skills, tech_stack) — could be parallel with `Promise.all`
- No `.select()` column narrowing — always fetches `*`
- **Recommendation:** Add pagination for projects, use `Promise.all` for skills data, specify needed columns

### Framer Motion
- Heavy use of `motion.div` on every page — animation on scroll, stagger children, layout animations
- On low-end devices, 20+ concurrent animations could cause jank
- **Recommendation:** Respect `prefers-reduced-motion` (the `site_settings.enable_animations` flag exists but is never checked)

### Tailwind Purge
- Content paths: `./src/**/*.{js,jsx,ts,tsx}` + `./public/index.html` — correct
- With 68 source files, purge should be effective
- **Risk:** Dynamic class names (e.g., `bg-${color}-500`) are NOT detected by Tailwind's purge — they won't be generated. This is a known issue in `SkillsManager` and `ContactHub`

### Third-Party Dependency Bloat
- `lucide-react` imports 1000+ icons dynamically — tree-shaking depends on bundler
- `recharts` is ~200KB but only used for one dashboard component
- `framer-motion` is ~150KB
- **Recommendation:** Consider `@tabler/icons-react` (smaller per-icon) for Lucide, lazy-load Recharts

### Skeleton Loaders
- Skeleton patterns exist but are only used in `PortfolioGallery`
- Other pages show generic spinners or nothing
- **Gap:** `CaseStudyDetail` shows a spinner but no skeleton — masks slow loads poorly

### Memory Leaks
- `ToastContext` — `setTimeout` for auto-dismiss is NOT cleared if component unmounts before timeout
- `SkillsContext` — localStorage writes on every change without debounce
- `Homepage` — scroll event listener added but could use `passive: true` for performance
- `CaseStudyDetail` — scroll listener for active section tracking, no cleanup issues

### Real-Time Subscriptions
- **No Supabase Realtime subscriptions** exist — all data is request/response
- No risk of uncleaned subscriptions here

---

## 17. UI/UX Analysis — Issues & Recommendations

### Accessibility (a11y)

| Issue | Location | Severity |
|---|---|---|
| Missing ARIA labels on icon-only buttons | PortfolioGallery overlay buttons, SkillsManager icon buttons | Medium |
| No keyboard navigation for modals | SkillsManager modals, PortfolioGallery preview modal | Medium |
| Color contrast in dark mode | Some `primary-200` text on dark backgrounds | Low-Medium |
| Dynamic Tailwind classes not generated | `bg-${type.color}-100` patterns — classes may not exist | **High** |
| No focus trap in modals | All modal dialogs | Medium |
| Missing `role="dialog"` on modals | SkillsManager, PortfolioGallery preview | Medium |
| Form fields lack `aria-describedby` for errors | ContactForm, Login | Low |

### Mobile Responsiveness
- Header mobile menu works but overlay z-index conflict potential (`z-[-1]` on overlay)
- Admin sidebar is responsive (mobile overlay, desktop fixed)
- `CaseStudyDetail` grid layout collapses to single column on mobile
- **Edge case:** Long project titles in `ProjectsManager` could overflow on narrow screens

### Loading State Consistency
| Page | Loading State | Quality |
|---|---|---|
| Homepage | No loading state | N/A (uses context data, renders defaults) |
| PortfolioGallery | Skeleton cards | Good |
| CaseStudyDetail | Spinner | Adequate |
| AboutStory | No loading (all hardcoded) | N/A |
| ContactHub | No loading | N/A |
| AdminDashboard | `isLoading` flag + spinner | Adequate |
| SkillsManager | No loading indicator | Poor |
| ProjectsManager | Spinner icon | Adequate |

### Error Handling UX
- Supabase errors are logged to console AND shown as toast messages — good
- Error boundary catches crashes but doesn't offer retry
- `CaseStudyDetail` redirects to gallery on error (user loses context)
- **Raw errors exposed:** Some service errors show technical messages directly to users

### Form UX
- **ContactForm:** No actual backend submission — just simulated success
- **ProjectManager:** Auto-save every 30s is good, but no undo/redo
- **Login:** No "forgot password" flow
- Validation feedback is inline and immediate — good
- No form state persistence across page navigation

### Navigation Clarity
- Admin sidebar has helpful descriptions under each item
- No breadcrumb navigation in admin sub-pages
- "Back to Dashboard" link in ProjectManager is the only breadcrumb
- Project edit link in `ProjectsManager` goes to `/project-manager?id=...` but `ProjectManager` doesn't read URL params for editing (it's create-only)

### Dark Mode Consistency
- Most components use `transition-theme` and dark variants
- **Potential gaps:** `AboutStory` page uses hardcoded `bg-white` in several sections (doesn't respect dark mode)
- `DebugSupabase` uses hardcoded gray colors — no dark mode
- `NotFound` page gradient is light-mode only

### Empty States
- `PortfolioGallery` — good empty state with "View All Projects" CTA
- `ProjectsManager` — good empty state with "Create Project" CTA
- `SkillsManager` — minimal: "No skills yet. Add some!" (acceptable)
- **Missing:** Empty states for no categories, no tech stack, no social links

### Toast Notifications
- Stack properly (flex column)
- Auto-dismiss with configurable durations
- Manual dismiss via X button
- **Gap:** No pause-on-hover, no max stack limit (could overflow screen with many rapid toasts)

---

## 18. Security Considerations

### Authentication Flow
- Supabase Auth with email/password
- Session persistence via `persistSession: true`
- `RequireAuth` guard on all admin routes
- **Dev mode bypass:** If Supabase is not configured, `RequireAuth` renders children with a warning — this is intentional for development but should never ship to production without env vars

### Row Level Security
- Inferred that RLS policies protect mutations (INSERT/UPDATE/DELETE require auth)
- SELECT on `projects` likely public (published projects visible to all)
- **Risk:** RLS policies are NOT version-controlled — they live only in Supabase dashboard
- **Recommendation:** Document RLS policies in a SQL migration file in the repo

### Environment Variables
- `VITE_` prefix means these are exposed to the browser — expected for Supabase anon key
- Supabase anon key is safe to expose (that's its purpose) — service role key must NEVER be used
- `.env.example` correctly documents required variables

### Form Input Sanitization
- React auto-escapes JSX content — XSS via text input is mitigated
- URL fields (demo_url, repository_url) validated with `z.string().url()` — good
- No `dangerouslySetInnerHTML` found in the codebase
- **Risk:** Contact form data is never sanitized server-side because there's no server-side handler

### File Upload Security
- No actual file upload implementation found — all images are URL-based
- If Supabase Storage is added in the future, implement:
  - File type validation (allowlist images only)
  - File size limits
  - Virus scanning for uploaded files

---

## 19. Known Technical Debt & Code Smells

### Duplicated Code
- `handleSupabaseError` / `formatSupabaseResponse` — called in every service function but also re-implemented inline in some places
- Modal patterns in `SkillsManager` — three nearly identical modal structures (Category, Skill, Tech) that should be a reusable `Modal` component
- Form field patterns repeated across all settings tabs

### Inconsistent Naming/Structure
- Some pages use folder + `index.jsx` pattern (`homepage/`, `about-story/`), others are flat files (`DebugPage.jsx`, `NotFound.jsx`)
- `ProjectsManager.jsx` lives in `admin-dashboard/components/` but `ProjectManager` is a top-level page — confusing naming
- `SkillsVisualization.jsx` is imported but its content was not analyzed (likely renders skills from context)

### Hardcoded Values
- `AdminDashboard` — "Pending Comments: 7", "Active Projects: 5" are hardcoded
- `AboutStory` — ALL content is hardcoded (personalInfo, timelineData, skillsData, valuesData, interests)
- `HeroSection` — code snippets are hardcoded, "2+ Years Experience" / "2+ Projects Delivered" are hardcoded
- `ContactHub` — timezone "EST (UTC-5)" is hardcoded
- `Footer` — social platform detection has 30+ hardcoded domain mappings

### Deprecated / Unused Dependencies
- `@testing-library/react` (v11.2.7) — very outdated, no tests use it
- `@testing-library/jest-dom` — no Jest setup
- `@testing-library/user-event` — no tests
- `axios` — no axios imports found in the codebase
- `react-router-hash-link` — no imports found
- `react-hook-form` — imported in package.json but not used anywhere
- `tailwindcss-animate`, `tailwindcss-elevation`, `tailwindcss-fluid-type` — Tailwind plugins listed in package.json but NOT in `tailwind.config.js` plugins array
- `@tailwindcss/container-queries`, `@tailwindcss/line-clamp` — in devDependencies but not used

### Debug Files That Should Be Removed
- `src/pages/DebugPage.jsx` — debug utility page
- `src/pages/DebugSupabase.jsx` — Supabase diagnostic page
- `src/debug/supabaseTest.js` — debug script (also exposes `window.debugSupabase`)
- `@dhiwise/component-tagger` — dev tool that adds debug attributes to DOM

### Orphaned Pages
- `DebugPage` and `DebugSupabase` are not routed in `Routes.jsx`
- Several admin components are imported but unused: `ContentCalendar.jsx`, `RecentActivity.jsx` (referenced but props are empty)

### Blog Feature Remnants
- Blog validation schemas exist (`blogSchema`, `blogCreateSchema`)
- Blog test scripts in `package.json`
- Blog skeleton components (`SkeletonBlogPost`)
- But NO blog routes, NO blog pages, NO blog services
- `blogs` table referenced in debug code

---

## 20. Future Enhancement Ideas

### Suggested Features
1. **Blog system** — Infrastructure exists (schemas, skeletons, test scripts). Implement blog CRUD routes, pages, and admin editor
2. **Contact form backend** — Connect to Supabase (new `contact_submissions` table) or email service (Resend, SendGrid)
3. **Forgot password flow** — Supabase Auth supports this; add a reset password page
4. **Image upload** — Implement actual file uploads via Supabase Storage instead of URL entry
5. **Project editing** — Make `ProjectManager` read URL params (`?id=...`) and load existing project data
6. **RSS feed** — Generate `rss.xml` at build time for blog/projects
7. **Sitemap generation** — Dynamic sitemap for SEO
8. **Analytics integration** — Wire up Google Analytics ID from settings

### Suggested Refactors
1. **Extract reusable Modal component** — Replace three modals in `SkillsManager`
2. **Extract FormField components** — Reusable labeled input with error display
3. **Separate SEO settings into its own context** — Reduces unnecessary re-renders
4. **Move hardcoded content to CMS** — AboutStory, HeroSection stats, AdminDashboard stats
5. **Standardize page structure** — All pages as folder + `index.jsx` or all as flat files
6. **Create a `useSupabaseQuery` hook** — Centralize loading/error/data fetching pattern

### Suggested Performance Optimizations
1. **Add `prefers-reduced-motion` check** — Disable Framer Motion for users who prefer it
2. **Debounce search in PortfolioGallery** — Use `useDebounce` hook (already exists, unused)
3. **Add pagination to projects** — Limit initial load, infinite scroll or "Load More"
4. **Memoize context values** — `useMemo` in all providers to prevent unnecessary re-renders
5. **Lazy-load Recharts** — `const PerformanceCharts = lazy(() => import(...))` since it's admin-only
6. **Remove unused Tailwind plugins** — Clean up `tailwindcss-elevation`, `tailwindcss-animate`, `tailwindcss-fluid-type` if not used
7. **Replace dynamic class names** — Use Tailwind's `safelist` or explicit class maps for dynamic colors
8. **Add `loading="lazy"` to AppImage** — Native lazy loading for below-fold images

### Suggested UX Improvements
1. **Implement actual SEO meta tags** — Use `react-helmet` to render `seo_settings` as `<meta>` tags
2. **Add breadcrumb navigation** in admin sub-pages
3. **Add empty states** for skills manager (no categories, no tech stack)
4. **Implement forgot password** flow on login page
5. **Add toast pause-on-hover** — Let users read long messages
6. **Add max toast stack limit** — Cap at 3-5 visible toasts
7. **Add confirmation dialogs** for publish/unpublish actions
8. **Implement image lightbox** for case study gallery (currently just a basic modal)
9. **Add keyboard shortcuts** in admin (e.g., Ctrl+S to save)
10. **Add dark mode to AboutStory and Debug pages**

---

*Document generated for P:\Projects\My Portfolio on 2026-04-04. Keep this file updated as the project evolves.*
