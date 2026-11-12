import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from 'components/AppIcon';
import { useReducedMotion } from 'hooks/useReducedMotion';
import { preloadImages } from 'lib/preloadImage.mjs';
import {
  arrangeBento,
  explicitLayout,
  resolveScreenshotKind,
  scrollFrameUrl,
  splitGallery,
} from 'lib/screenshotLayout.mjs';
import BrowserScrollFrame from './BrowserScrollFrame';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const controlClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black';

const SPAN_CLASS = {
  hero: 'col-span-2 row-span-2 md:col-span-4',
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  small: 'col-span-1 row-span-1',
  phone: 'col-span-1 row-span-2',
};

export function normalizeGalleryImages(screenshots) {
  if (!Array.isArray(screenshots)) return [];

  return screenshots
    .map((item, index) => {
      const src = typeof item === 'string' ? item : item?.url || item?.image;
      if (!src || typeof src !== 'string') return null;
      const title =
        typeof item === 'string'
          ? `Screenshot ${index + 1}`
          : item?.caption || item?.title || `Screenshot ${index + 1}`;
      const width = Number(item?.width);
      const height = Number(item?.height);
      return {
        src,
        title,
        id: `${index}-${src}`,
        layout: explicitLayout(item),
        width: Number.isFinite(width) && width > 0 ? width : null,
        height: Number.isFinite(height) && height > 0 ? height : null,
      };
    })
    .filter(Boolean);
}

function useImageMetrics(images) {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    let cancelled = false;
    // An explicit layout already knows how to present the file. Probing it
    // would download the long page capture twice and fight the preload.
    const deferProbes = images.some((image) => image.layout === 'scroll');
    images.forEach((image) => {
      if (image.width && image.height) {
        setMetrics((current) =>
          current[image.id]
            ? current
            : { ...current, [image.id]: { width: image.width, height: image.height } }
        );
        return;
      }
      if (image.layout === 'scroll' || image.layout === 'phone' || image.layout === 'tile') return;

      const probe = new Image();
      probe.decoding = 'async';
      try {
        probe.fetchPriority = deferProbes ? 'low' : 'auto';
      } catch {
        // Older browsers ignore fetch priority on Image.
      }
      probe.onload = () => {
        if (cancelled) return;
        setMetrics((current) => ({
          ...current,
          [image.id]: { width: probe.naturalWidth, height: probe.naturalHeight },
        }));
      };
      probe.onerror = () => {
        if (cancelled) return;
        setMetrics((current) => ({
          ...current,
          [image.id]: { failed: true },
        }));
      };
      probe.src = image.src;
    });
    return () => {
      cancelled = true;
    };
  }, [images]);

  return metrics;
}

function nextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

