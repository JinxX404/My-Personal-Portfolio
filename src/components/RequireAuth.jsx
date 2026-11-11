// src/components/RequireAuth.jsx
import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import Icon from 'components/AppIcon';

/**
 * Protects admin routes. A signed-in user must also be an admin
 * (admin_users row or app_metadata.is_admin). Missing Supabase config
 * only bypasses this gate during local development.
 */
const RequireAuth = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, isConfigured, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    if (import.meta.env.PROD) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 pt-20">
          <div className="max-w-lg text-center" role="alert">
            <Icon name="Lock" size={32} className="mx-auto text-error mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-2">Admin is unavailable</h1>
            <p className="text-text-secondary mb-6">
              Authentication is not configured for this deployment, so admin pages stay closed.
            </p>
            <Link to="/" className="btn-primary inline-flex">Back to the site</Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={24} className="text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-warning-800 mb-1">Development Mode</h2>
                <p className="text-warning-700 text-sm">
                  Supabase is not configured. Authentication is disabled in local development only.
                  Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable auth.
                </p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 pt-20">
        <div className="max-w-lg text-center" role="alert">
          <Icon name="Lock" size={32} className="mx-auto text-error mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">Admin access only</h1>
          <p className="text-text-secondary mb-6">
            This account is signed in, but it is not on the admin allowlist.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/" className="btn-secondary inline-flex">Back to the site</Link>
            <button type="button" onClick={() => signOut()} className="btn-primary inline-flex">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireAuth;
