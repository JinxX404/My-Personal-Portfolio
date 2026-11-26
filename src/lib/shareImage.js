// Link preview ("share") image for a project, drawn on a canvas in the admin's
// browser. The browser shapes Arabic and lays out mixed right-to-left text
// itself, which server-side renderers do poorly; the result is a 1200x630 PNG.
import { translateTerm } from '../i18n/content.mjs';

export const SHARE_WIDTH = 1200;
export const SHARE_HEIGHT = 630;

const FONTS = {
  en: '"Inter", "Segoe UI", Arial, sans-serif',
  ar: '"IBM Plex Sans Arabic", "Segoe UI", Tahoma, Arial, sans-serif',
};

const COLORS = {
  background: '#0b1020',
  glow: 'rgba(99, 102, 241, 0.45)',
  accent: '#a5b4fc',
  title: '#f8fafc',
  body: '#cbd5e1',
  muted: '#94a3b8',
  rule: 'rgba(148, 163, 184, 0.25)',
};

const SITE = 'moatazz.site';

const RTL_CHAR = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
const LTR_CHAR = /[A-Za-z\u00C0-\u024F]/;

/** Direction of the first strong character (like dir="auto"); `fallback` when there is none. */
export function textDirection(value, fallback = 'ltr') {
  for (const char of String(value || '')) {
    if (RTL_CHAR.test(char)) return 'rtl';
    if (LTR_CHAR.test(char)) return 'ltr';
  }
  return fallback;
}

// Each line keeps its own direction (English shown on the Arabic image stays
// left-to-right) while sitting on the layout's start edge.
function fillLine(ctx, line, x, y, layoutRtl) {
  ctx.direction = textDirection(line, layoutRtl ? 'rtl' : 'ltr');
  ctx.textAlign = layoutRtl ? 'right' : 'left';
  ctx.fillText(line, x, y);
}

/** Waits for the web fonts the image uses (they are on the page already). */
export async function loadShareFonts() {
  if (typeof document === 'undefined' || !document.fonts?.load) return;
  const loads = [];
  for (const weight of [400, 600, 700]) {
    loads.push(document.fonts.load(`${weight} 40px "IBM Plex Sans Arabic"`, 'عربي'));
    loads.push(document.fonts.load(`${weight} 40px "Inter"`, 'Aa'));
  }
  await Promise.allSettled(loads);
}

/** Loads an image for drawing; resolves null when it cannot be used (missing, CORS, error). */
export function loadImage(src, { timeoutMs = 8000 } = {}) {
  return new Promise((resolve) => {
    if (!src || typeof Image === 'undefined') return resolve(null);
    const image = new Image();
    const timer = setTimeout(() => resolve(null), timeoutMs);
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => { clearTimeout(timer); resolve(image.naturalWidth ? image : null); };
    image.onerror = () => { clearTimeout(timer); resolve(null); };
    image.src = src;
  });
}

/**
 * Splits text into at most `maxLines` lines that fit `maxWidth`, adding an
 * ellipsis when it had to cut. Works for Arabic: lines are measured as whole
 * strings, so the browser's shaping is included in the width.
 */
export function wrapText(ctx, value, maxWidth, maxLines) {
  const words = String(value || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let current = '';
  let index = 0;
  for (; index < words.length; index += 1) {
    const next = current ? `${current} ${words[index]}` : words[index];
    if (ctx.measureText(next).width <= maxWidth || !current) {
      current = next;
    } else {
      lines.push(current);
      current = words[index];
      if (lines.length === maxLines) break;
    }
  }
  if (lines.length < maxLines && current) {
    lines.push(current);
    current = '';
    index = words.length;
  }
  const cut = index < words.length || current;
  if (cut && lines.length) {
    let last = lines[lines.length - 1];
    while (last.includes(' ') && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, last.lastIndexOf(' '));
    }
    lines[lines.length - 1] = `${last}…`;
  }
  return lines;
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCover(ctx, image, x, y, w, h) {
  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) / 2;
  ctx.save();
  roundedRect(ctx, x, y, w, h, 24);
  ctx.clip();
  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
  ctx.save();
  roundedRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 24);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws the share image on `canvas` (resized to 1200x630).
 * content: { lang, title, description, category, name, role, image (HTMLImageElement|null) }
 */
