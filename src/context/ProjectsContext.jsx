// src/context/ProjectsContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useSupabase] = useState(isSupabaseConfigured());

  // Fetch all projects
  const loadProjects = useCallback(async (filters = {}) => {
    if (!useSupabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await fetchProjects(filters);
      if (result.success) {
        setProjects(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [useSupabase]);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Get published projects
  const getPublishedProjects = async () => {
    if (!useSupabase) return { success: true, data: projects.filter(p => p.publishing_status === 'published') };
    return await fetchPublishedProjects();
  };

  // Get featured projects
  const getFeaturedProjects = async () => {
    if (!useSupabase) return { success: true, data: projects.filter(p => p.featured) };
    return await fetchFeaturedProjects();
  };

  // Get project by ID
  const getProjectById = async (projectId) => {
    if (!useSupabase) {
      const project = projects.find(p => p.id === projectId);
      return { success: !!project, data: project };
    }
    return await fetchProjectById(projectId);
  };

  // Create new project
  const addProject = async (projectData) => {
    if (!useSupabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    const result = await createProject(projectData);
    if (result.success) {
      setProjects(prev => [result.data, ...prev]);
    }
    return result;
  };

  // Update project
  const editProject = async (projectId, updates) => {
    if (!useSupabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    const result = await updateProject(projectId, updates);
    if (result.success) {
      setProjects(prev => prev.map(p => p.id === projectId ? result.data : p));
    }
    return result;
  };

  // Delete project
  const removeProject = async (projectId) => {
    if (!useSupabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    const result = await deleteProject(projectId);
    if (result.success) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
    return result;
  };

  // Publish/Unpublish project
  const togglePublish = async (projectId, publish = true) => {
    if (!useSupabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    const result = publish ? await publishProject(projectId) : await unpublishProject(projectId);
    if (result.success) {
      setProjects(prev => prev.map(p => p.id === projectId ? result.data : p));
    }
    return result;
  };

  // Toggle featured status
  const toggleFeatured = async (projectId, featured) => {
    if (!useSupabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    const result = await toggleFeaturedProject(projectId, featured);
    if (result.success) {
      setProjects(prev => prev.map(p => p.id === projectId ? result.data : p));
    }
    return result;
  };

  // Get project statistics
  const getStats = async () => {
    if (!useSupabase) {
      return {
        success: true,
        data: {
          total: projects.length,
          published: projects.filter(p => p.publishing_status === 'published').length,
          draft: projects.filter(p => p.publishing_status === 'draft').length,
          featured: projects.filter(p => p.featured).length,
        },
      };
    }
    return await getProjectStats();
  };

  const value = {
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
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
