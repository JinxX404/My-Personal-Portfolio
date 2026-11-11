import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { turnstileSiteKey } from '../components/TurnstileField';

const toRow = (data) => ({
  name: data.name,
  email: data.email,
  company: data.company || null,
  phone: data.phone || null,
  subject: data.subject,
  message: data.message,
  inquiry_type: data.inquiryType || 'general',
  budget: data.budget || null,
  timeline: data.timeline || null,
  event_date: data.eventDate || null,
  event_location: data.eventLocation || null,
  audience_size: data.audienceSize || null,
});

async function insertContact(data) {
  // Do not chain .select(). Anon may INSERT but cannot SELECT the new row,
  // so returning the representation fails the whole request under RLS.
  const { error } = await supabase.from('contact_submissions').insert([toRow(data)]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export const submitContactForm = async (data) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  if (turnstileSiteKey()) {
    try {
      const response = await fetch('/.netlify/functions/contact-submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...data,
          turnstileToken: data.turnstileToken || '',
        }),
      });

      if (response.ok) {
        return { success: true };
      }

      // Local Vite has no functions runtime. Fall back so the form still sends.
      if (response.status !== 404) {
        const payload = await response.json().catch(() => ({}));
        return {
          success: false,
          error: payload.error || 'Failed to send message. Please try again.',
        };
      }
    } catch {
      // Network failure to the function: try the direct insert below.
    }
  }

  try {
    return await insertContact(data);
  } catch (error) {
    return { success: false, error: error.message };
  }
};
