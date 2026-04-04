# Refactoring Plan — Moataz's Portfolio

> **Rule:** Refactor first, add features later. This document is the single source of truth for all refactoring work. Execute phase by phase, commit after each sub-task.

---

## Phase 1: Critical Fixes — Broken Functionality

> Things that are broken or partially implemented right now. Fix these first because they directly affect users.

---

### 1.1 Fix Dynamic Tailwind Class Names Not Generating

**Problem:** `bg-${color}-500`, `text-${type.color}-800` patterns produce class strings that Tailwind's content scanner can't detect. These classes are **not generated** in the production CSS, so they render as unstyled in production builds.

**Severity:** 🔴 High — visual bugs in production

**Affected files:**

| File | Pattern |
|---|---|
| `src/pages/admin-dashboard/components/SkillsManager.jsx` | `bg-${category.color}-100`, `bg-${category.color}-500`, `text-${section.color}-800` |
| `src/pages/contact-hub/index.jsx` | `border-${type.color}`, `bg-${type.color}/5`, `bg-${type.color}` |
| `src/pages/admin-dashboard/components/Sidebar.jsx` | `bg-${section.color}-100`, `text-${section.color}-600` |
| `src/pages/admin-dashboard/components/SettingsManager.jsx` | `bg-${tab.color}-100` (if any) |

**Approach:** Replace dynamic interpolation with explicit lookup maps.

```js
// BEFORE (broken in production):
<div className={`bg-${category.color}-100`}>

// AFTER (works):
const bgMap = {
  accent: 'bg-accent-100',
  success: 'bg-success-100',
  cta: 'bg-cta-100',
  primary: 'bg-primary-100',
  warning: 'bg-warning-100',
  violet: 'bg-violet-100',
  indigo: 'bg-indigo-100',
  blue: 'bg-blue-100',
  teal: 'bg-teal-100',
  emerald: 'bg-emerald-100',
  // ... all used combinations
};
<div className={bgMap[category.color] || 'bg-primary-100'}>
```

**Alternative approach (Tailwind safelist):** Add all possible dynamic classes to `safelist` in `tailwind.config.js`. This is simpler but increases CSS output slightly.

```js
// tailwind.config.js
module.exports = {
  safelist: [
    'bg-accent-100', 'bg-accent-500', 'bg-accent-200', 'text-accent-800', 'text-accent-600',
    'bg-success-100', 'bg-success-500', 'bg-success-200', 'text-success-800', 'text-success-600',
    'bg-cta-100', 'bg-cta-500', 'bg-cta-200', 'text-cta-800', 'text-cta-600',
    'bg-primary-100', 'bg-primary-500', 'bg-primary-200', 'text-primary-800', 'text-primary-600',
    'bg-warning-100', 'bg-warning-500', 'border-warning', 'text-warning-700',
    'border-accent', 'border-cta', 'border-success', 'border-primary',
  ],
  // ...
}
```

**Recommended:** Use the safelist approach — it's one config change vs dozens of code changes. Audit all dynamic patterns first, then add them to the safelist.

**Acceptance criteria:**
- [ ] All dynamic color classes render correctly in a production build
- [ ] `npm run build` succeeds with no missing class warnings
- [ ] SkillsManager color picker shows correct colors
- [ ] ContactHub inquiry type buttons show correct colors

---

### 1.2 Fix ProjectManager to Support Editing Existing Projects

**Problem:** The `ProjectsManager` list has an "Edit" button that links to `/project-manager?id=123`, but `ProjectManager` completely ignores the `id` query parameter. It always renders a blank create form. **Editing is broken.**

**Severity:** 🔴 High — admin cannot edit existing projects

**Affected files:**

| File | Change |
|---|---|
| `src/pages/project-manager/index.jsx` | Read `id` param, load existing data, update vs create on save |
| `src/pages/admin-dashboard/components/ProjectsManager.jsx` | Link already correct (`/project-manager?id=...`) |

**Approach:**

1. **Read URL param:**
   ```js
   import { useSearchParams } from 'react-router-dom';
   const [searchParams] = useSearchParams();
   const editId = searchParams.get('id');
   ```

2. **Load existing data if editing:**
   ```js
   useEffect(() => {
     const loadExisting = async () => {
       if (!editId) return;
       const result = await getProjectById(editId);
       if (result.success) {
         setFormData(transformProjectToForm(result.data));
       }
     };
     loadExisting();
   }, [editId]);
   ```

3. **Transform project data → form state:**
   ```js
   function transformProjectToForm(project) {
     return {
       title: project.title || '',
       client: project.client || '',
       description: project.description || '',
       category: project.category || '',
       technologies: project.technologies || [],
       // ... map all fields
     };
   }
   ```

4. **Save logic — update vs create:**
   ```js
   const handleSave = async (isDraft = false) => {
     // ... validation ...
     const result = editId
       ? await editProject(editId, projectData)   // UPDATE
       : await addProject(projectData);            // CREATE
     // ... redirect ...
   };
   ```

5. **UI changes:**
   - Header: "Create Project" → "Edit: {title}" when editing
   - Submit button: "Publish Project" → "Update Project" when editing
   - Add "Cancel" button → redirect back to `/projects-manager`

**Acceptance criteria:**
- [ ] Clicking "Edit" on a project loads its data into the form
- [ ] Saving an edited project updates it in Supabase
- [ ] Creating a new project still works (no `?id=` param)
- [ ] "Cancel" button returns to projects list

---

### 1.3 Implement Actual SEO Meta Tags

**Problem:** `react-helmet` is installed (`v6.1.0`) but **zero `<Helmet>` components exist** in the codebase. The admin dashboard lets you set `meta_title`, `meta_description`, `og_image`, `twitter_handle`, `google_analytics_id`, `google_site_verification` — but none of these values are ever rendered into the HTML `<head>`.

**Severity:** 🔴 High — portfolio is essentially invisible to search engines

**Affected files:**

| File | Change |
|---|---|
| `src/components/Layout.jsx` | Add default `<Helmet>` with site settings |
| `src/pages/homepage/index.jsx` | Add page-specific `<Helmet>` |
| `src/pages/portfolio-gallery/index.jsx` | Add page-specific `<Helmet>` |
| `src/pages/about-story/index.jsx` | Add page-specific `<Helmet>` |
| `src/pages/contact-hub/index.jsx` | Add page-specific `<Helmet>` |
| `src/pages/case-study-detail/index.jsx` | Add project-specific `<Helmet>` |
| `public/index.html` | Add base fallback meta tags |

**Approach:**

