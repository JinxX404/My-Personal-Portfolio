// One list of social / freelance platforms, matched by the link's host name.
// Used by the footer, the contact page and the admin Social Links tab.

const PLATFORMS = [
  { domains: ['github.com'], key: 'github', name: 'GitHub', icon: 'Github', color: 'gray-800' },
  { domains: ['linkedin.com'], key: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: 'blue-600' },
  { domains: ['x.com', 'twitter.com'], key: 'twitter', name: 'X (Twitter)', icon: 'Twitter', color: 'gray-800' },
  { domains: ['mostaql.com'], key: 'mostaql', name: 'Mostaql', nameAr: 'مستقل', icon: 'Briefcase', color: 'success' },
  { domains: ['upwork.com'], key: 'upwork', name: 'Upwork', icon: 'Briefcase', color: 'success' },
  { domains: ['fiverr.com'], key: 'fiverr', name: 'Fiverr', icon: 'DollarSign', color: 'success' },
  { domains: ['freelancer.com'], key: 'freelancer', name: 'Freelancer', icon: 'Users', color: 'blue-500' },
  { domains: ['toptal.com'], key: 'toptal', name: 'Toptal', icon: 'Award', color: 'blue-700' },
  { domains: ['dribbble.com'], key: 'dribbble', name: 'Dribbble', icon: 'Dribbble', color: 'pink-500' },
  { domains: ['behance.net'], key: 'behance', name: 'Behance', icon: 'Box', color: 'blue-500' },
  { domains: ['instagram.com'], key: 'instagram', name: 'Instagram', icon: 'Instagram', color: 'pink-600' },
  { domains: ['facebook.com', 'fb.com'], key: 'facebook', name: 'Facebook', icon: 'Facebook', color: 'blue-700' },
  { domains: ['youtube.com', 'youtu.be'], key: 'youtube', name: 'YouTube', icon: 'Youtube', color: 'red-600' },
  { domains: ['medium.com'], key: 'medium', name: 'Medium', icon: 'FileText', color: 'gray-700' },
  { domains: ['dev.to'], key: 'dev_to', name: 'DEV', icon: 'Code2', color: 'gray-800' },
  { domains: ['stackoverflow.com'], key: 'stackoverflow', name: 'Stack Overflow', icon: 'HelpCircle', color: 'orange-600' },
  { domains: ['codepen.io'], key: 'codepen', name: 'CodePen', icon: 'Code', color: 'gray-800' },
  { domains: ['gitlab.com'], key: 'gitlab', name: 'GitLab', icon: 'GitBranch', color: 'orange-600' },
  { domains: ['bitbucket.org'], key: 'bitbucket', name: 'Bitbucket', icon: 'GitBranch', color: 'blue-600' },
  { domains: ['figma.com'], key: 'figma', name: 'Figma', icon: 'Figma', color: 'pink-500' },
  { domains: ['t.me', 'telegram.org', 'telegram.me'], key: 'telegram', name: 'Telegram', icon: 'Send', color: 'blue-500' },
  { domains: ['wa.me', 'whatsapp.com'], key: 'whatsapp', name: 'WhatsApp', nameAr: 'واتساب', icon: 'MessageCircle', color: 'success' },
  { domains: ['discord.com', 'discord.gg'], key: 'discord', name: 'Discord', icon: 'MessageSquare', color: 'blue-600' },
  { domains: ['tiktok.com'], key: 'tiktok', name: 'TikTok', icon: 'Music', color: 'gray-800' },
  { domains: ['reddit.com'], key: 'reddit', name: 'Reddit', icon: 'MessageCircle', color: 'orange-600' },
  { domains: ['pinterest.com'], key: 'pinterest', name: 'Pinterest', icon: 'Image', color: 'red-600' },
  { domains: ['twitch.tv'], key: 'twitch', name: 'Twitch', icon: 'Tv', color: 'gray-700' },
  { domains: ['threads.net'], key: 'threads', name: 'Threads', icon: 'AtSign', color: 'gray-800' },
  { domains: ['snapchat.com'], key: 'snapchat', name: 'Snapchat', icon: 'Camera', color: 'warning' },
  { domains: ['notion.so', 'notion.site'], key: 'notion', name: 'Notion', icon: 'FileText', color: 'gray-800' },
];

const WEBSITE = { key: 'website', name: 'Website', nameAr: 'موقع إلكتروني', icon: 'ExternalLink', color: 'accent' };

function hostOf(url) {
  if (typeof url !== 'string' || !url.trim()) return '';
  try {
    const value = /^[a-z][a-z0-9+.-]*:/i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    return new URL(value).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Platform for a social link. The host name decides ("mostaql.com/u/name" is
 * Mostaql whatever the field is called); the settings key is the fallback for
 * odd URLs. Unknown links are a generic website.
 */
export function detectPlatform(url, key = '', lang = 'en') {
  const host = hostOf(url);
  const byHost = host && PLATFORMS.find((p) => p.domains.some((d) => host === d || host.endsWith(`.${d}`)));
  const normalizedKey = String(key || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  const platform = byHost || PLATFORMS.find((p) => p.key === normalizedKey) || WEBSITE;
  return { ...platform, label: lang === 'ar' && platform.nameAr ? platform.nameAr : platform.name };
}

export const PLATFORM_KEYS = PLATFORMS.map((p) => p.key);