function GalleryStill({ src, className, reduced, tone = 'light' }) {
  const ref = useRef(null);
  const flightRef = useRef(0);
  const [phase, setPhase] = useState('loading');

  const reveal = useCallback(async (image, flight) => {
    try {
      if (typeof image.decode === 'function') await image.decode();
    } catch {
      if (flight !== flightRef.current) return;
      if (!image.complete || image.naturalWidth === 0) {
        setPhase('error');
        return;
      }
    }
    if (flight !== flightRef.current) return;
    await nextPaint();
    if (flight !== flightRef.current) return;
    setPhase('ready');
  }, []);

  useEffect(() => {
    const flight = ++flightRef.current;
    setPhase('loading');
    const image = ref.current;
    if (image?.complete && image.naturalWidth > 0) reveal(image, flight);
    return () => {
      flightRef.current += 1;
    };
  }, [reveal, src]);

  const onLoad = (event) => {
    reveal(event.currentTarget, flightRef.current);
  };

  const shimmer = tone === 'dark' ? 'gallery-shimmer' : 'gallery-shimmer-light';
  const still = reduced ? 'bg-white/10' : shimmer;

  return (
    <>
      {phase !== 'ready' && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${phase === 'error' ? 'bg-white/10' : still}`}
        />
      )}
      <img
        ref={ref}
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        onLoad={onLoad}
        onError={() => setPhase('error')}
        style={reduced ? undefined : { transition: 'opacity 500ms ease-out, transform 500ms ease-out' }}
        className={`${className} ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}

function PhoneTile({ image, onOpen, reduced }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${image.title} full screen`}
      className={`${SPAN_CLASS.phone} group relative flex items-center justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300`}
    >
      <span className="relative flex h-[92%] max-h-[440px] w-auto items-center justify-center">
        <span className="relative block h-full aspect-[9/19.5] rounded-[1.65rem] bg-[#070b14] p-[7px] shadow-[0_16px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/15 transition-transform duration-300 motion-safe:group-hover:-translate-y-1">
          <span
            className="absolute left-1/2 top-[9px] z-10 h-3.5 w-12 -translate-x-1/2 rounded-full bg-black"
            aria-hidden="true"
          />
          <span className="relative block h-full w-full overflow-hidden rounded-[1.25rem]">
            <GalleryStill
              src={image.src}
              reduced={reduced}
              tone="dark"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </span>
        </span>
      </span>
    </button>
  );
}

function Tile({ image, span, onOpen, reduced }) {
  const showEntireShot = span === 'large' || span === 'hero';
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${image.title} full screen`}
      className={`${SPAN_CLASS[span] || SPAN_CLASS.small} group relative overflow-hidden rounded-2xl bg-[#f6f3ee] shadow-[0_10px_30px_rgba(8,12,24,0.18)] ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300`}
    >
      <GalleryStill
        src={image.src}
        reduced={reduced}
        className={`absolute inset-0 h-full w-full ${
          showEntireShot ? 'object-contain' : 'object-cover object-top'
        } ${reduced ? '' : 'group-hover:scale-[1.035]'}`}
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Icon name="ZoomIn" size={15} />
      </span>
    </button>
  );
}

