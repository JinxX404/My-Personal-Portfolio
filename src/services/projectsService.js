// src/services/projectsService.js
import {
  supabase,
  formatSupabaseResponse,
  isSupabaseConfigured,
} from "../lib/supabase";
import {
  projectCreateSchema,
  projectUpdateSchema,
  validate,
} from "../lib/validation";

/**
 * Projects Service - Handles all database operations for projects
 */

// ==================== FETCH OPERATIONS ====================

export const fetchProjects = async (filters = {}) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    let query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (filters.featured !== undefined) {
      query = query.eq("featured", filters.featured);
    }
    if (filters.publishing_status) {
      query = query.eq("publishing_status", filters.publishing_status);
    }
    if (filters.visibility) {
      query = query.eq("visibility", filters.visibility);
    }

    const { data, error } = await query;
    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchPublishedProjects = async () => {
  return fetchProjects({
    publishing_status: "published",
    visibility: "public",
  });
};

export const fetchFeaturedProjects = async () => {
  return fetchProjects({ publishing_status: "published", featured: true });
};

export const fetchProjectById = async (projectId) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchProjectBySlug = async (slug) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("title", slug)
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== CREATE OPERATIONS ====================

export const createProject = async (projectData) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  // Validate input
  const validation = validate(projectCreateSchema, projectData);
  if (!validation.success) {
    return {
      success: false,
      error: Object.values(validation.errors)[0],
      errors: validation.errors,
    };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([projectData])
      .select()
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== UPDATE OPERATIONS ====================

export const updateProject = async (projectId, updates) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  // Validate input
  const validation = validate(projectUpdateSchema, updates);
  if (!validation.success) {
    return {
      success: false,
      error: Object.values(validation.errors)[0],
      errors: validation.errors,
    };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
      .select()
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const publishProject = async (projectId) => {
  return updateProject(projectId, {
    publishing_status: "published",
    published_at: new Date().toISOString(),
  });
};

export const unpublishProject = async (projectId) => {
  return updateProject(projectId, {
    publishing_status: "draft",
  });
};

export const toggleFeaturedProject = async (projectId, featured) => {
  return updateProject(projectId, { featured });
};

// ==================== DELETE OPERATIONS ====================

export const deleteProject = async (projectId) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    return formatSupabaseResponse({ deleted: true }, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== STATISTICS ====================

export const getProjectStats = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("status, publishing_status, featured");

    if (error) {
      return formatSupabaseResponse(null, error);
    }

    const stats = {
      total: data.length,
      published: data.filter((p) => p.publishing_status === "published").length,
      draft: data.filter((p) => p.publishing_status === "draft").length,
      featured: data.filter((p) => p.featured).length,
      inProgress: data.filter((p) => p.status === "in-progress").length,
      completed: data.filter((p) => p.status === "completed").length,
    };

    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== SEARCH & FILTER ====================

export const searchProjects = async (searchTerm) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order("created_at", { ascending: false });

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProjectCategories = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("category")
      .not("category", "is", null);

    if (error) {
      return formatSupabaseResponse(null, error);
    }

    // Get unique categories
    const categories = [...new Set(data.map((p) => p.category))];
    return { success: true, data: categories };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
