// src/Routes.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import Layout from "components/Layout";
import AdminLayout from "components/AdminLayout";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import RequireAuth from "components/RequireAuth";

// Lazy-loaded page imports for code splitting
const Homepage = lazy(() => import("pages/homepage"));
const PortfolioGallery = lazy(() => import("pages/portfolio-gallery"));
const CaseStudyDetail = lazy(() => import("pages/case-study-detail"));
const AboutStory = lazy(() => import("pages/about-story"));
const ContactHub = lazy(() => import("pages/contact-hub"));
const Login = lazy(() => import("pages/login"));

// Admin pages (protected)
const AdminDashboard = lazy(() => import("pages/admin-dashboard"));
const ProjectManager = lazy(() => import("pages/project-manager"));
const SkillsManager = lazy(() => import("pages/admin-dashboard/components/SkillsManager"));
const ProjectsManager = lazy(() => import("pages/admin-dashboard/components/ProjectsManager"));
const SettingsManager = lazy(() => import("pages/admin-dashboard/components/SettingsManager"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background pt-20">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-secondary-600">Loading...</p>
    </div>
  </div>
);

// NotFound page component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 pt-20">
    <div className="text-center px-4">
      <h1 className="text-9xl font-bold text-primary-200">404</h1>
      <h2 className="text-3xl font-bold text-primary-800 mt-4 mb-2">Page Not Found</h2>
      <p className="text-secondary-600 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-flex items-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
      >
        Go Back Home
      </a>
    </div>
  </div>
);

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <RouterRoutes>
              {/* Public routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/portfolio-gallery" element={<PortfolioGallery />} />
              <Route path="/case-study-detail/:id" element={<CaseStudyDetail />} />
              <Route path="/about-story" element={<AboutStory />} />
              <Route path="/contact-hub" element={<ContactHub />} />
              <Route path="/login" element={<Login />} />
              
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