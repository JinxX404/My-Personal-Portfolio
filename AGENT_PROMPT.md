# ROLE

You are a senior frontend engineer and technical lead. You have been given two reference documents in the project root. Read BOTH before writing any code:

1. `CONTEXT.md` — Complete codebase reference (architecture, state, routing, styling, data layer, known issues)
2. `REFACTOR_PLAN.md` — 47-task refactoring plan in 8 phases with acceptance criteria

Project root: `P:\Projects\My Portfolio`

---

# RULES

1. **Work phase by phase in order.** Do NOT skip phases. Do NOT mix tasks from different phases.
2. **Complete ALL sub-tasks within a phase** before moving to the next phase.
3. **Commit to git after each sub-task** with a clear, descriptive commit message.
4. **Run `npm run build` after each sub-task** to verify no build errors.
5. **Run `npm start` (dev server)** and verify the app loads in browser after each phase completes.
6. **Push to GitHub after each phase** completes successfully (build passes + app runs).
7. If a sub-task breaks the build, **fix it before moving to the next sub-task**.
8. Do NOT add new features. Only refactor per the plan.
9. If the plan references a file that doesn't exist, skip that sub-task and note it.
10. Use `git status && git diff HEAD --staged` to review staged changes before each commit.
11. Match the existing commit message style (review `git log -n 5` for format).
12. After every `npm run build`, check for chunk size warnings — report them.

---

# GIT WORKFLOW (every sub-task)

```
cd "P:\Projects\My Portfolio"
git status
git add <changed files>
git commit -m "<phase_number>.<task_number>: <concise description>"
```

After each **full phase** (all sub-tasks done, build passes, app verified):

```
git push origin <current-branch>
```

If the push fails because the branch doesn't exist remotely:

```
git push -u origin <current-branch>
```

---

# TESTING CHECKLIST (after every sub-task)

Run: `npm run build`

Check:
- [ ] Build succeeds with exit code 0
- [ ] No compilation errors in output
- [ ] Note any chunk size warnings (report the sizes)

After every **full phase** (before pushing):
- [ ] `npm start` — dev server boots on port 4028
- [ ] Navigate to `/` — homepage loads
- [ ] Navigate to `/portfolio-gallery` — gallery loads
- [ ] Navigate to `/about-story` — about loads
- [ ] Navigate to `/contact-hub` — contact loads
- [ ] If Phase 2+ has been completed: verify deleted files don't cause import errors
- [ ] If Phase 6+: check dark mode toggle works on refactored pages

---

# PHASE-BY-PHASE INSTRUCTIONS

## PHASE 1: Critical Fixes

### 1.1 — Fix Dynamic Tailwind Classes
- Audit all `bg-${...}`, `text-${...}`, `border-${...}` patterns across the codebase
- Add all discovered dynamic class combinations to `safelist` in `tailwind.config.js`
- Build and verify colors render correctly

### 1.2 — Fix ProjectManager Editing
- Add `useSearchParams()` to read `?id=` param
- Load existing project data when `id` is present
- Switch between `addProject()` and `editProject()` based on presence of `id`
- Update UI labels ("Create" vs "Edit", "Publish" vs "Update")
- Test: create new project → works. Edit existing project → loads data → saves changes

### 1.3 — Implement SEO Meta Tags
- Add `<Helmet>` to `Layout.jsx` with defaults from `PortfolioSettingsContext`
- Add page-specific `<Helmet>` overrides on each page
- Render `og:image`, `twitter:card`, `google-site-verification` when configured
- Test: view page source → verify meta tags present

### 1.4 — Fix ContactForm Backend
- Create `contact_submissions` table in Supabase (run SQL from plan or create manually)
- Create `src/services/contactService.js` with `submitContactForm(data)`
- Replace simulated submission in `ContactForm.jsx` with actual Supabase INSERT
- Add error handling with user-friendly toast messages
- Test: submit form → verify row created in Supabase

---

## PHASE 2: Remove Dead Code

