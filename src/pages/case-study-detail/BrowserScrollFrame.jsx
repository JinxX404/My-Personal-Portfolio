import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from 'components/AppIcon';
import { useReducedMotion } from 'hooks/useReducedMotion';
import { SCROLL_SPEED } from 'lib/screenshotLayout.mjs';

function useFineHover() {
  const [fineHover, setFineHover] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFineHover(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return fineHover;
}

const BrowserScrollFrame = ({ src, title, projectName, onOpen, paused = false }) => {
  const reduced = useReducedMotion();
  const fineHover = useFineHover();
  const viewportRef = useRef(null);
  const imgRef = useRef(null);
  const offsetRef = useRef(0);
  const maxRef = useRef(0);
  const dirRef = useRef(0);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const wantsScrollRef = useRef(false);
  const speedRef = useRef(SCROLL_SPEED.desktop);

  speedRef.current = fineHover ? SCROLL_SPEED.desktop : SCROLL_SPEED.mobile;

  const applyOffset = (value) => {
    offsetRef.current = value;
    if (imgRef.current) {
      imgRef.current.style.transform = `translate3d(0, ${-value}px, 0)`;
    }
  };

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    lastRef.current = 0;
  }, []);

  const tick = useCallback((now) => {
    const last = lastRef.current || now;
    const dt = Math.min(0.05, (now - last) / 1000);
    lastRef.current = now;
    const dir = dirRef.current;
    const max = maxRef.current;
    let next = offsetRef.current + dir * speedRef.current * dt;
    if (next < 0) next = 0;
    if (next > max) next = max;
    applyOffset(next);
    const finished = dir === 0 || (dir > 0 && next >= max) || (dir < 0 && next <= 0);
    if (finished) {
      rafRef.current = 0;
      lastRef.current = 0;
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const play = useCallback((direction) => {
    dirRef.current = direction;
    wantsScrollRef.current = direction > 0;
    if (reduced || paused || maxRef.current <= 1) {
      if (direction <= 0) stop();
      return;
    }
    if (!rafRef.current) {
      lastRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [paused, reduced, stop, tick]);

  const measure = useCallback(() => {
    const image = imgRef.current;
    const viewport = viewportRef.current;
    if (!image || !viewport) return;
    const distance = Math.max(0, Math.round(image.offsetHeight - viewport.clientHeight));
    maxRef.current = distance;
    if (offsetRef.current > distance) applyOffset(distance);
    if (!reduced && !paused && wantsScrollRef.current && distance > 1) play(1);
  }, [paused, play, reduced]);

  useEffect(() => () => stop(), [stop]);

  useEffect(() => {
    if (!reduced) return undefined;
    stop();
    dirRef.current = 0;
    applyOffset(0);
    return undefined;
  }, [reduced, stop]);

  useEffect(() => {
    if (paused) {
      dirRef.current = 0;
      stop();
    } else if (wantsScrollRef.current) {
      play(1);
    }
  }, [paused, play, stop]);

  useEffect(() => {
    if (reduced || fineHover) return undefined;
    const node = viewportRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) play(1);
        else play(-1);
      },
      { threshold: [0, 0.45, 0.8] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [fineHover, play, reduced]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const image = imgRef.current;
    if (!viewport) return undefined;
    const observer = new ResizeObserver(() => measure());
    observer.observe(viewport);
    if (image) observer.observe(image);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden) {
        dirRef.current = 0;
        stop();
      } else if (wantsScrollRef.current) {
        play(1);
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [play, stop]);

  const hint = reduced
    ? 'Scroll inside the frame to move through the page'
    : fineHover
      ? 'Hover to scroll the page'
      : 'Scrolls while this preview is on screen';

  return (
    <figure className="overflow-hidden rounded-2xl bg-[#10182c] shadow-[0_18px_50px_rgba(8,12,24,0.28)] ring-1 ring-white/10">
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#161f35] px-3 py-2.5 sm:px-4">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex h-7 min-w-0 max-w-xs flex-1 items-center justify-center truncate rounded-md bg-white/10 px-3 text-center text-xs font-medium text-white/80 sm:max-w-sm">
          {projectName}
        </div>
        {reduced ? (
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`Open ${title} full screen`}
          >
            <Icon name="ZoomIn" size={16} />
          </button>
        ) : (
          <div className="w-8 shrink-0" aria-hidden="true" />
        )}
      </div>

      <div
        ref={viewportRef}
        className={`relative h-[min(68vh,620px)] ${
          reduced ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'
        }`}
        onMouseEnter={() => {
          if (fineHover) play(1);
        }}
        onMouseLeave={() => {
          if (fineHover) play(-1);
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          onLoad={measure}
          className="pointer-events-none block h-auto w-full max-w-none select-none"
        />
        {!reduced && (
          <button
            type="button"
            onClick={onOpen}
            className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            aria-label={`Open ${title} full screen`}
          />
        )}
      </div>

      <figcaption className="px-4 py-2 text-center text-[11px] tracking-wide text-white/55">
        <span className="sr-only">{title}. </span>
        {hint}
      </figcaption>
    </figure>
  );
};

export default BrowserScrollFrame;