1. **Layout.jsx — default meta tags from settings:**
   ```jsx
   import { Helmet } from 'react-helmet';
   import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

   const Layout = ({ children }) => {
     const { siteSettings, seoSettings, profile } = usePortfolioSettings();

     return (
       <>
         <Helmet>
           {/* Default title & description */}
           <title>{seoSettings.meta_title || siteSettings.site_title || 'Portfolio'}</title>
           <meta name="description" content={seoSettings.meta_description || siteSettings.site_description} />
           <meta name="keywords" content={siteSettings.site_keywords} />

           {/* Open Graph */}
           <meta property="og:title" content={seoSettings.meta_title} />
           <meta property="og:description" content={seoSettings.meta_description} />
           {seoSettings.og_image && <meta property="og:image" content={seoSettings.og_image} />}
           <meta property="og:type" content="website" />

           {/* Twitter Card */}
           {seoSettings.twitter_handle && (
             <meta name="twitter:creator" content={seoSettings.twitter_handle} />
           )}
           <meta name="twitter:card" content="summary_large_image" />

           {/* Google verification */}
           {seoSettings.google_site_verification && (
             <meta name="google-site-verification" content={seoSettings.google_site_verification} />
           )}

           {/* Canonical */}
           <link rel="canonical" href={window.location.href} />
         </Helmet>

         {!shouldHide && <Header />}
         {children}
         {!shouldHide && <Footer />}
       </>
     );
   };
   ```

2. **Individual pages override with `<Helmet>`:**
   ```jsx
   // homepage/index.jsx
   <Helmet>
     <title>Home — {profile.full_name || 'Portfolio'}</title>
     <meta name="description" content={profile.tagline || 'Full Stack Developer Portfolio'} />
   </Helmet>
   ```

3. **Case study detail — project-specific:**
   ```jsx
   <Helmet>
     <title>{caseStudy.title} — Case Study</title>
     <meta name="description" content={caseStudy.description} />
     <meta property="og:title" content={caseStudy.title} />
     <meta property="og:image" content={caseStudy.heroImage} />
   </Helmet>
   ```

4. **`public/index.html` fallback:**
   Add basic `<title>`, `<meta name="description">`, and `<meta property="og:...">` tags for SSR/initial load.

**Acceptance criteria:**
- [ ] Page `<title>` reflects current page + site name
- [ ] `<meta name="description">` present on every page
- [ ] Open Graph tags render when sharing URLs on social media
- [ ] Google site verification meta tag renders when configured
- [ ] Admin SEO settings changes propagate to actual meta tags

---

### 1.4 Fix ContactForm — Connect to Backend

**Problem:** The contact form runs a simulated 2-second delay then shows success. **No data is actually saved or sent anywhere.**

**Severity:** 🔴 High — visitors cannot actually reach you

**Affected files:**

| File | Change |
|---|---|
| `src/pages/contact-hub/components/ContactForm.jsx` | Replace simulated submission with real Supabase INSERT |
| **New:** `src/services/contactService.js` | New service for contact submissions |
| **Supabase:** New table `contact_submissions` | Store form submissions |

**Approach:**

1. **Create Supabase table:**
   ```sql
   CREATE TABLE contact_submissions (
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
     status text DEFAULT 'new', -- new, read, replied, archived
     created_at timestamptz DEFAULT now()
   );

   -- RLS: anyone can INSERT, only authenticated users can SELECT
   ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Anyone can submit contact form"
     ON contact_submissions FOR INSERT
     TO anon, authenticated
     WITH CHECK (true);

   CREATE POLICY "Authenticated users can view submissions"
     ON contact_submissions FOR SELECT
     TO authenticated
     USING (true);
   ```

2. **Create service:**
   ```js
   // src/services/contactService.js
   import { supabase, formatSupabaseResponse, isSupabaseConfigured } from '../lib/supabase';

   export const submitContactForm = async (data) => {
     if (!isSupabaseConfigured()) {
       return { success: false, error: 'Supabase not configured' };
     }

     try {
       const { data: result, error } = await supabase
         .from('contact_submissions')
         .insert([{
           name: data.name,
           email: data.email,
           company: data.company || null,
           phone: data.phone || null,
           subject: data.subject,
           message: data.message,
           inquiry_type: data.inquiryType || 'general',
           budget: data.budget || null,
           timeline: data.timeline || null,
           event_date: data.eventDate || null,
           event_location: data.eventLocation || null,
           audience_size: data.audienceSize || null,
         }])
         .select()
         .single();

       return formatSupabaseResponse(result, error);
     } catch (error) {
       return { success: false, error: error.message };
     }
   };
   ```

3. **Update ContactForm.jsx:**
   Replace the simulated submission:
   ```js
   // BEFORE:
   await new Promise(resolve => setTimeout(resolve, 2000));

   // AFTER:
   import { submitContactForm } from 'services/contactService';

   const result = await submitContactForm(formData);
   if (result.success) {
     setIsSubmitted(true);
   } else {
     toast.error(result.error || 'Failed to send message. Please try again.');
   }
   ```

4. **Optional Phase 7+:** Add admin page to view/manage submissions.

**Acceptance criteria:**
- [ ] Submitting the form creates a row in `contact_submissions`
- [ ] Success state shows only after successful DB insert
- [ ] Error state shows user-friendly message on failure
- [ ] RLS prevents anonymous users from reading submissions

---

## Phase 2: Remove Dead Code & Unused Dependencies

> Quick wins with low risk. Clean up the codebase so future work is less confusing.

---

### 2.1 Delete Debug Files

**Delete these files entirely:**

| File | Reason |
|---|---|
| `src/pages/DebugPage.jsx` | Debug utility, not routed, not needed in production |
| `src/pages/DebugSupabase.jsx` | Supabase diagnostic page, not routed |
| `src/debug/supabaseTest.js` | Debug script, also pollutes `window.debugSupabase` |
| `src/debug/` (folder) | Empty after above deletion |

**Also remove:** Any imports or references to these files (grep for `DebugPage`, `DebugSupabase`, `supabaseTest`, `debugSupabase`).

**Risk:** None — these are not used or routed.

**Acceptance criteria:**
- [ ] All debug files deleted
- [ ] No imports reference debug files
- [ ] `window.debugSupabase` no longer exposed
- [ ] App builds and runs without errors

---

### 2.2 Remove `@dhiwise/component-tagger` from Build

**Problem:** This plugin adds `data-component` and `data-file` attributes to every DOM element for visual debugging. It runs in production builds.

**Affected files:**

| File | Change |
|---|---|
| `vite.config.mjs` | Remove `tagger()` from plugins array |
| `package.json` | Remove `@dhiwise/component-tagger` from dependencies |

