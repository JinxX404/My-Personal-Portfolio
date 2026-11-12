import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SLICE_HEIGHT,
  contiguousReadyHeight,
  framePartsFor,
  planSliceSpans,
  requestCount,
  scrollLimit,
} from './screenshotSlices.mjs';

test('long screenshots split into about 2000px slices', () => {
  assert.equal(SLICE_HEIGHT, 2000);
  assert.deepEqual(planSliceSpans(10083), [
    { y: 0, height: 2000 },
    { y: 2000, height: 2000 },
    { y: 4000, height: 2000 },
    { y: 6000, height: 2000 },
    { y: 8000, height: 2000 },
    { y: 10000, height: 83 },
  ]);
  assert.deepEqual(planSliceSpans(1874), [{ y: 0, height: 1874 }]);
  assert.deepEqual(planSliceSpans(0), []);
});

test('scroll stops at the last decoded slice', () => {
  assert.equal(contiguousReadyHeight([true, false, true], [500, 500, 500]), 500);
  assert.equal(contiguousReadyHeight([true, true], [400, 200]), 600);
  assert.equal(scrollLimit(1250, 620), 630);
  assert.equal(scrollLimit(400, 620), 0);
  assert.equal(scrollLimit(620, 620), 0);
});

test('later slices wait until the decoded prefix catches up', () => {
  const heights = [1250, 1250, 1250, 400];
  assert.equal(requestCount({ viewport: 620, heights, ready: [] }), 1);
  assert.equal(requestCount({ viewport: 620, heights, ready: [true] }), 2);
  assert.equal(requestCount({ viewport: 620, offset: 700, heights, ready: [true, true] }), 3);
  assert.equal(requestCount({
    viewport: 700,
    heights: [400, 400, 400],
    ready: [],
  }), 2);
  assert.equal(requestCount({ heights: [0, 0] }), 1);
  assert.equal(requestCount({ heights: [] }), 0);
});

test('a screenshot without derivatives keeps the original url', () => {
  const manifest = {
    images: {
      'https://cdn.example/long.jpg': {
        slices: [{
          sources: [
            { type: 'image/avif', src: '/screenshot-slices/a/0-1440.avif', width: 1440, height: 2000 },
            { type: 'image/webp', src: '/screenshot-slices/a/0-800.webp', width: 800, height: 1111 },
            { type: 'image/avif', src: '/screenshot-slices/a/0-800.avif', width: 800, height: 1111 },
            { type: 'image/webp', src: '/screenshot-slices/a/0-1440.webp', width: 1440, height: 2000 },
          ],
        }],
      },
    },
  };
  assert.equal(framePartsFor('https://cdn.example/new-upload.jpg', manifest), null);
  const parts = framePartsFor('https://cdn.example/long.jpg', manifest);
  assert.equal(parts[0].src, '/screenshot-slices/a/0-1440.webp');
  assert.equal(parts[0].srcSet, '/screenshot-slices/a/0-800.webp 800w, /screenshot-slices/a/0-1440.webp 1440w');
  assert.equal(parts[0].width, 1440);
  assert.equal(parts[0].height, 2000);
  assert.equal(
    parts[0].avifSrcSet,
    '/screenshot-slices/a/0-800.avif 800w, /screenshot-slices/a/0-1440.avif 1440w'
  );
  assert.equal(parts[0].narrowAvif, '/screenshot-slices/a/0-800.avif');
  assert.equal(parts[0].narrowSrc, '/screenshot-slices/a/0-800.webp');
});
