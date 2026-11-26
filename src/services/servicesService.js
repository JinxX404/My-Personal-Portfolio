// src/services/servicesService.js
// Services and FAQ (tables from migration 009). Before that migration is
// applied the reads return an empty list with `missingTable: true`, so the
// public site simply hides these sections.
import { supabase, formatSupabaseResponse, isSupabaseConfigured } from '../lib/supabase';
import { isMissingTableError } from '../lib/services.mjs';

const TABLES = new Set(['services', 'faqs']);

const notConfigured = { success: false, error: 'Supabase not configured' };

async function list(table, { publishedOnly }) {
  if (!TABLES.has(table)) throw new Error(`Unknown table ${table}`);
  if (!isSupabaseConfigured()) return notConfigured;
  try {
    let query = supabase.from(table).select('*');
    if (publishedOnly) query = query.eq('published', true);
    const { data, error } = await query.order('order_index', { ascending: true });
    if (error && isMissingTableError(error)) return { success: true, data: [], missingTable: true };
    return formatSupabaseResponse(data || [], error);
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function write(table, action, payload, id) {
  if (!TABLES.has(table)) throw new Error(`Unknown table ${table}`);
  if (!isSupabaseConfigured()) return notConfigured;
  try {
    let query;
    if (action === 'insert') query = supabase.from(table).insert([payload]).select().single();
    else if (action === 'update') query = supabase.from(table).update(payload).eq('id', id).select().single();
    else query = supabase.from(table).delete().eq('id', id);
    const { data, error } = await query;
    if (error && isMissingTableError(error)) {
      return { success: false, missingTable: true, error: 'The services/FAQ tables are not in the database yet (apply migration 009).' };
    }
    return formatSupabaseResponse(action === 'delete' ? null : data, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export const fetchPublishedServices = () => list('services', { publishedOnly: true });
export const fetchPublishedFaqs = () => list('faqs', { publishedOnly: true });
export const fetchAllServices = () => list('services', { publishedOnly: false });
export const fetchAllFaqs = () => list('faqs', { publishedOnly: false });

export const createRow = (table, payload) => write(table, 'insert', payload);
export const updateRow = (table, id, payload) => write(table, 'update', payload, id);
export const deleteRow = (table, id) => write(table, 'delete', null, id);
