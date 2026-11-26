import { isMissingArabicColumnError, stripArabicColumns } from '../i18n/content.mjs';

/**
 * Runs a Supabase insert/update. If the database does not have the `_ar`
 * columns yet (migration 008 not applied), retries without them so the
 * English save still goes through, and flags `arabicSkipped` on the result.
 */
export async function writeWithArabicFallback(row, write) {
  const result = await write(row);
  if (!result?.error || !isMissingArabicColumnError(result.error)) return result;
  const stripped = stripArabicColumns(row);
  if (Object.keys(stripped).length === Object.keys(row || {}).length) return result;
  const retry = await write(stripped);
  if (!retry?.error) {
    console.warn('Arabic columns are missing in the database; saved the English fields only. Apply supabase/migrations/008_bilingual_content.sql.');
    return { ...retry, arabicSkipped: true };
  }
  return retry;
}

/** formatSupabaseResponse plus the arabicSkipped flag. */
export const withArabicFlag = (formatted, result) =>
  result?.arabicSkipped && formatted?.success ? { ...formatted, arabicSkipped: true } : formatted;