**Changes:**

```js
// vite.config.mjs — BEFORE
import tagger from "@dhiwise/component-tagger";
export default defineConfig({
  plugins: [tsconfigPaths(), react(), tagger()],
  // ...
});

// vite.config.mjs — AFTER
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  // ...
});
```

```json
// package.json — remove from "dependencies":
"@dhiwise/component-tagger": "^1.0.9",  // DELETE THIS LINE
```

**Acceptance criteria:**
- [ ] No `data-component` or `data-file` attributes in production DOM
- [ ] Build succeeds without tagger
- [ ] Dev server still works normally

---

### 2.3 Remove Unused Dependencies

**Audit and remove:**

| Package | Location | Why Remove |
|---|---|---|
| `@testing-library/react` | `package.json` devDependencies | No test files exist |
| `@testing-library/jest-dom` | `package.json` devDependencies | No test files exist |
| `@testing-library/user-event` | `package.json` devDependencies | No test files exist |
| `axios` | `package.json` dependencies | Never imported in any file |
| `react-router-hash-link` | `package.json` dependencies | Never imported in any file |
| `react-hook-form` | `package.json` dependencies | Never imported in any file |
| `tailwindcss-animate` | `package.json` dependencies | Not in `tailwind.config.js` plugins array |
| `tailwindcss-elevation` | `package.json` dependencies | Not in `tailwind.config.js` plugins array |
| `tailwindcss-fluid-type` | `package.json` dependencies | Not in `tailwind.config.js` plugins array |

**Also remove from `package.json`:**
```json
"eslintConfig": {
  "extends": ["react-app", "react-app/jest"]  // No ESLint config is used either
}
```

**After removal, run:** `npm install` to update lockfile.

**Acceptance criteria:**
- [ ] All unused packages removed from package.json
- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds
- [ ] App runs without errors
- [ ] `node_modules` size reduced (verify with `du -sh node_modules`)

---

### 2.4 Remove Orphaned Admin Components

**Audit each file for imports before deleting:**

| File | Status | Action |
|---|---|---|
| `src/pages/admin-dashboard/components/ContentCalendar.jsx` | Check imports → if none, DELETE | Orphaned |
| `src/pages/admin-dashboard/components/RecentActivity.jsx` | Imported in dashboard but props are no-op (`setActivities={() => {}}`) | KEEP but fix props |

**Approach:**
1. Grep for each filename across the codebase
2. If zero imports found → safe to delete
3. For `RecentActivity`, the component IS used — just clean up the empty setter

**Acceptance criteria:**
- [ ] Orphaned components deleted
- [ ] No broken imports after deletion
- [ ] RecentActivity props cleaned up

---

### 2.5 Remove Blog Remnants

**Blog feature is not implemented but traces remain everywhere:**

| File | What to Remove |
|---|---|
| `src/lib/validation.js` | `blogSchema`, `blogCreateSchema`, `blogUpdateSchema` (3 exports) |
| `src/components/ui/Skeleton.jsx` | `SkeletonBlogPost` export and component |
| `src/services/projectsService.js` | `fetchProjectBySlug` function (uses blog-like slug pattern, but keep if used) |
| `package.json` scripts | `test:blogs`, `test:blogs-manager`, `test:blog-detail`, `test:report` |

**Also grep for:** `blog`, `Blog`, `post`, `Post` across the codebase to find any other remnants.

**Acceptance criteria:**
- [ ] No blog-related code in the codebase
- [ ] No blog-related test scripts in package.json
- [ ] Validation.js only exports active schemas

---

### 2.6 Clean Up Test Scripts

**Remove from `package.json` scripts section:**

```json
// DELETE these lines:
"test:blogs": "playwright test blogs-manager blog-detail",
"test:blogs-manager": "playwright test blogs-manager",
"test:blog-detail": "playwright test blog-detail",
"test:report": "playwright show-report"
```

**Keep as placeholders:**
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:headed": "playwright test --headed",
"test:e2e:debug": "playwright test --debug"
```

**Acceptance criteria:**
- [ ] No scripts reference non-existent blog routes
- [ ] `npm run test:e2e` still runs (even with zero tests)

---

## Phase 3: Memory Leak & Bug Fixes

> Small correctness fixes that prevent resource leaks over time.

---

### 3.1 Fix ToastContext setTimeout Leak

**Problem:** `addToast` creates a `setTimeout` for auto-dismiss. If the `ToastProvider` unmounts before the timeout fires, the timeout still runs and tries to call `removeToast` on an unmounted component.

**Affected file:** `src/context/ToastContext.jsx`

**Current code:**
```js
const addToast = useCallback((message, type = 'info', duration = 5000) => {
  const id = Date.now() + Math.random();
  const toast = { id, message, type, ...TOAST_TYPES[type] || TOAST_TYPES.info };
  setToasts(prev => [...prev, toast]);

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);  // ← runs even if unmounted
    }, duration);
  }
  return id;
}, []);
```

**Fixed code:**
```js
const timeoutIds = useRef(new Map());

const addToast = useCallback((message, type = 'info', duration = 5000) => {
  const id = Date.now() + Math.random();
  const toast = { id, message, type, ...TOAST_TYPES[type] || TOAST_TYPES.info };
  setToasts(prev => [...prev, toast]);

  if (duration > 0) {
    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, duration);
    timeoutIds.current.set(id, timeoutId);
  }
  return id;
}, []);

const removeToast = useCallback((id) => {
  // Clear the timeout before removing
  const timeoutId = timeoutIds.current.get(id);
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutIds.current.delete(id);
  }
  setToasts(prev => prev.filter(toast => toast.id !== id));
}, []);

// Cleanup ALL pending timeouts on unmount
useEffect(() => {
  return () => {
    timeoutIds.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutIds.current.clear();
  };
}, []);
```

**Acceptance criteria:**
- [ ] No "can't perform a React state update on an unmounted component" warnings
- [ ] Toasts still auto-dismiss normally
- [ ] Manual dismiss clears the timeout

---

### 3.2 Verify ContactForm Timeout Cleanup

**Current state:** Already has `useRef` + cleanup `useEffect`. Verify it's correct.

**File:** `src/pages/contact-hub/components/ContactForm.jsx`

**Check:**
```js
const timeoutRef = useRef(null);

// In submit handler:
timeoutRef.current = setTimeout(() => { ... }, 3000);

// Cleanup:
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

**Verdict:** ✅ Already correct. No changes needed.

**Acceptance criteria:**
- [ ] Verified — no changes required

---

### 3.3 Add `passive: true` to Scroll Event Listeners

