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

/** Uploads a generated blob (e.g. a share image) to `path` in the project images bucket. */
export const uploadBlob = async (blob, path, contentType = 'image/png') => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, blob, { cacheControl: '31536000', contentType, upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
    return { success: true, data: publicUrl, path: data.path };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/** Path inside the bucket for one of its public URLs, or '' for other URLs. */
export const bucketPathFromUrl = (url) => {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const index = typeof url === 'string' ? url.indexOf(marker) : -1;
  return index === -1 ? '' : decodeURIComponent(url.slice(index + marker.length).split('?')[0]);
};