### 2.1 — Delete debug files
- Delete `src/pages/DebugPage.jsx`, `src/pages/DebugSupabase.jsx`, `src/debug/supabaseTest.js`, `src/debug/` folder
- Grep for any remaining references, remove them

### 2.2 — Remove component-tagger
- Remove `tagger` import and from plugins array in `vite.config.mjs`
- Remove from `package.json` dependencies

### 2.3 — Remove unused dependencies
- Remove from `package.json`: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `axios`, `react-router-hash-link`, `react-hook-form`, `tailwindcss-animate`, `tailwindcss-elevation`, `tailwindcss-fluid-type`
- Run `npm install`
- Run `npm run build` to verify nothing breaks

### 2.4 — Remove orphaned admin components
- Grep each component for imports
- Delete truly unused ones
- Clean up `RecentActivity` no-op props if kept

### 2.5 — Remove blog remnants
- Remove `blogSchema`, `blogCreateSchema`, `blogUpdateSchema` from `validation.js`
- Remove `SkeletonBlogPost` from `Skeleton.jsx`
- Keep `fetchProjectBySlug` only if actually imported somewhere

### 2.6 — Clean up test scripts
- Remove `test:blogs`, `test:blogs-manager`, `test:blog-detail`, `test:report` from `package.json` scripts

---

## PHASE 3: Memory Leak & Bug Fixes

### 3.1 — Fix ToastContext setTimeout leak
- Add `useRef(new Map())` for timeout tracking
- Store each timeout ID in the map
- Clear specific timeout on `removeToast`
- Clear ALL timeouts in cleanup `useEffect`

### 3.2 — Verify ContactForm timeout cleanup
- Confirm the existing cleanup `useEffect` is correct
- If correct, no changes needed

### 3.3 — Add passive: true to scroll listeners
- Add `{ passive: true }` to every `addEventListener('scroll', ...)` call

---

## PHASE 4: Code Extraction & DRY

### 4.1 — Extract Modal component
- Create `src/components/ui/Modal.jsx` with the design from the plan
- Replace all 3 modals in `SkillsManager.jsx` with `<Modal>` usage
- Verify modals open, close, submit correctly

### 4.2 — Extract FormField component
- Create `src/components/ui/FormField.jsx` with the design from the plan
- Refactor at least 2 settings tabs to use it
- Verify form inputs render, validate, and display errors correctly

### 4.3 — Standardize page structure
- Move `NotFound.jsx` → `not-found/index.jsx`
- Update import in `Routes.jsx`

### 4.4 — Create useSupabaseQuery hook
- Create `src/hooks/useSupabaseQuery.js` with the design from the plan
- Use it in at least one page component to verify it works
- Do NOT migrate all contexts yet — just prove the hook works

---

## PHASE 5: Performance Optimizations

### 5.1 — Add prefers-reduced-motion
- Create `src/hooks/useReducedMotion.js`
- Check both system preference AND `siteSettings.enable_animations`
- Apply to at least one page with heavy animations (homepage or about-story)

### 5.2 — Debounce PortfolioGallery search
- Import and use existing `useDebounce` hook
- Replace `searchQuery` with `debouncedSearch` in filter logic
- Test: typing feels smooth, results update after 300ms delay

### 5.3 — Add pagination to projects
- Add `.limit(20)` and `.range()` to `fetchProjects()`
- Add "Load More" button in PortfolioGallery
- Test: initial load is fast, more projects load on button click

### 5.4 — Memoize context provider values
- Wrap `value` in `useMemo()` in ALL context providers except ThemeContext (already done)
- Include all dependencies in dependency arrays
- Test: no unnecessary re-renders

### 5.5 — Lazy-load Recharts
- Make `PerformanceCharts` a lazy import inside `AdminDashboard`
- Wrap in `Suspense` with loading fallback

### 5.6 — Add loading="lazy" to AppImage
- Add `loading="lazy"` as default prop in `AppImage.jsx`
- Ensure hero images can override with `loading="eager"`

### 5.7 — Parallelize SkillsContext fetches
- Replace sequential `await` calls with `Promise.all()` in `fetchAllSkillsData()`
- Test: skills load faster, data groups correctly