**Problem:** Scroll listeners without `passive: true` block the main thread. Modern browsers can optimize scroll performance when they know the listener won't call `preventDefault()`.

**Affected files:**

| File | Line / Pattern |
|---|---|
| `src/pages/homepage/index.jsx` | `window.addEventListener('scroll', handleScroll)` |
| `src/pages/case-study-detail/index.jsx` | `window.addEventListener('scroll', handleScroll)` (scroll spy) |
| `src/components/ui/Header.jsx` | `window.addEventListener('scroll', handleScroll)` (throttled) |

**Fix:**
```js
// BEFORE:
window.addEventListener('scroll', handleScroll);

// AFTER:
window.addEventListener('scroll', handleScroll, { passive: true });
```

**Acceptance criteria:**
- [ ] All scroll listeners use `{ passive: true }`
- [ ] Scroll behavior unchanged
- [ ] Lighthouse performance score improves (if measurable)

---

## Phase 4: Code Extraction & DRY Refactoring

> Extract reusable components and hooks to reduce duplication.

---

### 4.1 Extract Reusable Modal Component

**Problem:** `SkillsManager.jsx` contains 3 nearly identical modal implementations (Category Modal, Skill Modal, Tech Modal). Each is ~60-80 lines of duplicated markup.

**Affected file:** `src/pages/admin-dashboard/components/SkillsManager.jsx` (~250 lines of modal code)

**New file:** `src/components/ui/Modal.jsx`

**Design:**
```jsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  const modalRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
          ref={modalRef}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Body */}
          {children}

          {/* Footer */}
          {footer && (
            <div className="flex space-x-3 mt-6">
              {footer}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
```

**Refactor SkillsManager to use it:**
```jsx
// Replace ~250 lines of modal JSX with:
<Modal
  isOpen={showCategoryModal}
  onClose={closeCategoryModal}
  title={editingCategory ? 'Edit Category' : 'Add Category'}
  footer={
    <>
      <button onClick={closeCategoryModal} className="flex-1 btn-secondary">Cancel</button>
      <button onClick={editingCategory ? handleUpdateCategory : handleAddCategory} className="flex-1 btn-primary">
        {editingCategory ? 'Update' : 'Add'}
      </button>
    </>
  }
>
  {/* form fields */}
</Modal>
```

**Acceptance criteria:**
- [ ] All 3 modals replaced with `<Modal>` component
- [ ] Modal functionality unchanged (open, close, form, submit)
- [ ] SkillsManager file size reduced by ~200 lines
- [ ] Modal closes on Escape key and backdrop click

---

### 4.2 Extract FormField Component

**Problem:** Every form repeats the same labeled input + error pattern. Found in:
- All settings tabs (ProfileSettingsTab, SEOSettingsTab, SiteSettingsTab, SocialLinksTabDynamic)
- Login page
- Contact form
- Project manager sub-components

**New file:** `src/components/ui/FormField.jsx`

**Design:**
```jsx
import React from 'react';
import Icon from 'components/AppIcon';

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon,
  multiline = false,
  rows = 3,
  maxLength,
  required = false,
  helpText,
  className = '',
  ...rest
}) => {
  const inputClasses = `
    w-full px-4 py-3 border rounded-lg
    focus:ring-2 focus:ring-accent focus:border-transparent
    transition-colors
    ${error ? 'border-error-500' : 'border-primary-200'}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-primary-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <Icon name={icon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            className={`${inputClasses} ${icon ? 'pl-10' : ''} resize-vertical`}
            {...rest}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`${inputClasses} ${icon ? 'pl-10' : ''}`}
            {...rest}
          />
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-error-500 flex items-center gap-1">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="mt-1 text-xs text-secondary-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;
```

**Rollout plan:** Start with settings tabs (highest density of repeated patterns), then login, then contact form.

**Acceptance criteria:**
- [ ] FormField component created and exported
- [ ] At least 2 settings tabs refactored to use it
- [ ] Visual appearance unchanged
- [ ] Error display works correctly

---

### 4.3 Standardize Page Structure

**Current inconsistency:**

| Pattern | Files |
|---|---|
| Folder + `index.jsx` | `homepage/`, `portfolio-gallery/`, `case-study-detail/`, `about-story/`, `contact-hub/`, `login/`, `admin-dashboard/`, `project-manager/` |
| Flat `.jsx` file | `NotFound.jsx`, `DebugPage.jsx`, `DebugSupabase.jsx` |

**Standard:** All pages as folder + `index.jsx`

**Moves needed:**

| From | To |
|---|---|
| `src/pages/NotFound.jsx` | `src/pages/not-found/index.jsx` |

(Note: DebugPage and DebugSupabase are deleted in Phase 2, so no need to move them.)

**Update imports in:** `src/Routes.jsx`

```js
// BEFORE:
const NotFound = lazy(() => import("pages/NotFound"));

// AFTER:
const NotFound = lazy(() => import("pages/not-found"));
```

**Acceptance criteria:**
- [ ] All pages follow folder + index.jsx pattern
- [ ] Routes.jsx imports updated
- [ ] No broken imports

---

### 4.4 Create `useSupabaseQuery` Hook

**Problem:** Every data fetch follows the same pattern: set loading → call Supabase → set data/error. This pattern is duplicated across contexts and pages.

**New file:** `src/hooks/useSupabaseQuery.js`

**Design:**
```js
import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for Supabase data fetching.
 * @param {Function} queryFn - Async function that returns { success, data, error }
 * @param {Object} options - { immediate: boolean (default true), deps: array }
 * @returns {Object} { data, loading, error, refetch }
 */
export const useSupabaseQuery = (queryFn, options = {}) => {
  const { immediate = true, deps = [] } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, refetch: execute };
};
```

**Usage example:**
```js
// In a component or context:
const { data: projects, loading, error, refetch } = useSupabaseQuery(
  () => fetchProjects({ publishing_status: 'published' }),
  { deps: [] }
);
```

**Rollout:** Start with read-only usages (pages), then gradually adopt in contexts.

**Acceptance criteria:**
- [ ] Hook created and tested in at least one page component
- [ ] Loading/error/data states handled correctly
- [ ] `refetch` function works

---

## Phase 5: Performance Optimizations

> Make the app faster, especially on low-end devices and slow networks.

---

### 5.1 Add `prefers-reduced-motion` Support

**Problem:** The app uses Framer Motion extensively (every page has animations). Users with `prefers-reduced-motion: reduce` still see all animations. Additionally, `site_settings.enable_animations` exists in settings but is never checked.

**New file:** `src/hooks/useReducedMotion.js`

**Design:**
```js
import { useState, useEffect } from 'react';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

