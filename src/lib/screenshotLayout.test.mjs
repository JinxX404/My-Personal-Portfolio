import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAX_SCREENSHOTS,
  SCROLL_SPEED,
  arrangeBento,
  classifyScreenshot,
  explicitLayout,
  frameScrollAllowed,
  resolveScreenshotKind,
  screenshotLimitMessage,
  screenshotsWithinLimit,
  scrollDurationMs,
  scrollFrameUrl,
  splitGallery,
  toStoredScreenshot,
} from './screenshotLayout.mjs';

test('existing landscape screenshots stay tiles', () => {
  assert.equal(classifyScreenshot({ width: 1920, height: 1200 }), 'tile');
});

test('phone screenshots, including retina widths, use the phone frame', () => {
  assert.equal(classifyScreenshot({ width: 780, height: 1688 }), 'phone');
  assert.equal(classifyScreenshot({ width: 1170, height: 2532 }), 'phone');
  assert.equal(classifyScreenshot({ width: 1290, height: 2796 }), 'phone');
});

test('wide full-page captures use the browser scroll frame', () => {
  assert.equal(classifyScreenshot({ width: 1440, height: 4000 }), 'scroll');
  assert.equal(classifyScreenshot({ width: 1920, height: 3500 }), 'scroll');
  assert.equal(classifyScreenshot({ width: 1280, height: 5000 }), 'scroll');
});

test('an explicit layout overrides the measured shape', () => {
  assert.equal(
    classifyScreenshot({ width: 780, height: 1688, layout: 'scroll' }),
    'scroll'
  );
  assert.equal(
    classifyScreenshot({ width: 1920, height: 5000, layout: 'tile' }),
    'tile'
  );
});

test('unmeasured images stay unknown until a size or a layout exists', () => {
  assert.equal(classifyScreenshot({}), 'unknown');
  assert.equal(classifyScreenshot({ layout: 'phone' }), 'phone');
});

test('layout aliases on stored screenshot objects', () => {
  assert.equal(explicitLayout('https://example.com/a.jpg'), null);
  assert.equal(explicitLayout({ url: 'https://example.com/a.jpg' }), null);
  assert.equal(explicitLayout({ layout: 'full-page' }), 'scroll');
  assert.equal(explicitLayout({ layout: 'fullpage' }), 'scroll');
  assert.equal(explicitLayout({ layout: 'Full-page scroll' }), 'scroll');
  assert.equal(explicitLayout({ fullPage: true }), 'scroll');
  assert.equal(explicitLayout({ device: 'phone' }), 'phone');
  assert.equal(explicitLayout({ layout: 'auto' }), null);
  assert.equal(explicitLayout({ layout: 'tile' }), 'tile');
});

test('a project can store up to 15 screenshots', () => {
  assert.equal(MAX_SCREENSHOTS, 15);
  assert.equal(screenshotsWithinLimit(undefined), true);
  assert.equal(screenshotsWithinLimit(null), true);
  assert.equal(screenshotsWithinLimit({ url: 'https://cdn.example/legacy.jpg' }), true);
  assert.equal(screenshotsWithinLimit(Array.from({ length: 15 }, (_, index) => `https://cdn.example/${index}.jpg`)), true);
  assert.equal(screenshotsWithinLimit(Array.from({ length: 16 }, () => ({ url: 'https://cdn.example/a.jpg', layout: 'scroll' }))), false);
  assert.match(screenshotLimitMessage(), /15/);
});

test('full-page shots lead the gallery regardless of stored order', () => {
  const shots = [
    { id: 'tile', width: 1920, height: 1200 },
    { id: 'explicit', layout: 'fullpage', width: 800, height: 600 },
    { id: 'phone', width: 1170, height: 2532 },
    { id: 'auto', width: 1440, height: 4000 },
    'https://cdn.example/legacy.jpg',
  ];
  const { fullPage, rest } = splitGallery(shots);
  assert.deepEqual(fullPage.map((item) => item.id || item), ['explicit', 'auto']);
  assert.deepEqual(rest.map((item) => item.id || item), [
    'tile',
    'phone',
    'https://cdn.example/legacy.jpg',
  ]);
});

