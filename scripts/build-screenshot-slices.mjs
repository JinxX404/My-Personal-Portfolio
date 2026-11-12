// Download each published full-page screenshot and write sliced AVIF/WebP
// derivatives into public/screenshot-slices, plus a manifest the gallery
// uses. Screenshots that are not listed keep using their original URL.
//
// Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (public client env).
// Image transforms are not enabled on this Supabase project, and the anon
// key cannot upload, so the files are static assets served by Netlify.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { explicitLayout } from '../src/lib/screenshotLayout.mjs';
import {
  DESKTOP_WIDTH,
  NARROW_WIDTH,
  SLICE_HEIGHT,
  planSliceSpans,
} from '../src/lib/screenshotSlices.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/screenshot-slices');
const manifestPath = join(root, 'src/data/screenshot-slices.json');

const WEBP = { quality: 88, effort: 5, smartSubsample: true };
const AVIF = { quality: 60, effort: 4, chromaSubsampling: '4:4:4' };

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

function screenshotUrl(item) {
  if (typeof item === 'string') return item;
  return item?.url || item?.image || '';
}

async function fetchProjects(url, key) {
  const response = await fetch(
    `${url}/rest/v1/projects?select=id,title,screenshots&publishing_status=in.(published,in_progress)&visibility=eq.public`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!response.ok) throw new Error(`Projects request failed (${response.status})`);
  return response.json();
}

async function encodePair(input, extract, width, height) {
  const resized = sharp(input).extract(extract).resize(width, height, { fit: 'fill' });
  const webp = await resized.clone().webp(WEBP).toBuffer();
  const avif = await resized.clone().avif(AVIF).toBuffer();
  return { webp, avif };
}

function writeDerivative(dir, index, width, ext, bytes) {
  const hash = createHash('sha1').update(bytes).digest('hex').slice(0, 8);
  const name = `${index}-${width}-${hash}.${ext}`;
  writeFileSync(join(dir, name), bytes);
  return name;
}

async function buildOne(project, item) {
  const src = screenshotUrl(item);
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Download failed ${response.status} ${src}`);
  const input = Buffer.from(await response.arrayBuffer());
  const meta = await sharp(input).metadata();
  const outputWidth = Math.min(meta.width, DESKTOP_WIDTH);
  const outputHeight = Math.round(meta.height * (outputWidth / meta.width));
  const spans = planSliceSpans(outputHeight, SLICE_HEIGHT);
  const dir = join(outDir, project.id);
  mkdirSync(dir, { recursive: true });

  const slices = [];
  const totals = { avifDesktop: 0, webpDesktop: 0, avifNarrow: 0, webpNarrow: 0 };
  for (let index = 0; index < spans.length; index += 1) {
    const span = spans[index];
    const scale = meta.width / outputWidth;
    let top = Math.round(span.y * scale);
    let bottom = Math.round((span.y + span.height) * scale);
    bottom = Math.min(meta.height, Math.max(top + 1, bottom));
    top = Math.min(top, bottom - 1);
    const extract = { left: 0, top, width: meta.width, height: bottom - top };
    const desktopHeight = span.height;
    const widths = outputWidth > NARROW_WIDTH ? [NARROW_WIDTH, outputWidth] : [outputWidth];
    const sources = [];

    for (const width of widths) {
      const height = Math.max(1, Math.round(desktopHeight * (width / outputWidth)));
      const encoded = await encodePair(input, extract, width, height);
      const webpMeta = await sharp(encoded.webp).metadata();
      const avifName = writeDerivative(dir, index, webpMeta.width, 'avif', encoded.avif);
      const webpName = writeDerivative(dir, index, webpMeta.width, 'webp', encoded.webp);
      const base = `/screenshot-slices/${project.id}`;
      sources.push({
        type: 'image/avif',
        src: `${base}/${avifName}`,
        width: webpMeta.width,
        height: webpMeta.height,
        bytes: encoded.avif.length,
      });
      sources.push({
        type: 'image/webp',
        src: `${base}/${webpName}`,
        width: webpMeta.width,
        height: webpMeta.height,
        bytes: encoded.webp.length,
      });
      if (width === outputWidth) {
        totals.avifDesktop += encoded.avif.length;
        totals.webpDesktop += encoded.webp.length;
      } else {
        totals.avifNarrow += encoded.avif.length;
        totals.webpNarrow += encoded.webp.length;
      }
    }

    const desktop = sources.find((source) => source.type === 'image/webp' && source.width === outputWidth)
      || sources.find((source) => source.type === 'image/webp');
    slices.push({
      y: span.y,
      width: desktop.width,
      height: desktop.height,
      sources,
    });
  }

  if (outputWidth <= NARROW_WIDTH) {
    totals.avifNarrow = totals.avifDesktop;
    totals.webpNarrow = totals.webpDesktop;
  }

  return {
    src,
    projectId: project.id,
    title: project.title,
    width: outputWidth,
    height: outputHeight,
    originalBytes: input.length,
    bytes: totals,
    slices,
  };
}

loadEnv(join(root, '.env.local'));
loadEnv(join(root, '.env'));

const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before building slices.');
}

const projects = await fetchProjects(supabaseUrl, supabaseKey);
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
mkdirSync(dirname(manifestPath), { recursive: true });

const images = {};
const rows = [];
for (const project of projects) {
  const shots = Array.isArray(project.screenshots) ? project.screenshots : [];
  const scrolls = shots.filter((item) => explicitLayout(item) === 'scroll' && screenshotUrl(item));
  if (!scrolls.length) {
    console.warn(`No full-page screenshot for ${project.title}`);
    continue;
  }
  for (const item of scrolls) {
    const built = await buildOne(project, item);
    images[built.src] = {
      projectId: built.projectId,
      title: built.title,
      width: built.width,
      height: built.height,
      originalBytes: built.originalBytes,
      bytes: built.bytes,
      slices: built.slices,
    };
    rows.push(built);
    console.log(`${built.title}: ${built.slices.length} slices, original ${built.originalBytes}`);
  }
}

const manifest = {
  sliceHeight: SLICE_HEIGHT,
  desktopWidth: DESKTOP_WIDTH,
  narrowWidth: NARROW_WIDTH,
  webpQuality: WEBP.quality,
  avifQuality: AVIF.quality,
  images,
};
writeFileSync(manifestPath, `${JSON.stringify(manifest)}\n`);

console.log('\nProject | original | desktop AVIF | phone AVIF | first desktop | first phone');
for (const row of rows) {
  const first = row.slices[0];
  const firstDesktop = first.sources.find((source) => source.type === 'image/avif' && source.width === row.width);
  const firstPhone = first.sources.find((source) => source.type === 'image/avif' && source.width <= NARROW_WIDTH);
  console.log([
    row.title.slice(0, 28),
    row.originalBytes,
    row.bytes.avifDesktop,
    row.bytes.avifNarrow,
    firstDesktop?.bytes || 0,
    firstPhone?.bytes || 0,
  ].join(' | '));
}
