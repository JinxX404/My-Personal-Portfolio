// Daily read against Supabase so the free-tier project is not paused for inactivity.
// netlify.toml is gitignored in this repo, so the schedule lives on this function.

const SETTINGS_PATH = '/rest/v1/portfolio_settings?select=*&limit=1';

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

export default async () => {
  const supabaseUrl = (readEnv('VITE_SUPABASE_URL') || readEnv('SUPABASE_URL')).replace(/\/+$/, '');
  const anonKey = readEnv('VITE_SUPABASE_ANON_KEY') || readEnv('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !anonKey) {
    console.error(
      'Supabase keepalive failed: missing Supabase URL or anon key. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for the Functions scope, or SUPABASE_URL and SUPABASE_ANON_KEY.'
    );
    return json({ ok: false, error: 'missing_supabase_env' }, 500);
  }

  let response;
  try {
    response = await fetch(`${supabaseUrl}${SETTINGS_PATH}`, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'request_failed';
    console.error(`Supabase keepalive failed: network error (${message})`);
    return json({ ok: false, error: 'network_error' }, 500);
  }

  if (!response.ok) {
    const detail = (await response.text()).replace(/\s+/g, ' ').slice(0, 300);
    console.error(`Supabase keepalive failed: HTTP ${response.status}${detail ? ` ${detail}` : ''}`);
    return json({ ok: false, status: response.status }, 502);
  }

  await response.arrayBuffer().catch(() => {});
  console.log(`Supabase keepalive succeeded: HTTP ${response.status}`);
  return json({ ok: true, status: response.status }, 200);
};

export const config = {
  schedule: '@daily',
};