test('two full-page shots keep their stored order ahead of the bento', () => {
  const shots = [
    { id: 'late', layout: 'full-page scroll' },
    { id: 'tile', kind: 'tile' },
    { id: 'early', width: 1920, height: 4200 },
  ];
  const { fullPage, rest } = splitGallery(shots);
  assert.deepEqual(fullPage.map((item) => item.id), ['late', 'early']);
  assert.deepEqual(rest.map((item) => item.id), ['tile']);
});

test('a failed image probe still honors an explicit full-page layout', () => {
  assert.equal(resolveScreenshotKind({ layout: 'fullpage' }, { failed: true }), 'scroll');
  assert.equal(resolveScreenshotKind({ url: 'https://cdn.example/a.jpg' }, { failed: true }), 'tile');
  assert.equal(resolveScreenshotKind({ layout: 'scroll' }, { width: 1920, height: 1080 }), 'scroll');
});

test('scroll duration scales with image travel', () => {
  const short = scrollDurationMs(300, SCROLL_SPEED.desktop);
  const tall = scrollDurationMs(3000, SCROLL_SPEED.desktop);
  assert.ok(tall > short * 5);
  assert.equal(scrollDurationMs(1500, 150), 10000);
  assert.ok(scrollDurationMs(1500, SCROLL_SPEED.mobile) > scrollDurationMs(1500, SCROLL_SPEED.desktop));
});

test('storage stays a string unless the editor set a layout or caption', () => {
  assert.equal(toStoredScreenshot('https://cdn.example/a.jpg', null), 'https://cdn.example/a.jpg');
  assert.equal(toStoredScreenshot('https://cdn.example/a.jpg', { layout: 'auto' }), 'https://cdn.example/a.jpg');
  assert.deepEqual(
    toStoredScreenshot('https://cdn.example/a.jpg', { layout: 'scroll' }),
    { url: 'https://cdn.example/a.jpg', layout: 'scroll' }
  );
  assert.equal(toStoredScreenshot('blob:http://local/1', { layout: 'phone' }), null);
});

test('bento places a phone beside the lead tile and keeps source indexes', () => {
  const items = [
    { kind: 'tile', id: 'a' },
    { kind: 'tile', id: 'b' },
    { kind: 'tile', id: 'c' },
    { kind: 'phone', id: 'p' },
  ];
  const arranged = arrangeBento(items);
  assert.deepEqual(
    arranged.map((item) => [item.id, item.span, item.index]),
    [
      ['a', 'large', 0],
      ['p', 'phone', 3],
      ['b', 'small', 1],
      ['c', 'small', 2],
    ]
  );
});

test('a single landscape screenshot spans the collage', () => {
  const [only] = arrangeBento([{ kind: 'tile', id: 'a' }]);
  assert.equal(only.span, 'hero');
});

test('the browser frame does not scroll until the screenshot is ready to paint', () => {
  assert.equal(frameScrollAllowed(), false);
  assert.equal(frameScrollAllowed({ ready: false, distance: 4800 }), false);
  assert.equal(frameScrollAllowed({ ready: true, distance: 0 }), false);
  assert.equal(frameScrollAllowed({ ready: true, distance: 1 }), false);
  assert.equal(frameScrollAllowed({ ready: true, reduced: true, distance: 4800 }), false);
  assert.equal(frameScrollAllowed({ ready: true, paused: true, distance: 4800 }), false);
  assert.equal(frameScrollAllowed({ ready: true, distance: 4800 }), true);
});

test('full-page frames keep the original object URL', () => {
  const src =
    'https://project.supabase.co/storage/v1/object/public/project-images/screenshots/page.jpg';
  assert.equal(scrollFrameUrl(src), src);
  assert.equal(scrollFrameUrl(src).includes('/render/image/'), false);
  assert.equal(scrollFrameUrl(null), '');
});