### 5.8 — Reduce chunk warning limit
- Change `chunkSizeWarningLimit` from 2000 to 500 in `vite.config.mjs`
- Build and verify no warnings

---

## PHASE 6: UX Improvements

### 6.1 — Add dark mode to AboutStory
- Replace all hardcoded `bg-white`, `bg-primary-50`, `bg-accent-50` with dark-mode-aware classes
- Test: toggle dark mode → AboutStory looks correct

### 6.2 — Add empty states for SkillsManager
- Create `src/components/ui/EmptyState.jsx`
- Show empty state when no categories or tech stack exist
- Test: add category → empty state disappears

### 6.3 — Toast pause-on-hover + max stack
- Limit visible toasts to 5 in `Toast.jsx`
- Add mouse enter/leave handlers to pause/resume auto-dismiss
- Test: rapid toasts don't overflow, hovering pauses dismissal

### 6.4 — Add ARIA labels to icon-only buttons
- Audit all buttons containing only `<Icon>` elements
- Add `aria-label` and `title` to each
- Test with browser dev tools accessibility audit

### 6.5 — Add focus trap to modals
- Create `src/hooks/useFocusTrap.js` with the design from the plan
- Apply to Modal component (which SkillsManager uses) and PortfolioGallery preview modal
- Test: Tab key stays within modal, Escape closes

### 6.6 — Add breadcrumb navigation in admin
- Create `src/components/ui/Breadcrumb.jsx`
- Add breadcrumbs to SkillsManager, ProjectsManager, SettingsManager, ProjectManager
- Test: clicking breadcrumb items navigates correctly

### 6.7 — Add skeleton loaders
- Add skeleton loading state to `CaseStudyDetail` page
- Add skeleton loading state to `AdminDashboard`
- Test: slow network simulation shows skeletons, not spinners

---

## PHASE 7: CMS Migration

### 7.1 — AboutStory → PortfolioSettingsContext
- Add `career_data` jsonb column to `portfolio_settings` (run ALTER TABLE or include in migration)
- Update `PortfolioSettingsContext` to handle `career_data`
- Create admin UI tab in SettingsManager for timeline/values/interests
- Refactor `about-story/index.jsx` to read from context
- Remove all hardcoded arrays

### 7.2 — HeroSection stats → context
- Add `experience_years` to profile settings
- Use `ProjectsContext.projects.length` for project count
- Remove hardcoded stats from HeroSection

### 7.3 — AdminDashboard hardcoded stats → real data
- Replace hardcoded numbers with actual counts from contexts
- Remove "Pending Comments" entirely (no blog feature)

---

## PHASE 8: Security Hardening

### 8.1 — Document RLS policies
- Create `supabase/migrations/001_initial_schema.sql` with the full SQL from the plan
- Include all tables, columns, RLS policies

### 8.2 — Add forgot password flow
- Create `src/pages/forgot-password/index.jsx`
- Add route in `Routes.jsx`
- Add "Forgot password?" link on login page
- Test: submit email → Supabase sends reset link

### 8.3 — Improve confirmation dialogs
- Replace generic `window.confirm()` messages with descriptive, action-specific messages
- Include item name and irreversibility warning

---

# AFTER ALL PHASES COMPLETE

1. Run `npm run build` one final time
2. Verify build passes with no errors and no chunk warnings at 500KB limit
3. Push final changes to GitHub
4. Print a summary of:
   - Total commits made
   - Any sub-tasks that were skipped and why
   - Any remaining issues or warnings from the build
   - Final `node_modules` size vs original (if known)

---

# IMPORTANT REMINDERS

- Use `agent` tool with subagent_type "Explore" if you need to search for patterns (e.g., grep all `bg-$` patterns)
- Use `read_file` before editing any file you haven't read
- Use `edit` tool for targeted replacements — do NOT rewrite entire files unless necessary
- Use `run_shell_command` for `npm run build`, `npm install`, git commands
- After each `npm run build`, check the output for errors AND warnings
- If stuck on a sub-task for more than 2 attempts, skip it and note why in the final summary

Start with Phase 1 now.