export function drawShareImage(canvas, content) {
  const lang = content.lang === 'ar' ? 'ar' : 'en';
  const rtl = lang === 'ar';
  const font = FONTS[lang];
  canvas.width = SHARE_WIDTH;
  canvas.height = SHARE_HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.direction = rtl ? 'rtl' : 'ltr';
  ctx.textBaseline = 'alphabetic';

  // Background and a soft glow on the text side.
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);
  const glow = ctx.createRadialGradient(rtl ? SHARE_WIDTH - 160 : 160, 80, 20, rtl ? SHARE_WIDTH - 160 : 160, 80, 700);
  glow.addColorStop(0, COLORS.glow);
  glow.addColorStop(1, 'rgba(11,16,32,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);

  const margin = 72;
  const hasImage = Boolean(content.image);
  const imageW = 440;
  const textW = hasImage ? SHARE_WIDTH - margin * 2 - imageW - 56 : SHARE_WIDTH - margin * 2;
  // Start edge of the text column: left in English, right in Arabic.
  const startX = rtl ? SHARE_WIDTH - margin : margin;
  ctx.textAlign = rtl ? 'right' : 'left';

  if (hasImage) {
    const x = rtl ? margin : SHARE_WIDTH - margin - imageW;
    drawCover(ctx, content.image, x, margin, imageW, SHARE_HEIGHT - margin * 2);
  }

  let y = margin + 30;
  const category = translateTerm(content.category || '', lang);
  if (category) {
    ctx.font = `600 24px ${font}`;
    ctx.fillStyle = COLORS.accent;
    fillLine(ctx, category, startX, y, rtl);
    y += 30;
  }

  // Title: the largest size (64 -> 44) that fits in three lines.
  const title = content.title || '';
  let size = 64;
  let titleLines = [];
  for (; size >= 44; size -= 4) {
    ctx.font = `700 ${size}px ${font}`;
    titleLines = wrapText(ctx, title, textW, 3);
    if (!titleLines.some((line) => line.endsWith('…'))) break;
  }
  size = Math.max(size, 44);
  const titleLead = Math.round(size * (rtl ? 1.38 : 1.18));
  ctx.fillStyle = COLORS.title;
  y += size;
  for (const line of titleLines) {
    fillLine(ctx, line, startX, y, rtl);
    y += titleLead;
  }

  // Description: as many lines (up to three) as fit above the footer.
  const footerY = SHARE_HEIGHT - margin;
  const ruleY = footerY - 52;
  const descSize = 26;
  const descLead = Math.round(descSize * (rtl ? 1.6 : 1.45));
  const lastTitleBaseline = y - titleLead;
  const firstDescBaseline = lastTitleBaseline + (rtl ? 44 : 32) + descSize;
  const room = Math.floor((ruleY - 28 - firstDescBaseline) / descLead) + 1;
  if (content.description && room > 0) {
    ctx.font = `400 ${descSize}px ${font}`;
    ctx.fillStyle = COLORS.body;
    let dy = firstDescBaseline;
    for (const line of wrapText(ctx, content.description, textW, Math.min(3, room))) {
      fillLine(ctx, line, startX, dy, rtl);
      dy += descLead;
    }
  }

  // Footer: rule, name and role, site.
  ctx.fillStyle = COLORS.rule;
  ctx.fillRect(rtl ? startX - textW : startX, ruleY, textW, 1);
  ctx.font = `500 22px ${FONTS.en}`;
  const siteWidth = ctx.measureText(SITE).width;
  ctx.font = `600 24px ${font}`;
  ctx.fillStyle = COLORS.title;
  const nameRoom = textW - siteWidth - 32;
  const full = [content.name, content.role].filter(Boolean).join(' · ');
  // Name and role when they fit, otherwise the name alone (never a cut role).
  const name = ctx.measureText(full).width <= nameRoom ? full : content.name || full;
  const nameLine = wrapText(ctx, name, nameRoom, 1)[0] || '';
  fillLine(ctx, nameLine, startX, footerY, rtl);
  ctx.font = `500 22px ${FONTS.en}`;
  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = rtl ? 'left' : 'right';
  ctx.direction = 'ltr';
  ctx.fillText(SITE, rtl ? startX - textW : startX + textW, footerY);
  return canvas;
}

/** PNG blob of a drawn canvas. */
export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not create the image'))), 'image/png');
  });
}
