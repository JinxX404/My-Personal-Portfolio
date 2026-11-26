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

  // The function saves the message and sends the email alert. Local Vite has
  // no functions runtime (404) and an unconfigured site answers 503
  // not_configured: both fall back to the direct insert so the form still sends.
  // (Before Phase 5 the function was used only when a captcha was configured.)
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

    const payload = await response.json().catch(() => ({}));
    const fallBack =
      response.status === 404 ||
      (response.status === 503 && payload.code === 'not_configured') ||
      // The function could not save (e.g. a wrong key in Netlify): nothing was stored, try directly.
      (response.status === 502 && payload.code === 'insert_failed') ||
      // Captcha secret set on the server but no site key in this build: same as before this change.
      (payload.code === 'captcha_required' && !turnstileSiteKey());
    if (!fallBack) {
      return {
        success: false,
        error: payload.error || 'Failed to send message. Please try again.',
      };
    }
  } catch {
    // Network failure to the function: try the direct insert below.
  }

  try {
    return await insertContact(data);
  } catch (error) {
    return { success: false, error: error.message };
  }
};
