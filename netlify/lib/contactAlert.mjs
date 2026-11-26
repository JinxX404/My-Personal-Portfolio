// Email alert for a new contact message, sent through Resend.
// Pure helpers (buildAlertEmail) are unit tested; sendContactAlert never
// throws and never blocks the message from being saved.
import { budgetLabel } from '../../src/lib/budget.mjs';

const RESEND_URL = 'https://api.resend.com/emails';
const SITE = 'https://moatazz.site';

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Header values: one line, no control characters.
const oneLine = (value, max = 150) =>
  String(value ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

const INQUIRY = { project: 'Project', general: 'Other topic', speaking: 'Speaking', collaboration: 'Collaboration' };

/** Settings from the environment, or null when any is missing (alerts off). */
export function alertConfig(readEnv) {
  const apiKey = readEnv('RESEND_API_KEY');
  const to = readEnv('ALERT_EMAIL_TO');
  const from = readEnv('ALERT_EMAIL_FROM');
  if (!apiKey || !to || !from) return null;
  return {
    apiKey,
    from,
    to: to.split(',').map((address) => address.trim()).filter(Boolean),
  };
}

/** Resend payload for one saved contact row. */
export function buildAlertEmail(row, { from, to }) {
  const fields = [
    ['Name', row.name],
    ['Email', row.email],
    ['Company', row.company],
    ['Phone', row.phone],
    ['Topic', INQUIRY[row.inquiry_type] || row.inquiry_type],
    ['Budget', row.budget ? budgetLabel(row.budget, 'en') : ''],
    ['Timeline', row.timeline],
    ['Event date', row.event_date],
    ['Event location', row.event_location],
    ['Audience size', row.audience_size],
  ].filter(([, value]) => typeof value === 'string' && value.trim());

  const inbox = `${SITE}/messages-manager`;
  const text = [
    `New message from the portfolio contact form.`,
    '',
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    `Subject: ${row.subject}`,
    '',
    row.message,
    '',
    `Reply to this email to answer ${row.name}, or open the inbox: ${inbox}`,
  ].join('\n');

  const rows = fields
    .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td dir="auto" style="padding:4px 0">${escapeHtml(value)}</td></tr>`)
    .join('');
  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,Tahoma,Arial,sans-serif;color:#0f172a;line-height:1.5">
<p style="margin:0 0 12px">New message from the portfolio contact form.</p>
<table style="border-collapse:collapse;font-size:14px">${rows}</table>
<h2 dir="auto" style="font-size:16px;margin:20px 0 8px">${escapeHtml(row.subject)}</h2>
<div dir="auto" style="white-space:pre-wrap;font-size:15px;border-inline-start:3px solid #4f46e5;padding:4px 12px">${escapeHtml(row.message)}</div>
<p style="font-size:13px;color:#64748b;margin-top:20px">Reply to this email to answer ${escapeHtml(row.name)}, or <a href="${inbox}">open the inbox</a>.</p>
</body></html>`;

  return {
    from,
    to,
    reply_to: row.email,
    subject: oneLine(`New message: ${row.subject} (${row.name})`),
    text,
    html,
  };
}

/**
 * Sends the alert. Returns 'sent', 'skipped' (not configured) or 'failed'.
 * Never throws; a slow or failing Resend call gives up after `timeoutMs`.
 */
export async function sendContactAlert(row, readEnv, { fetchImpl = fetch, timeoutMs = 4000 } = {}) {
  const config = alertConfig(readEnv);
  if (!config) return 'skipped';
  try {
    const response = await fetchImpl(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify(buildAlertEmail(row, config)),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) {
      console.warn('contact alert: Resend returned', response.status);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.warn('contact alert failed:', error?.name || 'error');
    return 'failed';
  }
}
