// Contact form budget ranges, in US dollars or Egyptian pounds.
// The stored value is a stable key (contact_submissions.budget), so the inbox
// can show it in words whatever language the visitor used.

export const CURRENCIES = ['EGP', 'USD'];

export const BUDGET_RANGES = {
  USD: [
    { value: 'under-5k', en: 'Under $5,000', ar: 'أقل من 5,000 دولار' },
    { value: '5k-15k', en: '$5,000 - $15,000', ar: 'من 5,000 إلى 15,000 دولار' },
    { value: '15k-50k', en: '$15,000 - $50,000', ar: 'من 15,000 إلى 50,000 دولار' },
    { value: 'over-50k', en: 'Over $50,000', ar: 'أكثر من 50,000 دولار' },
  ],
  EGP: [
    { value: 'egp-under-10k', en: 'Under EGP 10,000', ar: 'أقل من 10,000 جنيه' },
    { value: 'egp-10k-30k', en: 'EGP 10,000 - 30,000', ar: 'من 10,000 إلى 30,000 جنيه' },
    { value: 'egp-30k-75k', en: 'EGP 30,000 - 75,000', ar: 'من 30,000 إلى 75,000 جنيه' },
    { value: 'egp-75k-150k', en: 'EGP 75,000 - 150,000', ar: 'من 75,000 إلى 150,000 جنيه' },
    { value: 'egp-over-150k', en: 'Over EGP 150,000', ar: 'أكثر من 150,000 جنيه' },
  ],
};

export const BUDGET_DISCUSS = { value: 'discuss', en: "Let's discuss", ar: 'نتناقش فيها' };

/** The currency shown first: Egyptian pounds on the Arabic site, dollars on the English one. */
export const defaultCurrency = (lang) => (lang === 'ar' ? 'EGP' : 'USD');

export const currencyOfBudget = (value) =>
  CURRENCIES.find((currency) => BUDGET_RANGES[currency].some((range) => range.value === value)) || null;

export function budgetOptions(currency, lang = 'en') {
  const list = BUDGET_RANGES[currency] || BUDGET_RANGES.USD;
  return [...list, BUDGET_DISCUSS].map((range) => ({ value: range.value, label: range[lang] || range.en }));
}

/** Words for a stored budget key; unknown values are shown as they are. */
export function budgetLabel(value, lang = 'en') {
  if (!value) return '';
  const all = [...BUDGET_RANGES.USD, ...BUDGET_RANGES.EGP, BUDGET_DISCUSS];
  const match = all.find((range) => range.value === value);
  return match ? match[lang] || match.en : String(value);
}
