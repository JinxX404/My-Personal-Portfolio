// src/components/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import Icon from 'components/AppIcon';

/**
 * Wrapper component that protects routes requiring authentication.
 * Redirects to /login if user is not authenticated.
 */
const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading, isConfigured } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
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

  // If Supabase is not configured, allow access (development mode)
  // Remove this block in production for strict auth
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={24} className="text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning-800 mb-1">Development Mode</h3>
                <p className="text-warning-700 text-sm">
                  Supabase is not configured. Authentication is disabled.
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

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default RequireAuth;
