// Optional contact endpoint. The public form calls this only when a Turnstile
// site key is configured. Without TURNSTILE_SECRET_KEY the insert still
// succeeds so a half-configured captcha cannot take the form offline.
// Direct anon inserts remain allowed by RLS until that policy is tightened.

const INSERT_PATH = '/rest/v1/contact_submissions';

function readEnv(name) {
  if (typeof Netlify === 'undefined' || typeof Netlify.env?.get !== 'function') {
    return '';
  }

  const value = Netlify.env.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function clean(value, max) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export default async (req) => {
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400);
  }

  const name = clean(body?.name, 200);
  const email = clean(body?.email, 320);
  const subject = clean(body?.subject, 200);
  const message = clean(body?.message, 5000);

  if (!name || !email || !subject || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Name, email, subject, and message are required.' }, 400);
  }

  const secret = readEnv('TURNSTILE_SECRET_KEY');
  if (secret) {
    const token = clean(body?.turnstileToken, 2048);
    if (!token) {
      return json({ ok: false, error: 'Complete the captcha and try again.' }, 400);
    }

    const verifyBody = new URLSearchParams({ secret, response: token });
    let verifyResponse;
    try {
      verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: verifyBody,
      });
    } catch {
      return json({ ok: false, error: 'Captcha check failed. Please try again.' }, 502);
    }

    const verifyPayload = await verifyResponse.json().catch(() => ({}));
    if (!verifyPayload.success) {
      return json({ ok: false, error: 'Captcha check failed. Please try again.' }, 403);
    }
  }

  const supabaseUrl = (readEnv('VITE_SUPABASE_URL') || readEnv('SUPABASE_URL')).replace(/\/+$/, '');
  const anonKey = readEnv('VITE_SUPABASE_ANON_KEY') || readEnv('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !anonKey) {
    return json({ ok: false, error: 'Contact form is not configured.' }, 500);
  }

  const row = {
    name,
    email,
    company: clean(body?.company, 200),
    phone: clean(body?.phone, 50),
    subject,
    message,
    inquiry_type: clean(body?.inquiryType, 40) || 'general',
    budget: clean(body?.budget, 80),
    timeline: clean(body?.timeline, 80),
    event_date: clean(body?.eventDate, 40),
    event_location: clean(body?.eventLocation, 200),
    audience_size: clean(body?.audienceSize, 40),
  };

  let insertResponse;
  try {
    insertResponse = await fetch(`${supabaseUrl}${INSERT_PATH}`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'content-type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
  } catch {
    return json({ ok: false, error: 'Could not send your message. Please try again.' }, 502);
  }

  if (!insertResponse.ok) {
    return json({ ok: false, error: 'Could not send your message. Please try again.' }, 502);
  }

  return json({ ok: true }, 201);
};