export const useReducedMotion = () => {
  const { siteSettings } = usePortfolioSettings();

  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Respect both system preference AND admin setting
  return prefersReduced || siteSettings?.enable_animations === false;
};
```

**Usage in animated components:**
```js
const shouldReduceMotion = useReducedMotion();

// Instead of:
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

// Use:
<motion.div
  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
>
```

**Or use Framer Motion's built-in `useReducedMotion`:**
```js
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
// This already exists! Just wrap it with settings check.
```

**Acceptance criteria:**
- [ ] Animations disabled/simplified when `prefers-reduced-motion: reduce` is set
- [ ] Animations disabled when `enable_animations` is false in settings
- [ ] No visual regression when animations are enabled

---

### 5.2 Debounce Search in PortfolioGallery

**Problem:** Search input filters projects on every keystroke with no debounce. Typing "React" triggers 5 filter operations.

**Affected file:** `src/pages/portfolio-gallery/index.jsx`

**Current:**
```js
const [searchQuery, setSearchQuery] = useState('');
// ...
const filteredProjects = useMemo(() => {
  // ... uses searchQuery directly
}, [activeFilter, searchQuery, displayProjects]);
```

**Fix — use existing `useDebounce` hook:**
```js
import { useDebounce } from 'hooks/useDebounce';

const [searchQuery, setSearchQuery] = useState('');
const debouncedSearch = useDebounce(searchQuery, 300);

const filteredProjects = useMemo(() => {
  // ... uses debouncedSearch instead of searchQuery
}, [activeFilter, debouncedSearch, displayProjects]);
```

**Acceptance criteria:**
- [ ] Search filters 300ms after last keystroke
- [ ] Typing feels responsive (no lag on input)
- [ ] Filter results are correct

---

### 5.3 Add Pagination to Projects Fetching

**Problem:** `fetchProjects()` loads ALL projects with no limit. As the portfolio grows, this becomes slower.

**Affected files:**

| File | Change |
|---|---|
| `src/services/projectsService.js` | Add `limit` and `offset` parameters |
| `src/context/ProjectsContext.jsx` | Support paginated loading |
| `src/pages/portfolio-gallery/index.jsx` | Add "Load More" button or infinite scroll |

**Approach — simple limit + "Load More":**

1. **Service:**
   ```js
   export const fetchProjects = async (filters = {}, pagination = {}) => {
     const { limit = 20, offset = 0 } = pagination;
     let query = supabase
       .from('projects')
       .select('*', { count: 'exact' })
       .order('created_at', { ascending: false })
       .range(offset, offset + limit - 1);
     // ... filters ...
   };
   ```

2. **Context:**
   ```js
   const loadMore = async () => {
     const result = await fetchProjects(filters, { offset: projects.length, limit: 10 });
     if (result.success) {
       setProjects(prev => [...prev, ...result.data]);
     }
   };
   ```

3. **Page:**
   ```jsx
   {hasMore && (
     <button onClick={loadMore} className="btn-primary">
       Load More Projects
     </button>
   )}
   ```

**Acceptance criteria:**
- [ ] Initial load fetches max 20 projects
- [ ] "Load More" button fetches next 10
- [ ] All projects still accessible via pagination

---

### 5.4 Memoize All Context Provider Values

**Problem:** Context `value` objects are recreated on every render, causing all consumers to re-render even when the data hasn't changed.

**Affected files:** All 6 context files.

**Fix for each context:**
```js
// BEFORE:
const value = {
  projects, loading, error, loadProjects, addProject, ...
};

// AFTER:
const value = useMemo(() => ({
  projects, loading, error, loadProjects, addProject, ...
}), [projects, loading, error, loadProjects, addProject, ...]);
```

**Contexts to fix:**

| Context | Value dependencies |
|---|---|
| `AuthContext` | `user`, `session`, `loading`, `isConfigured`, `signIn`, `signOut`, `signUp` |
| `ToastContext` | `toasts`, `addToast`, `removeToast`, `success`, `error`, `warning`, `info` |
| `PortfolioSettingsContext` | `settings`, `isLoading`, `error`, `loadSettings`, `updateSettings`, `profile`, `socialLinks`, `siteSettings`, `seoSettings` |
| `SkillsContext` | `skillCategories`, `techStack`, `loading`, `error`, `useSupabase`, + all CRUD methods |
| `ProjectsContext` | `projects`, `loading`, `error`, `useSupabase`, + all CRUD methods |
| `ThemeContext` | Already uses `useMemo` ✅ |

**Acceptance criteria:**
- [ ] All context values wrapped in `useMemo`
- [ ] No unnecessary re-renders (verify with React DevTools Profiler)
- [ ] Function dependencies included in dependency arrays

---

### 5.5 Lazy-Load Recharts

**Problem:** Recharts (~200KB) is bundled into the admin dashboard chunk. Since it's admin-only, it should be split.

**Affected file:** `src/pages/admin-dashboard/components/PerformanceCharts.jsx`

**Approach:** The component is already lazy-loaded via `Routes.jsx`:
```js
const AdminDashboard = lazy(() => import("pages/admin-dashboard"));
```

However, `PerformanceCharts` is eagerly imported inside `AdminDashboard`:
```js
import PerformanceCharts from './components/PerformanceCharts';
```

**Fix — dynamic import inside AdminDashboard:**
```js
import React, { Suspense, lazy } from 'react';
const PerformanceCharts = lazy(() => import('./components/PerformanceCharts'));

// In render:
<Suspense fallback={<div className="h-[300px] flex items-center justify-center">Loading chart...</div>}>
  <PerformanceCharts data={chartData} />
