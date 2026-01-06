import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchAllSkillsData,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkill,
  updateSkill as updateSkillService,
  deleteSkill as deleteSkillService,
  createTechStackItem,
  updateTechStackItem,
  deleteTechStackItem,
} from '../services/skillsService';
import { isSupabaseConfigured } from '../lib/supabase';

const SkillsContext = createContext();

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error('useSkills must be used within a SkillsProvider');
  }
  return context;
};

export const SkillsProvider = ({ children }) => {
  const [skillCategories, setSkillCategories] = useState(() => {
    const saved = localStorage.getItem('skillCategories');
    return saved ? JSON.parse(saved) : {};
  });

  const [techStack, setTechStack] = useState(() => {
    const saved = localStorage.getItem('techStack');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useSupabase] = useState(isSupabaseConfigured());

  // Load data from Supabase
  const loadData = useCallback(async () => {
    if (!useSupabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await fetchAllSkillsData();
      if (result.success) {
        // Convert Supabase format to local format
        const categoriesObj = {};
        result.data.categories.forEach(cat => {
          categoriesObj[cat.key] = {
            id: cat.id,
            key: cat.key,
            title: cat.title,
            icon: cat.icon,
            color: cat.color,
            skills: cat.skills.map(skill => ({
              id: skill.id,
              name: skill.name,
              level: skill.level,
              icon: skill.icon,
            })),
          };
        });
        
        setSkillCategories(categoriesObj);
        setTechStack(result.data.techStack.map(t => t.name));
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

  // Fetch data from Supabase on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save to localStorage whenever data changes (fallback)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('skillCategories', JSON.stringify(skillCategories));
    }
  }, [skillCategories, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('techStack', JSON.stringify(techStack));
    }
  }, [techStack, loading]);

  // Category CRUD operations
  const addCategory = async (categoryKey, categoryData) => {
    if (useSupabase) {
      const result = await createSkillCategory({
        key: categoryKey,
        title: categoryData.title,
        icon: categoryData.icon,
        color: categoryData.color,
      });
      if (!result.success) {
        return result;
      }
    }
    
    setSkillCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...categoryData,
        skills: categoryData.skills || []
      }
    }));
    return { success: true };
  };

  const updateCategory = async (categoryKey, updates) => {
    if (useSupabase) {
      const category = skillCategories[categoryKey];
      if (category?.id) {
        const result = await updateSkillCategory(category.id, updates);
        if (!result.success) {
          return result;
        }
      }
    }
    
    setSkillCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        ...updates
      }
    }));
    return { success: true };
  };

  const deleteCategory = async (categoryKey) => {
    if (useSupabase) {
      const category = skillCategories[categoryKey];
      if (category?.id) {
        const result = await deleteSkillCategory(category.id);
        if (!result.success) {
          return result;
        }
      }
    }
    
    setSkillCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[categoryKey];
      return newCategories;
    });
    return { success: true };
  };

  // Skill CRUD operations within a category
  const addSkill = async (categoryKey, skill) => {
    let newSkillId = Date.now().toString();
    
    if (useSupabase) {
      const category = skillCategories[categoryKey];
      if (category?.id) {
        const result = await createSkill({
          category_id: category.id,
          name: skill.name,
          level: skill.level,
          icon: skill.icon,
        });
        if (result.success) {
          newSkillId = result.data.id;
        } else {
          return result;
        }
      }
    }
    
    setSkillCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        skills: [...(prev[categoryKey]?.skills || []), { ...skill, id: newSkillId }]
      }
    }));
    return { success: true };
  };

  const updateSkill = async (categoryKey, skillId, updates) => {
    if (useSupabase) {
      const result = await updateSkillService(skillId, updates);
      if (!result.success) {
        return result;
      }
    }
    
    setSkillCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        skills: prev[categoryKey].skills.map(skill =>
          skill.id === skillId ? { ...skill, ...updates } : skill
        )
      }
    }));
    return { success: true };
  };

  const deleteSkill = async (categoryKey, skillId) => {
    if (useSupabase) {
      const result = await deleteSkillService(skillId);
      if (!result.success) {
        return result;
      }
    }
    
    setSkillCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        skills: prev[categoryKey].skills.filter(skill => skill.id !== skillId)
      }
    }));
    return { success: true };
  };

  // Tech Stack operations
  const addTech = async (tech) => {
    if (useSupabase) {
      const result = await createTechStackItem(tech, techStack.length);
      if (!result.success) {
        return result;
      }
    }
    
    setTechStack(prev => [...prev, tech]);
    return { success: true };
  };

  const updateTech = async (index, newTech) => {
    setTechStack(prev => prev.map((tech, i) => i === index ? newTech : tech));
    // Note: Tech stack update in Supabase requires proper ID tracking
    return { success: true };
  };

  const deleteTech = async (index) => {
    setTechStack(prev => prev.filter((_, i) => i !== index));
    // Note: Tech stack delete in Supabase requires proper ID tracking
    return { success: true };
  };

  // Clear all skills data
  const resetToDefaults = () => {
    setSkillCategories({});
    setTechStack([]);
    localStorage.removeItem('skillCategories');
    localStorage.removeItem('techStack');
  };

  // Resync from database
  const resyncFromDatabase = async () => {
    localStorage.removeItem('skillCategories');
    localStorage.removeItem('techStack');
    await loadData();
  };

  const value = {
    skillCategories,
    techStack,
    loading,
    error,
    useSupabase,
    addCategory,
    updateCategory,
    deleteCategory,
    addSkill,
    updateSkill,
    deleteSkill,
    addTech,
    updateTech,
    deleteTech,
    resetToDefaults,
    resyncFromDatabase
  };

  return (
    <SkillsContext.Provider value={value}>
      {children}
    </SkillsContext.Provider>
  );
};
