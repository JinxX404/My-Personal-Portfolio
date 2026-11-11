// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL;
const configuredKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!configuredUrl || !configuredKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// createClient throws without a URL. Keep a non-routable placeholder so the
// site can render, and treat it as "not configured" below.
const supabaseUrl = configuredUrl || 'https://dummy.supabase.co';
const supabaseAnonKey = configuredKey || 'dummy-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'portfolio-pro',
    },
  },
});

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://dummy.supabase.co' && 
    !supabaseAnonKey.includes('dummy'));
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, context = '') => {
  console.error(`Supabase Error ${context}:`, error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    details: error,
  };
};

// Helper function to format Supabase response
export const formatSupabaseResponse = (data, error) => {
  if (error) {
    return handleSupabaseError(error);
  }
  return {
    success: true,
    data,
  };
};
