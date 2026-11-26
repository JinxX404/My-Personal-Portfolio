import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Contact form messages. Admin-only under RLS (see 006_restrict_admin_access.sql):
// visitors can insert, only admins can read, update, or delete.
export const MESSAGES_CHANGED_EVENT = 'portfolio:messages-changed';

export const MESSAGE_STATUSES = ['new', 'read', 'archived'];

const notifyChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MESSAGES_CHANGED_EVENT));
  }
};

export async function listMessages() {
  if (!isSupabaseConfigured()) return { success: true, data: [] };
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { success: false, error: error.message, data: [] };
  return { success: true, data: data || [] };
}

export async function countNewMessages() {
  if (!isSupabaseConfigured()) return 0;
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id')
    .eq('status', 'new');
  if (error) return 0;
  return (data || []).length;
}

export async function setMessageStatus(id, status) {
  if (!MESSAGE_STATUSES.includes(status)) {
    return { success: false, error: 'Unknown status' };
  }
  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id);
  if (error) return { success: false, error: error.message };
  notifyChanged();
  return { success: true };
}

export async function deleteMessage(id) {
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  notifyChanged();
  return { success: true };
}
