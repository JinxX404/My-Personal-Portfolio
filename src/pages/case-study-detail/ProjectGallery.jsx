import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from 'components/AppIcon';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const controlClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black';

export function normalizeGalleryImages(screenshots) {
  if (!Array.isArray(screenshots)) return [];

  return screenshots
    .map((item, index) => {
      const src = typeof item === 'string' ? item : item?.url || item?.image;
      if (!src) return null;
      const title =
        typeof item === 'string'
          ? `Screenshot ${index + 1}`
          : item?.caption || item?.title || `Screenshot ${index + 1}`;
      return { src, title, id: `${index}-${src}` };
    })
    .filter(Boolean);
}

const ProjectGallery = ({ images }) => {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const galleryRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const touchStart = useRef(null);
  const swiped = useRef(false);
  const titleId = useId();
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

  const openLightbox = (event) => {
    triggerRef.current = event.currentTarget;
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
    const onKey = (event) => {
      const gallery = galleryRef.current;
      const dialog = dialogRef.current;
      const inGallery = Boolean(gallery && gallery.contains(document.activeElement));
      if (!open && !inGallery) return;

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
      if (!open) return;

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
    swiped.current = true;
    go(dx < 0 ? 1 : -1);
  };

  const openFromTap = (event) => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    openLightbox(event);
  };

  if (!current) return null;

  const counter = `${safeIndex + 1} / ${count}`;

  const renderArrows = () =>
    count > 1 ? (
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
    ) : null;

  const renderThumbnails = (onDark) => (
    <div className="flex gap-2 overflow-x-auto py-1" role="list">
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
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              onDark
                ? 'focus-visible:ring-white focus-visible:ring-offset-black'
                : 'focus-visible:ring-accent-400 focus-visible:ring-offset-background'
            } ${selected ? 'border-accent opacity-100' : 'border-transparent opacity-80 hover:opacity-100'}`}
          >
            <img src={image.src} alt="" className="h-full w-full object-cover" />
          </button>
        );
      })}
    </div>
  );

  const lightbox = open
    ? createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="fixed inset-0 z-[80] flex flex-col bg-black/95 text-white outline-none"
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
              className="absolute inset-0 h-full w-full object-contain px-14 py-3"
            />
            {renderArrows()}
          </div>

          <div className="px-4 pb-4">{renderThumbnails(true)}</div>
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

        <div
          className="relative flex items-center justify-center overflow-hidden rounded-xl bg-primary-900 touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={current.src}
            alt=""
            style={{ maxHeight: 'min(70vh, 720px)' }}
            className="block h-auto w-auto max-w-full object-contain"
          />
          <button
            type="button"
            className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            onClick={openFromTap}
            aria-label={`Open ${current.title} full screen`}
          />
          {renderArrows()}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-text-secondary dark:text-white/70">{current.title}</p>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-text-primary dark:text-white" aria-live="polite" aria-atomic="true">
            {counter}
          </p>
        </div>
        <div className="mt-4">{renderThumbnails(false)}</div>
      </div>
      {lightbox}
    </section>
  );
};

export default ProjectGallery;
