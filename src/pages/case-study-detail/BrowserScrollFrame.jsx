import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from 'components/AppIcon';
import { useReducedMotion } from 'hooks/useReducedMotion';
import { SCROLL_SPEED, frameScrollAllowed } from 'lib/screenshotLayout.mjs';

// One viewport ahead of the frame, so the download starts before it is on screen.
const NEAR_VIEWPORT_MARGIN = '100% 0px';
// Matches the opacity transition so the page is still before it moves.
const REVEAL_MS = 500;

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

function nextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

// Scroll stays off until img.decode() has resolved and the fade has
// finished. Layout size alone is not a ready signal: the JPEG can occupy
// the frame while its pixels are still blank.
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
  const motionReadyRef = useRef(false);
  const flightRef = useRef(0);
  const speedRef = useRef(SCROLL_SPEED.desktop);
  const [near, setNear] = useState(false);
  const [phase, setPhase] = useState('loading');
  const [motionOn, setMotionOn] = useState(false);

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
    if (!frameScrollAllowed({
      ready: motionReadyRef.current,
      reduced,
      paused,
      distance: maxRef.current,
    })) {
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
    if (wantsScrollRef.current && distance > 1) play(1);
  }, [play]);

  const measureRef = useRef(measure);
  measureRef.current = measure;

  useEffect(() => () => stop(), [stop]);

  useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver !== 'function') {
      setNear(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: NEAR_VIEWPORT_MARGIN, threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const flight = ++flightRef.current;
    motionReadyRef.current = false;
    setMotionOn(false);
    setPhase('loading');
    applyOffset(0);
    stop();

    const active = () => flightRef.current === flight;
    const image = imgRef.current;

    const settle = async (target) => {
      if (!target || !active()) return;
      try {
        if (typeof target.decode === 'function') await target.decode();
      } catch {
        if (!active()) return;
        if (!target.complete || target.naturalWidth === 0) {
          setPhase('error');
          return;
        }
      }
      if (!active() || imgRef.current !== target) return;
      await nextPaint();
      if (!active() || imgRef.current !== target) return;
      setPhase('ready');
    };

    if (near && image && image.complete && image.naturalWidth > 0) settle(image);

    return () => {
      flightRef.current += 1;
    };
  }, [near, src, stop]);

  useEffect(() => {
    if (phase !== 'ready') return undefined;
    const timer = window.setTimeout(() => {
      motionReadyRef.current = true;
      setMotionOn(true);
      measureRef.current();
    }, reduced ? 0 : REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, [phase, reduced, src]);

  const onLoad = (event) => {
    const target = event.currentTarget;
    const flight = flightRef.current;
    const settle = async () => {
      try {
        if (typeof target.decode === 'function') await target.decode();
      } catch {
        if (flight !== flightRef.current) return;
        if (!target.complete || target.naturalWidth === 0) {
          setPhase('error');
          return;
        }
      }
      if (flight !== flightRef.current || imgRef.current !== target) return;
      await nextPaint();
      if (flight !== flightRef.current || imgRef.current !== target) return;
      setPhase('ready');
    };
    settle();
  };

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
  }, [measure, near]);

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

  const hint = phase === 'error'
    ? 'Preview unavailable'
    : phase !== 'ready'
      ? 'Loading preview'
      : reduced
        ? 'Scroll inside the frame to move through the page'
        : fineHover
          ? 'Hover to scroll the page'
          : 'Scrolls while this preview is on screen';

  const showPlaceholder = phase !== 'error' && !motionOn;

  return (
    <figure
      className="overflow-hidden rounded-2xl bg-[#10182c] shadow-[0_18px_50px_rgba(8,12,24,0.28)] ring-1 ring-white/10"
      aria-busy={phase === 'loading'}
      data-frame-phase={phase}
      data-frame-motion={motionOn ? 'on' : 'off'}
    >
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
          reduced && phase === 'ready' ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'
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
          src={near ? src : undefined}
          alt=""
          decoding="async"
          fetchpriority={near ? 'high' : 'auto'}
          loading="eager"
          draggable="false"
          onLoad={onLoad}
          onError={() => {
            if (near) setPhase('error');
          }}
          className={`pointer-events-none relative z-[1] block h-auto w-full max-w-none select-none ${
            phase === 'ready' ? 'opacity-100' : 'opacity-0'
          } ${reduced ? '' : 'transition-opacity duration-500 ease-out'}`}
        />

        {showPlaceholder && (
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <div className={`absolute inset-0 ${reduced ? 'bg-white/[0.05]' : 'gallery-shimmer'}`} />
            <div className="relative flex h-full flex-col gap-3 p-6 sm:p-8">
              <div className="h-3 w-1/3 rounded-full bg-white/15" />
              <div className="h-28 rounded-xl bg-white/[0.07] sm:h-36" />
              <div className="h-3 w-4/5 rounded-full bg-white/10" />
              <div className="h-3 w-3/5 rounded-full bg-white/10" />
              <div className="h-3 w-2/3 rounded-full bg-white/10" />
              <div className="mt-auto flex justify-center pb-1">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/85">
                  <span
                    className={`h-3 w-3 rounded-full border-2 border-white/30 border-t-white ${
                      reduced ? '' : 'animate-spin'
                    }`}
                  />
                  Loading preview
                </span>
              </div>
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="absolute inset-0 z-[1] flex items-center justify-center px-6 text-center text-sm text-white/70">
            Preview unavailable
          </div>
        )}

        {!reduced && (
          <button
            type="button"
            onClick={onOpen}
            className="absolute inset-0 z-[2] cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
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
