// wa.me links from a phone number typed in any format ("+20 100 123 4567",
// "00201001234567", "٠١٠..."). Returns '' when the number is not usable, so the
// WhatsApp button simply stays hidden.

const ARABIC_DIGITS = /[\u0660-\u0669\u06F0-\u06F9]/g;

export function whatsappNumber(raw) {
  if (typeof raw !== 'string') return '';
  let digits = raw
    .replace(ARABIC_DIGITS, (d) => String((d.charCodeAt(0) & 0xf) % 10))
    .replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);
  digits = digits.replace(/\D/g, '');
  // International format only (country code + number): 8 to 15 digits, no leading 0.
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : '';
}

export function whatsappUrl(raw, text = '') {
  const number = whatsappNumber(raw);
  if (!number) return '';
  const message = typeof text === 'string' && text.trim() ? `?text=${encodeURIComponent(text.trim())}` : '';
  return `https://wa.me/${number}${message}`;
}
