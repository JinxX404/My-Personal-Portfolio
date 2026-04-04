import { supabase, formatSupabaseResponse, isSupabaseConfigured } from '../lib/supabase';

const BUCKET_NAME = 'project-images';

export const uploadImage = async (file, projectId, folder) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${projectId || 'draft'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return { success: true, data: publicUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteImage = async (filePath) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    return formatSupabaseResponse(null, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};
