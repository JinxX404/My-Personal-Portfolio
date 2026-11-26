// src/context/ProjectsContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  fetchProjects,
  fetchPublishedProjects,
  fetchFeaturedProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
  unpublishProject,
  toggleFeaturedProject,
  getProjectStats,
} from '../services/projectsService';
import { isSupabaseConfigured } from '../lib/supabase';

const ProjectsContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

// Public projects are cached in the browser so a repeat visit renders the list
// immediately and refreshes it quietly. Drafts and private rows are never cached.
const CACHE_KEY = 'portfolio-cache:projects:v1';

const isCacheable = (project) =>
  project &&
  project.visibility === 'public' &&
  (project.publishing_status === 'published' || project.publishing_status === 'in_progress');

const readCache = () => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeCache = (rows) => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify((rows || []).filter(isCacheable)));
  } catch {
    // Storage full or blocked: the site still works, it just refetches.
  }
};

export const ProjectsProvider = ({ children }) => {
  const [useSupabase] = useState(isSupabaseConfigured());
  const [cached] = useState(() => (useSupabase ? readCache() : null));
  const [projects, setProjects] = useState(() => cached || []);
  // `loading` means "nothing to show yet". A background refresh keeps it false.
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const projectsRef = useRef(projects);
  projectsRef.current = projects;

  const loadProjects = useCallback(async (filters = {}) => {
    if (!useSupabase) {
      setLoading(false);
      return;
    }

    if (projectsRef.current.length === 0) setLoading(true);
    try {
      const result = await fetchProjects(filters);
      if (result.success) {
        setProjects(result.data);
        setError(null);
        if (!filters || Object.keys(filters).length === 0) writeCache(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [useSupabase]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const getPublishedProjects = useCallback(async () => {
    if (!useSupabase) return { success: true, data: projectsRef.current.filter(p => p.publishing_status === 'published') };
    return await fetchPublishedProjects();
  }, [useSupabase]);

  const getFeaturedProjects = useCallback(async () => {
    if (!useSupabase) return { success: true, data: projectsRef.current.filter(p => p.featured) };
    return await fetchFeaturedProjects();
  }, [useSupabase]);

  const getProjectById = useCallback(async (projectId) => {
    if (!useSupabase) {
      const project = projectsRef.current.find(p => p.id === projectId);
      return { success: !!project, data: project };
    }
    return await fetchProjectById(projectId);
  }, [useSupabase]);

  const notConfigured = { success: false, error: 'Supabase not configured' };

  const addProject = useCallback(async (projectData) => {
    if (!useSupabase) return notConfigured;
    const result = await createProject(projectData);
    if (result.success) setProjects(prev => [result.data, ...prev]);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSupabase]);

  const editProject = useCallback(async (projectId, updates) => {
    if (!useSupabase) return notConfigured;
    const result = await updateProject(projectId, updates);
    if (result.success) setProjects(prev => prev.map(p => p.id === projectId ? result.data : p));
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSupabase]);

  const removeProject = useCallback(async (projectId) => {
    if (!useSupabase) return notConfigured;
    const result = await deleteProject(projectId);
    if (result.success) setProjects(prev => prev.filter(p => p.id !== projectId));
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSupabase]);

  const togglePublish = useCallback(async (projectId, publish = true) => {
    if (!useSupabase) return notConfigured;
    const result = publish ? await publishProject(projectId) : await unpublishProject(projectId);
    if (result.success) setProjects(prev => prev.map(p => p.id === projectId ? result.data : p));
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSupabase]);

  const toggleFeatured = useCallback(async (projectId, featured) => {
    if (!useSupabase) return notConfigured;
    const result = await toggleFeaturedProject(projectId, featured);
    if (result.success) setProjects(prev => prev.map(p => p.id === projectId ? result.data : p));
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSupabase]);

  const getStats = useCallback(async () => {
    if (!useSupabase) {
      const list = projectsRef.current;
      return {
        success: true,
        data: {
          total: list.length,
          published: list.filter(p => p.publishing_status === 'published').length,
          draft: list.filter(p => p.publishing_status === 'draft').length,
          featured: list.filter(p => p.featured).length,
        },
      };
    }
    return await getProjectStats();
  }, [useSupabase]);

  // The callbacks above are stable, so this value only changes when the data does.
  // Pages that depend on getProjectById no longer refetch each time the list updates.
  const value = useMemo(() => ({
    projects,
    loading,
    error,
    useSupabase,
    loadProjects,
    getPublishedProjects,
    getFeaturedProjects,
    getProjectById,
    addProject,
    editProject,
    removeProject,
    togglePublish,
    toggleFeatured,
    getStats,
  }), [projects, loading, error, useSupabase, loadProjects, getPublishedProjects, getFeaturedProjects, getProjectById, addProject, editProject, removeProject, togglePublish, toggleFeatured, getStats]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