</Suspense>
```

**Acceptance criteria:**
- [ ] Recharts not in initial bundle
- [ ] Chart loads on demand when visiting admin dashboard
- [ ] Loading fallback shown while chart loads

---

### 5.6 Add `loading="lazy"` to AppImage

**Problem:** `AppImage` renders all images eagerly, including below-fold images in galleries and case studies.

**Affected file:** `src/components/AppImage.jsx`

**Fix:**
```jsx
function Image({
  src,
  alt = "Image Name",
  className = "",
  loading = "lazy",  // <-- default lazy
  ...props
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={(e) => {
        e.target.src = "/assets/images/no_image.png"
      }}
      {...props}
    />
  );
}
```

**Acceptance criteria:**
- [ ] All images use `loading="lazy"` by default
- [ ] Hero images can override with `loading="eager"`
- [ ] Lighthouse image lazy-loading audit passes

---

### 5.7 Parallelize SkillsContext Fetches

**Problem:** `fetchAllSkillsData()` makes 3 sequential Supabase queries. Each query waits for the previous to complete.

**Affected file:** `src/services/skillsService.js`

**Current (sequential):**
```js
export const fetchAllSkillsData = async () => {
  const categoriesResult = await fetchSkillCategories();  // Query 1
  if (!categoriesResult.success) return categoriesResult;

  const skillsResult = await fetchSkills();                // Query 2
  if (!skillsResult.success) return skillsResult;

  const techStackResult = await fetchTechStack();          // Query 3
  if (!techStackResult.success) return techStackResult;
  // ...
};
```

**Fixed (parallel):**
```js
export const fetchAllSkillsData = async () => {
  const [categoriesResult, skillsResult, techStackResult] = await Promise.all([
    fetchSkillCategories(),
    fetchSkills(),
    fetchTechStack(),
  ]);

  if (!categoriesResult.success) return categoriesResult;
  if (!skillsResult.success) return skillsResult;
  if (!techStackResult.success) return techStackResult;
  // ...
};
```

**Result:** 3 queries in parallel instead of sequential → ~3x faster load.

**Acceptance criteria:**
- [ ] Skills data loads faster (measure with Network tab)
- [ ] Error handling still works for individual query failures
- [ ] Data grouping by category still correct

---

### 5.8 Reduce Chunk Warning Limit

**After all above optimizations, lower the warning threshold to catch future regressions.**

**File:** `vite.config.mjs`

```js
// BEFORE:
build: {
  chunkSizeWarningLimit: 2000,
},

// AFTER:
build: {
  chunkSizeWarningLimit: 500,
},
```

**Acceptance criteria:**
- [ ] Build succeeds with no chunk size warnings at 500KB
- [ ] If warnings appear, investigate and fix the specific chunk

---

## Phase 6: UX Improvements

> Polish the experience for both visitors and the admin.

---

### 6.1 Add Dark Mode to AboutStory Page

**Problem:** AboutStory uses hardcoded light-mode colors in many sections:

| Current Class | Should Be |
|---|---|
| `bg-white` | `bg-surface dark:bg-background` |
| `bg-primary-50` | `bg-primary-50 dark:bg-primary-900/30` |
| `text-primary-800` | Already OK (uses CSS variable) |
| `text-secondary-600` | Already OK (uses CSS variable) |
| `bg-accent-50` | `bg-accent-50 dark:bg-accent-900/30` |

**Affected file:** `src/pages/about-story/index.jsx`

**Approach:** Systematic find-and-replace for all hardcoded light colors. Audit each section:
- Hero section
- Philosophy section
- Values section
- Timeline section
- Skills section
- Interests section

**Acceptance criteria:**
- [ ] All sections readable in dark mode
- [ ] No white backgrounds in dark mode
- [ ] No washed-out text in dark mode
- [ ] Visual design consistent with rest of app

---

### 6.2 Add Empty States for SkillsManager

**Problem:** When no skill categories exist, the Categories tab is blank. When no tech stack exists, the Tech Stack tab is blank.

**Affected file:** `src/pages/admin-dashboard/components/SkillsManager.jsx`

**Create new component:** `src/components/ui/EmptyState.jsx`

```jsx
import React from 'react';
import Icon from 'components/AppIcon';

