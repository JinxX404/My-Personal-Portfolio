// src/services/skillsService.js
import {
  supabase,
  formatSupabaseResponse,
  isSupabaseConfigured,
} from "../lib/supabase";

/**
 * Skills Service - Handles all database operations for skills and tech stack
 */

// ==================== SKILL CATEGORIES ====================

export const fetchSkillCategories = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("order_index", { ascending: true });

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchSkillCategoryWithSkills = async (categoryKey) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    // First get the category
    const { data: category, error: categoryError } = await supabase
      .from("skill_categories")
      .select("*")
      .eq("key", categoryKey)
      .single();

    if (categoryError) {
      return formatSupabaseResponse(null, categoryError);
    }

    // Then get its skills
    const { data: skills, error: skillsError } = await supabase
      .from("skills")
      .select("*")
      .eq("category_id", category.id)
      .order("order_index", { ascending: true });

    if (skillsError) {
      return formatSupabaseResponse(null, skillsError);
    }

    return {
      success: true,
      data: {
        ...category,
        skills: skills || [],
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createSkillCategory = async (categoryData) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("skill_categories")
      .insert([categoryData])
      .select()
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSkillCategory = async (categoryId, updates) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("skill_categories")
      .update(updates)
      .eq("id", categoryId)
      .select()
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteSkillCategory = async (categoryId) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase
      .from("skill_categories")
      .delete()
      .eq("id", categoryId);

    return formatSupabaseResponse({ deleted: true }, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== SKILLS ====================

export const fetchSkills = async (categoryId = null) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    let query = supabase
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;
    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createSkill = async (skillData) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("skills")
      .insert([skillData])
      .select()
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSkill = async (skillId, updates) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("skills")
      .update(updates)
      .eq("id", skillId)
      .select()
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteSkill = async (skillId) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase.from("skills").delete().eq("id", skillId);

    return formatSupabaseResponse({ deleted: true }, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== TECH STACK ====================

export const fetchTechStack = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("tech_stack")
      .select("*")
      .order("order_index", { ascending: true });

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createTechStackItem = async (name, orderIndex = 0) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("tech_stack")
      .insert([{ name, order_index: orderIndex }])
      .select()
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateTechStackItem = async (id, name) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("tech_stack")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    return formatSupabaseResponse(data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteTechStackItem = async (id) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase.from("tech_stack").delete().eq("id", id);

    return formatSupabaseResponse({ deleted: true }, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== BULK OPERATIONS ====================

export const fetchAllSkillsData = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const [categoriesResult, skillsResult, techStackResult] = await Promise.all([
      fetchSkillCategories(),
      fetchSkills(),
      fetchTechStack(),
    ]);

    if (!categoriesResult.success) {
      return categoriesResult;
    }
    if (!skillsResult.success) {
      return skillsResult;
    }
    if (!techStackResult.success) {
      return techStackResult;
    }

    const categoriesWithSkills = categoriesResult.data.map((category) => ({
      ...category,
      skills: skillsResult.data.filter(
        (skill) => skill.category_id === category.id
      ),
    }));

    return {
      success: true,
      data: {
        categories: categoriesWithSkills,
        techStack: techStackResult.data,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
