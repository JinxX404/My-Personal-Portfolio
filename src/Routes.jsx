// src/Routes.jsx
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useParams } from "react-router-dom";
import Layout from "components/Layout";
import AdminLayout from "components/AdminLayout";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import RequireAuth from "components/RequireAuth";
import { pageLoaders, prefetchPublicPagesWhenIdle } from "lib/routeChunks";

// Lazy-loaded page imports for code splitting
const Homepage = lazy(pageLoaders.home);
const PortfolioGallery = lazy(pageLoaders.projects);
const CaseStudyDetail = lazy(pageLoaders.project);
const AboutStory = lazy(pageLoaders.about);
const ContactHub = lazy(pageLoaders.contact);
const Login = lazy(() => import("pages/login"));
const ForgotPassword = lazy(() => import("pages/forgot-password"));
const NotFound = lazy(() => import("pages/not-found"));

// Admin pages (protected)
const AdminDashboard = lazy(() => import("pages/admin-dashboard"));
const ProjectManager = lazy(() => import("pages/project-manager"));
const SkillsManager = lazy(() => import("pages/admin-dashboard/components/SkillsManager"));
const ProjectsManager = lazy(() => import("pages/admin-dashboard/components/ProjectsManager"));
const SettingsManager = lazy(() => import("pages/admin-dashboard/components/SettingsManager"));

const MessagesManager = lazy(() => import("pages/admin-dashboard/components/MessagesManager"));

// Old project URLs keep working but send visitors to the canonical address.
const LegacyProjectRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/projects/${id}`} replace />;
};

// Shown only on the very first page load. Later navigations run as React
// transitions (see `future` below), so the current page stays on screen until
// the next one is ready instead of being swapped for this spinner.
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background pt-20" role="status" aria-label="Loading">
    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Routes = () => {
  useEffect(() => {
    prefetchPublicPagesWhenIdle();
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <ErrorBoundary>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <RouterRoutes>
              {/* Public routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/homepage" element={<Navigate to="/" replace />} />
              <Route path="/projects" element={<PortfolioGallery />} />
              <Route path="/portfolio-gallery" element={<Navigate to="/projects" replace />} />
              <Route path="/projects/:id" element={<CaseStudyDetail />} />
              <Route path="/case-study-detail/:id" element={<LegacyProjectRedirect />} />
              <Route path="/about-story" element={<AboutStory />} />
              <Route path="/contact-hub" element={<ContactHub />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected admin routes */}
              <Route path="/admin-dashboard" element={
                <RequireAuth>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </RequireAuth>
              } />
              <Route path="/project-manager" element={
                <RequireAuth>
                  <ProjectManager />
                </RequireAuth>
              } />
              <Route path="/skills-manager" element={
                <RequireAuth>
                  <AdminLayout>
                    <SkillsManager />
                  </AdminLayout>
                </RequireAuth>
              } />
              <Route path="/projects-manager" element={
                <RequireAuth>
                  <AdminLayout>
                    <ProjectsManager />
                  </AdminLayout>
                </RequireAuth>
              } />
              <Route path="/messages-manager" element={
                <RequireAuth>
                  <AdminLayout>
                    <MessagesManager />
                  </AdminLayout>
                </RequireAuth>
              } />
              <Route path="/settings-manager" element={
                <RequireAuth>
                  <AdminLayout>
                    <SettingsManager />
                  </AdminLayout>
                </RequireAuth>
              } />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </Suspense>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