const EmptyState = ({ icon, title, description, actionLabel, onAction }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon name={icon} size={32} className="text-secondary-400" />
    </div>
    <h3 className="text-xl font-bold text-primary-800 dark:text-primary-200 mb-2">{title}</h3>
    {description && (
      <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">{description}</p>
    )}
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary inline-flex items-center gap-2">
        <Icon name="Plus" size={18} />
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
```

**Use in SkillsManager:**
```jsx
{Object.keys(skillCategories).length === 0 ? (
  <EmptyState
    icon="Code2"
    title="No skill categories yet"
    description="Start organizing your skills into categories like Frontend, Backend, and Tools."
    actionLabel="Add Category"
    onAction={openCategoryModal}
  />
) : (
  // existing grid
)}
```

**Acceptance criteria:**
- [ ] Empty state shows when no categories exist
- [ ] Empty state shows when no tech stack items exist
- [ ] CTA button opens the add modal
- [ ] Reusable EmptyState component created

---

### 6.3 Toast Pause-on-Hover + Max Stack

**Problem:** Toasts auto-dismiss even when the user is reading them. Too many rapid toasts can overflow the screen.

**Affected files:**

| File | Change |
|---|---|
| `src/context/ToastContext.jsx` | Add pause/resume on hover |
| `src/components/Toast.jsx` | Limit visible toasts to 5 |

**Approach — max stack in Toast.jsx:**
```jsx
const MAX_VISIBLE_TOASTS = 5;
const visibleToasts = toasts.slice(-MAX_VISIBLE_TOASTS);

{visibleToasts.map((toast) => (
  <motion.div key={toast.id} ... />
))}
```

**Approach — pause-on-hover in Toast.jsx:**
```jsx
const [pausedIds, setPausedIds] = useState(new Set());

const handleMouseEnter = (id) => {
  setPausedIds(prev => new Set(prev).add(id));
  // Clear the existing timeout (need to store it in a ref)
};

const handleMouseLeave = (id) => {
  setPausedIds(prev => {
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
  // Restart the timeout
};

// On each toast:
<div
  onMouseEnter={() => handleMouseEnter(toast.id)}
  onMouseLeave={() => handleMouseLeave(toast.id)}
>
```

**Note:** This requires restructuring how timeouts are stored in `ToastContext` (see Phase 3.1 — already tracking timeout IDs).

**Acceptance criteria:**
- [ ] Maximum 5 toasts visible at once
- [ ] Hovering a toast pauses its auto-dismiss timer
- [ ] Moving mouse away resumes timer
- [ ] Oldest toasts are dropped when max is exceeded

---

### 6.4 Add ARIA Labels to Icon-Only Buttons

**Problem:** Many buttons contain only an `<Icon>` with no text, making them inaccessible to screen readers.

**Affected locations:**

| Location | Buttons |
|---|---|
| `PortfolioGallery` | Eye, ExternalLink, Github overlay buttons |
| `SkillsManager` | Edit, Delete, Add skill icon buttons |
| `Header` | Theme toggle, mobile menu toggle |
| `Toast` | Dismiss (X) button |
| `AdminLayout` | Sidebar toggle |

**Fix pattern:**
```jsx
// BEFORE:
<button onClick={() => setSelectedProject(project)}>
  <Icon name="Eye" size={20} />
</button>

// AFTER:
<button
  onClick={() => setSelectedProject(project)}
  aria-label={`View details for ${project.title}`}
  title={`View details for ${project.title}`}
>
  <Icon name="Eye" size={20} />
</button>
```

**Acceptance criteria:**
- [ ] Every icon-only button has `aria-label`
- [ ] Screen reader announces button purpose
- [ ] `title` attribute provides tooltip on hover

---

### 6.5 Add Focus Trap to Modals

**Problem:** When a modal is open, Tab key moves focus outside the modal to background elements. This is confusing for keyboard users.

**Affected modals:**
- SkillsManager: Category, Skill, Tech modals (3 modals)
- PortfolioGallery: Project preview modal

**Approach — `useFocusTrap` hook:**

```js
// src/hooks/useFocusTrap.js
import { useEffect, useRef } from 'react';

export const useFocusTrap = (isActive) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const modal = ref.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    // Focus first element on open
    firstEl?.focus();

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [isActive]);

  return ref;
};
```

**Usage in Modal component (from 4.1):**
```js
const modalRef = useFocusTrap(isOpen);
```

**Acceptance criteria:**
- [ ] Tab key cycles within modal only
- [ ] Shift+Tab works in reverse
- [ ] First focusable element receives focus on open
- [ ] Focus returns to trigger element on close

---

### 6.6 Add Breadcrumb Navigation in Admin Sub-Pages

**Problem:** When deep in admin (e.g., Skills Manager), there's no indication of where you are or quick way back.

**New component:** `src/components/ui/Breadcrumb.jsx`

```jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';

const Breadcrumb = ({ items }) => {
  // items = [{ label: 'Dashboard', href: '/admin-dashboard' }, { label: 'Skills' }]
  return (
    <nav className="flex items-center gap-2 text-sm text-secondary-600 mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={item.href || item.label}>
          {index > 0 && <Icon name="ChevronRight" size={14} />}
          {item.href ? (
            <Link to={item.href} className="hover:text-accent transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary-800 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
```

**Add to admin sub-pages:**
```jsx
// SkillsManager.jsx
<Breadcrumb items={[
  { label: 'Dashboard', href: '/admin-dashboard' },
  { label: 'Skills Manager' },
]} />
```

**Acceptance criteria:**
- [ ] Breadcrumb shows on all admin sub-pages
- [ ] All items except last are clickable links
- [ ] Last item is plain text (current page)

---

### 6.7 Add Skeleton Loaders to More Pages

**Currently only PortfolioGallery has skeleton loaders.** Add to:

**CaseStudyDetail** (`src/pages/case-study-detail/index.jsx`):
```jsx
if (isLoading) {
  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Skeleton height={40} className="w-3/4 mb-4" />
        <Skeleton height={20} className="w-1/2 mb-8" />
        <SkeletonImage aspectRatio="21/9" className="mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkeletonText lines={4} />
          </div>
          <Skeleton height={300} rounded="xl" />
        </div>
      </div>
    </div>
  );
}
```

**AdminDashboard** (`src/pages/admin-dashboard/index.jsx`):
```jsx
if (isLoading) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonMetricCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Skeleton height={300} rounded="xl" />
        <Skeleton height={300} rounded="xl" />
      </div>
    </div>
  );
}
```

**Acceptance criteria:**
- [ ] CaseStudyDetail shows skeleton while loading
- [ ] AdminDashboard shows metric card skeletons while loading
- [ ] No layout shift when content replaces skeletons

---

## Phase 7: Move Hardcoded Content to CMS

> Make everything editable from the admin dashboard.

---

### 7.1 AboutStory → PortfolioSettingsContext

**Current:** All content in `about-story/index.jsx` is hardcoded — personalInfo, timelineData, skillsData, valuesData, personalInterests.

**Proposed schema extension for `portfolio_settings.profile` (jsonb):**

```json
{
  "full_name": "Moataz Mohammed",
  "title": "Backend Engineer",
  "tagline": "...",
  "bio": "...",
  "philosophy": "I believe in thoughtful digital craftsmanship...",
  "mission": "To create digital experiences...",
  "availability": "available",
  "avatar": "https://...",
  "cv_url": "https://...",
  "email": "...",
  "phone": "...",
  "location": "Assiut, Egypt",
  "experience_years": 1,
  "projects_delivered": 2
}
```

**New jsonb field: `portfolio_settings.career_data`:**

```json
{
  "timeline": [
    {
      "id": "uuid",
      "year": "2025",
      "title": "Bachelor's degree in Information Technology",
      "company": "Egyptian E-Learning University",
      "type": "education",
      "description": "...",
      "achievements": ["Graduate with distinction"],
      "technologies": ["Java", "C#", "Python"]
    }
  ],
  "values": [
    {
      "id": "uuid",
      "icon": "Heart",
      "title": "User-Centric Design",
      "description": "...",
      "example": "..."
    }
  ],
  "interests": [
    {
      "id": "uuid",
      "icon": "Camera",
      "title": "Photography",
      "description": "..."
    }
  ]
}
```

**Steps:**
1. Add `career_data` jsonb column to `portfolio_settings` table
2. Update `PortfolioSettingsContext` to read/write `career_data`
3. Create admin UI tab in SettingsManager for timeline, values, interests
4. Refactor `about-story/index.jsx` to read from context instead of hardcoded data
5. Remove all hardcoded arrays from AboutStory

**Acceptance criteria:**
- [ ] AboutStory renders from context data
- [ ] Admin can edit timeline entries in Settings Manager
- [ ] Admin can edit values and interests in Settings Manager
- [ ] All hardcoded data removed from AboutStory

---

### 7.2 HeroSection Stats → PortfolioSettingsContext

**Current:** "2+ Years Experience" and "2+ Projects Delivered" are hardcoded in `HeroSection.jsx`.

**Already available in context:**
- `profile.experience_years` (add this field)
- Projects count can be computed from `ProjectsContext.projects.length`

**Steps:**
1. Add `experience_years` to `profile` settings in admin
2. Update `HeroSection` to read from context:
   ```jsx
   const { profile } = usePortfolioSettings();
   const { projects } = useProjects();

   <div className="text-2xl font-bold text-accent-500">
     {profile.experience_years}+ Years Experience
   </div>
   <div className="text-2xl font-bold text-accent-500">
     {projects.length} Projects Delivered
   </div>
   ```

**Acceptance criteria:**
- [ ] Stats no longer hardcoded
- [ ] Projects count is accurate and auto-updates
- [ ] Experience years editable in admin settings

---

### 7.3 AdminDashboard Hardcoded Stats → Real Data

**Current:** "Pending Comments: 7" and "Active Projects: 5" are hardcoded numbers.

**Steps:**
1. Replace "Active Projects: 5" with `projects.filter(p => p.publishing_status === 'published').length`
2. Remove "Pending Comments: 7" entirely (blog feature doesn't exist)
3. Or replace with something meaningful, like "Skills: X categories" from SkillsContext

**Acceptance criteria:**
- [ ] No hardcoded numbers in AdminDashboard
- [ ] Metrics reflect real data from contexts
- [ ] Comment count removed or replaced with real metric

---

## Phase 8: Security Hardening

> Lock things down before going live.

---

### 8.1 Document RLS Policies as SQL Migration

**Problem:** RLS policies exist only in the Supabase dashboard. If the database is recreated, all policies are lost.

**New file:** `supabase/migrations/001_initial_schema.sql`

**Contents:**

```sql
-- =====================================================
-- Portfolio Database Schema & RLS Policies
-- Run this in Supabase SQL Editor to set up the database
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PORTFOLIO SETTINGS (single-row configuration)
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile jsonb DEFAULT '{}'::jsonb,
  social_links jsonb DEFAULT '{}'::jsonb,
  site_settings jsonb DEFAULT '{}'::jsonb,
  seo_settings jsonb DEFAULT '{}'::jsonb,
  career_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portfolio settings"
  ON portfolio_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update portfolio settings"
  ON portfolio_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert portfolio settings"
  ON portfolio_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- 2. PROJECTS
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  hero_images jsonb DEFAULT '[]'::jsonb,
  screenshots jsonb DEFAULT '[]'::jsonb,
  mockups jsonb DEFAULT '[]'::jsonb,
  problem text,
  solution text,
  results text,
  testimonials jsonb DEFAULT '[]'::jsonb,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published public projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (publishing_status = 'published' AND visibility = 'public');

CREATE POLICY "Authenticated users can read all projects"
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
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- 3. SKILL CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  title text NOT NULL,
  icon text,
  color text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read skill categories"
  ON skill_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage skill categories"
  ON skill_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 4. SKILLS
-- =====================================================
CREATE TABLE IF NOT EXISTS skills (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id uuid REFERENCES skill_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  level integer DEFAULT 50,
  icon text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 5. TECH STACK
-- =====================================================
CREATE TABLE IF NOT EXISTS tech_stack (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tech stack"
  ON tech_stack FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tech stack"
  ON tech_stack FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 6. CONTACT SUBMISSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);
```

**Acceptance criteria:**
- [ ] SQL migration file exists at `supabase/migrations/001_initial_schema.sql`
- [ ] All tables, columns, and RLS policies documented
- [ ] File can be run in Supabase SQL editor to recreate full schema
- [ ] Policies match current dashboard configuration

---

### 8.2 Add Forgot Password Flow

**New file:** `src/pages/forgot-password/index.jsx`

**Design:**
```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { supabase } from 'lib/supabase';
import { useToast } from 'context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setIsSent(true);
      toast.success('Password reset email sent!');
    }

    setIsLoading(false);
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <Icon name="Mail" size={48} className="text-accent mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-800 mb-4">Check Your Email</h1>
          <p className="text-secondary-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>.
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            <Icon name="ArrowLeft" size={18} />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 px-4">
      {/* Similar to Login page but with email field only */}
    </div>
  );
};

