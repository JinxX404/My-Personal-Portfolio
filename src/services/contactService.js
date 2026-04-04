import { supabase, formatSupabaseResponse, isSupabaseConfigured } from '../lib/supabase';

export const submitContactForm = async (data) => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data: result, error } = await supabase
      .from('contact_submissions')
      .insert([{
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
      }])
      .select()
      .single();

    return formatSupabaseResponse(result, error);
  } catch (error) {
    return { success: false, error: error.message };
  }
};