const ProjectGallery = ({ images, projectTitle = 'Project' }) => {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [gaveUpWaiting, setGaveUpWaiting] = useState(false);
  const galleryRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const touchStart = useRef(null);
  const titleId = useId();
  const reduced = useReducedMotion();
  const metrics = useImageMetrics(images);

  useEffect(() => {
    setGaveUpWaiting(false);
    const timer = setTimeout(() => setGaveUpWaiting(true), 4000);
    return () => clearTimeout(timer);
  }, [images]);

  const decorated = images.map((image, sourceIndex) => {
    const measured = metrics[image.id];
    let kind = resolveScreenshotKind(image, measured);
    if (kind === 'unknown' && gaveUpWaiting) kind = 'tile';
    return {
      ...image,
      index: sourceIndex,
      kind,
    };
  });

  // Full-page frames stay above the bento even when later shots are still
  // measuring, and even when a full-page shot was stored in the middle.
  const { fullPage, rest } = splitGallery(decorated);
  const pending = rest.some((image) => image.kind === 'unknown');
  const bento = pending ? [] : arrangeBento(rest);
  const scrollSrcKey = fullPage
    .map((image) => scrollFrameUrl(image.src))
    .filter(Boolean)
    .join('|');

  useLayoutEffect(() => {
    if (!scrollSrcKey) return;
    preloadImages(scrollSrcKey.split('|'));
  }, [scrollSrcKey]);

  const safeIndex = count ? ((index % count) + count) % count : 0;
  const current = images[safeIndex];

  const go = useCallback(
    (delta) => {
      if (count < 2) return;
      setIndex((value) => (value + delta + count) % count);
    },
    [count]
  );

  const close = useCallback(() => setOpen(false), []);

  const openAt = (imageIndex, event) => {
    triggerRef.current = event.currentTarget;
    setIndex(imageIndex);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    const closeButton = dialog?.querySelector('[aria-label="Close gallery"]');
    (closeButton || dialog)?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      const dialog = dialogRef.current;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(1);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;

      const items = [...dialog.querySelectorAll(FOCUSABLE)];
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || active === dialog || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }
      if (active === last || active === dialog || !dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, go, close]);

  const onTouchStart = (event) => {
    if (event.target.closest('[data-no-swipe]')) {
      touchStart.current = null;
      return;
    }
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  if (!count) return null;

  const counter = `${safeIndex + 1} / ${count}`;

  const lightbox = open && current
    ? createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="fixed inset-0 z-[80] flex flex-col bg-black text-white outline-none"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <p id={titleId} className="min-w-0 flex-1 truncate text-sm font-medium">
              {current.title}
            </p>
            <p className="shrink-0 text-sm font-semibold tabular-nums" aria-live="polite" aria-atomic="true">
              {counter}
            </p>
            <button type="button" className={controlClass} onClick={close} aria-label="Close gallery">
              <Icon name="X" size={22} />
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={current.src}
              alt={current.title}
              className="absolute inset-0 h-full w-full object-contain px-4 py-3 sm:px-14"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  className={`${controlClass} absolute left-3 top-1/2 z-10 -translate-y-1/2`}
                  onClick={() => go(-1)}
                  data-no-swipe=""
                  aria-label="Previous image"
                >
                  <Icon name="ChevronLeft" size={22} />
                </button>
                <button
                  type="button"
                  className={`${controlClass} absolute right-3 top-1/2 z-10 -translate-y-1/2`}
                  onClick={() => go(1)}
                  data-no-swipe=""
                  aria-label="Next image"
                >
                  <Icon name="ChevronRight" size={22} />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 py-3" role="list">
            {images.map((image, imageIndex) => {
              const selected = imageIndex === safeIndex;
              return (
                <button
                  key={image.id}
                  type="button"
                  role="listitem"
                  data-no-swipe=""
                  aria-label={`Show image ${imageIndex + 1} of ${count}: ${image.title}`}
                  aria-current={selected ? 'true' : undefined}
                  onClick={() => setIndex(imageIndex)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    selected ? 'border-accent opacity-100' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={image.src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <section id="gallery" ref={galleryRef} className="scroll-mt-24" aria-labelledby="gallery-heading">
      <div className="rounded-lg border border-border bg-surface p-4 shadow-sm dark:border-border-strong dark:bg-surface sm:p-8">
        <h2 id="gallery-heading" className="mb-4 text-3xl font-bold text-text-primary dark:text-white">
          Gallery
        </h2>

        <div className="space-y-4 rounded-2xl bg-[#0c1222] p-3 shadow-inner ring-1 ring-white/10 sm:p-4">
          {fullPage.map((image) => (
            <BrowserScrollFrame
              key={image.id}
              src={scrollFrameUrl(image.src)}
              title={image.title}
              projectName={projectTitle}
              paused={open}
              onOpen={(event) => openAt(image.index, event)}
            />
          ))}

          {pending && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-hidden="true">
              {rest.map((image) => (
                <div
                  key={image.id}
                  className={`aspect-video rounded-2xl ${reduced ? 'bg-white/10' : 'gallery-shimmer'}`}
                />
              ))}
            </div>
          )}

          {!pending && bento.length > 0 && (
            <div className="grid grid-cols-2 auto-rows-[132px] gap-3 sm:auto-rows-[148px] md:grid-cols-4 md:auto-rows-[156px] md:gap-4">
              {bento.map((image) =>
                image.span === 'phone' ? (
                  <PhoneTile
                    key={image.id}
                    image={image}
                    reduced={reduced}
                    onOpen={(event) => openAt(image.index, event)}
                  />
                ) : (
                  <Tile
                    key={image.id}
                    image={image}
                    span={image.span}
                    reduced={reduced}
                    onOpen={(event) => openAt(image.index, event)}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
      {lightbox}
    </section>
  );
};

export default ProjectGallery;