export default ForgotPassword;
```

**Add route in `Routes.jsx`:**
```js
const ForgotPassword = lazy(() => import("pages/forgot-password"));
// ...
<Route path="/forgot-password" element={<ForgotPassword />} />
```

**Add link on Login page:**
```jsx
<Link to="/forgot-password" className="text-sm text-accent hover:underline">
  Forgot your password?
</Link>
```

**Acceptance criteria:**
- [ ] Forgot password page exists and is reachable
- [ ] Submitting email sends reset link via Supabase
- [ ] Success state shows confirmation
- [ ] Link to forgot password on login page
- [ ] Reset link redirects back to login

---

### 8.3 Add Confirmation Dialogs for Destructive Actions

**Problem:** Currently uses `window.confirm()` for delete/publish actions. This works but is not user-friendly and blocks the main thread.

**Affected locations:**

| Location | Action |
|---|---|
| `ProjectsManager.jsx` | Delete project, publish/unpublish, toggle featured |
| `SkillsManager.jsx` | Delete category, delete skill, delete tech, reset defaults |

**Approach — improve `window.confirm()` messages first (quick win):**

```js
// BEFORE:
if (window.confirm('Are you sure you want to delete this?'))

// AFTER:
const confirmed = window.confirm(
  `Delete "${project.title}"?\n\nThis action cannot be undone. All images and data will be permanently removed.`
);
```

**Future improvement (Phase 7+):** Replace with a proper confirmation dialog component:

```jsx
<ConfirmDialog
  isOpen={showDeleteConfirm}
  title="Delete Project"
  message={`Are you sure you want to delete "${project.title}"? This cannot be undone.`}
  confirmLabel="Delete"
  confirmVariant="danger"
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteConfirm(false)}
/>
```

**Acceptance criteria:**
- [ ] All confirmation messages are descriptive and specific
- [ ] User knows exactly what will be deleted/changed
- [ ] Irreversible actions are clearly communicated

---

## Execution Order Summary

| Phase | Name | Tasks | Est. Impact | Est. Effort |
|---|---|---|---|---|
| **1** | Critical Fixes | 4 tasks (dynamic classes, project edit, SEO, contact form) | 🔴 Critical | Medium-High |
| **2** | Dead Code Removal | 6 tasks (debug files, unused deps, blog remnants, test scripts) | 🟡 Medium | Low |
| **3** | Memory & Bugs | 3 tasks (toast leak, scroll passive, verify contact cleanup) | 🟡 Medium | Low |
| **4** | Code Extraction | 4 tasks (Modal, FormField, page structure, useSupabaseQuery) | 🟡 Medium | Medium |
| **5** | Performance | 7 tasks (reduced motion, debounce, pagination, memo, lazy-load, lazy images, parallel fetch, chunk limit) | 🟢 High | Medium |
| **6** | UX Polish | 7 tasks (dark mode, empty states, toast UX, ARIA, focus trap, breadcrumbs, skeletons) | 🟢 High | Medium |
| **7** | CMS Migration | 3 tasks (AboutStory, HeroStats, AdminDashboard) | 🟡 Medium | High |
| **8** | Security | 3 tasks (RLS docs, forgot password, confirmation dialogs) | 🔴 Critical | Low-Medium |

**Recommended approach:** Work through phases sequentially. Commit after each sub-task. Test the build after each phase completes.

---

*Generated 2026-04-04. Update this file as tasks are completed.*
