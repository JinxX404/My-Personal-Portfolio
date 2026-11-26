// Services and FAQ helpers shared by the public page, the admin and tests.
import { localize, SERVICE_SPEC, FAQ_SPEC } from '../i18n/content.mjs';

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

/** Visible, sorted, localized services; deliverables without text are dropped. */
export function prepareServices(rows = [], lang = 'en') {
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => row && row.published !== false && hasText(row.title))
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .map((row) => {
      const local = localize({ ...row, deliverables: Array.isArray(row.deliverables) ? row.deliverables : [] }, SERVICE_SPEC, lang);
      return { ...local, deliverables: local.deliverables.map((d) => d?.text).filter(hasText) };
    });
}

export function prepareFaqs(rows = [], lang = 'en') {
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => row && row.published !== false && hasText(row.question) && hasText(row.answer))
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .map((row) => localize(row, FAQ_SPEC, lang));
}

/**
 * Price line for a service card, or null for "contact for a quote".
 * Latin digits on both sites (house style), currency named in the page language.
 */
export function formatServicePrice(service, lang = 'en') {
  const amount = Number(service?.price_from);
  if (service?.price_from === null || service?.price_from === undefined || service?.price_from === '' || !Number.isFinite(amount) || amount < 0) return null;
  const currency = service.currency === 'USD' ? 'USD' : 'EGP';
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);
  if (lang === 'ar') return `${number} ${currency === 'USD' ? 'دولار' : 'جنيه'}`;
  return currency === 'USD' ? `$${number}` : `EGP ${number}`;
}

/** Contact page address that opens the project form with this service as the topic. */
export const serviceContactPath = (service) =>
  `/contact-hub?service=${encodeURIComponent(service?.id || '')}`;

/** PostgREST / Postgres "table does not exist" (migration 009 not applied yet). */
export function isMissingTableError(error) {
  const code = String(error?.code || '');
  const message = String(error?.message || '');
  return code === '42P01' || code === 'PGRST205' || /relation .* does not exist|could not find the table/i.test(message);
}
