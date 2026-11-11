// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

async function userIsAdmin(currentUser) {
  if (!currentUser) return false;
  if (currentUser.app_metadata?.is_admin === true) return true;

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', currentUser.id)
    .maybeSingle();

  if (error) return false;
  return Boolean(data?.user_id);
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConfigured] = useState(isSupabaseConfigured());
  const adminRequest = useRef(0);

  const syncAdmin = useCallback((currentUser) => {
    const requestId = ++adminRequest.current;

    if (!currentUser) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    userIsAdmin(currentUser).then((admin) => {
      if (requestId !== adminRequest.current) return;
      setIsAdmin(admin);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return undefined;
    }

    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        syncAdmin(currentSession?.user ?? null);
      } catch {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      syncAdmin(currentSession?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [isConfigured, syncAdmin]);

  const signIn = useCallback(async (email, password) => {
    if (!isConfigured) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [isConfigured]);

  const signOut = useCallback(async () => {
    if (!isConfigured) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(null);
      setSession(null);
      setIsAdmin(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [isConfigured]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isConfigured,
    isAuthenticated: !!user,
    isAdmin,
    signIn,
    signOut,
  }), [user, session, loading, isConfigured, isAdmin, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
