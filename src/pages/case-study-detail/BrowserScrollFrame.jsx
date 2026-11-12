import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Icon from 'components/AppIcon';
import { useReducedMotion } from 'hooks/useReducedMotion';
import { SCROLL_SPEED, frameScrollAllowed } from 'lib/screenshotLayout.mjs';
import {
  FRAME_SIZES,
  NARROW_MEDIA,
  contiguousReadyCount,
  contiguousReadyHeight,
  requestCount,
  scrollLimit,
} from 'lib/screenshotSlices.mjs';

// One viewport ahead of the frame, so the first slice starts before it is on screen.
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

// Scroll stays inside the slices that have decoded. Later slices are requested
// only as the decoded prefix catches up, so the top of the page can move
// before the rest of the file has arrived.
const BrowserScrollFrame = ({
  src,
  parts: partList = null,
  title,
  projectName,
  onOpen,
  paused = false,
}) => {
  const reduced = useReducedMotion();
  const fineHover = useFineHover();
  const partsKey = `${src || ''}::${Array.isArray(partList) ? partList.map((part) => part.src).join('|') : ''}`;
  const parts = useMemo(() => {
    if (Array.isArray(partList) && partList.length) return partList;
    return [{ src, srcSet: '', avifSrcSet: '', width: 0, height: 0 }];
  }, [partsKey]);

  const viewportRef = useRef(null);
  const stackRef = useRef(null);
  const sliceRefs = useRef([]);
  const offsetRef = useRef(0);
  const maxRef = useRef(0);
  const dirRef = useRef(0);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const wantsScrollRef = useRef(false);
  const motionReadyRef = useRef(false);
  const generationRef = useRef(0);
  const speedRef = useRef(SCROLL_SPEED.desktop);
  const reducedRef = useRef(reduced);
  const readyRef = useRef([]);
  const holdingRef = useRef(false);
  const partsLengthRef = useRef(0);
  const [near, setNear] = useState(false);
  const [phase, setPhase] = useState('loading');
  const [motionOn, setMotionOn] = useState(false);
  const [ready, setReady] = useState([]);
  const [fetchCount, setFetchCount] = useState(0);
  const [holding, setHolding] = useState(false);

  reducedRef.current = reduced;
  readyRef.current = ready;
  partsLengthRef.current = parts.length;
  speedRef.current = fineHover ? SCROLL_SPEED.desktop : SCROLL_SPEED.mobile;

  const applyOffset = (value) => {
    offsetRef.current = value;
    const stack = stackRef.current;
    if (!stack) return;
    stack.style.transform = reducedRef.current ? '' : `translate3d(0, ${-value}px, 0)`;
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
      const parked = dir > 0
        && next >= max
        && max > 1
        && contiguousReadyCount(readyRef.current) < partsLengthRef.current;
      if (holdingRef.current !== parked) {
        holdingRef.current = parked;
        setHolding(parked);
      }
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
    const viewport = viewportRef.current;
    const stack = stackRef.current;
    if (!viewport || !stack) return;
    const heights = [...stack.querySelectorAll('[data-slice]')].map((node) => node.offsetHeight);
    const readyHeight = contiguousReadyHeight(readyRef.current, heights);
    const limit = scrollLimit(readyHeight, viewport.clientHeight);
    maxRef.current = limit;
    if (reducedRef.current && readyHeight > 0) {
      stack.style.maxHeight = `${readyHeight}px`;
      stack.style.overflow = 'hidden';
    } else if (!reducedRef.current) {
      stack.style.maxHeight = '';
      stack.style.overflow = '';
    }
    const offset = reducedRef.current ? viewport.scrollTop : offsetRef.current;
    if (reducedRef.current) {
      if (viewport.scrollTop > limit) viewport.scrollTop = limit;
      offsetRef.current = Math.min(viewport.scrollTop, limit);
    } else if (offsetRef.current > limit) {
      applyOffset(limit);
    }
    const want = requestCount({
      offset: reducedRef.current ? viewport.scrollTop : offsetRef.current,
      viewport: viewport.clientHeight,
      heights,
      ready: readyRef.current,
    });
    setFetchCount((current) => (current >= want ? current : want));
    const prefix = contiguousReadyCount(readyRef.current);
    const parked = wantsScrollRef.current && limit > 1 && offset >= limit - 1 && prefix < heights.length;
    if (holdingRef.current !== parked) {
      holdingRef.current = parked;
      setHolding(parked);
    }
    if (wantsScrollRef.current && limit > offsetRef.current + 1) play(1);
  }, [play]);

  const measureRef = useRef(measure);
  measureRef.current = measure;

  const settleSlice = useCallback(async (image, index, generation) => {
    if (!image) return;
    try {
      if (typeof image.decode === 'function') await image.decode();
    } catch {
      if (generation !== generationRef.current) return;
      if (!image.complete || image.naturalWidth === 0) {
        if (index === 0) setPhase('error');
        return;
      }
    }
    if (generation !== generationRef.current) return;
    await nextPaint();
    if (generation !== generationRef.current) return;
    setReady((current) => {
      if (current[index]) return current;
      const next = current.slice();
      next[index] = true;
      readyRef.current = next;
      return next;
    });
  }, []);

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
    generationRef.current += 1;
    readyRef.current = [];
    setReady([]);
    setPhase('loading');
    setMotionOn(false);
    setHolding(false);
    holdingRef.current = false;
    motionReadyRef.current = false;
    setFetchCount(near ? 1 : 0);
    applyOffset(0);
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
    stop();
  }, [near, partsKey, stop]);

  useEffect(() => {
    if (!ready[0]) return undefined;
    setPhase('ready');
    measureRef.current();
    return undefined;
  }, [ready]);

  useEffect(() => {
    const generation = generationRef.current;
    parts.forEach((_, index) => {
      if (index >= fetchCount) return;
      const image = sliceRefs.current[index];
      if (image?.complete && image.naturalWidth > 0 && !readyRef.current[index]) {
        settleSlice(image, index, generation);
      }
    });
  }, [fetchCount, parts, partsKey, settleSlice]);

  useEffect(() => {
    if (phase !== 'ready') return undefined;
    const timer = window.setTimeout(() => {
      motionReadyRef.current = true;
      setMotionOn(true);
      measureRef.current();
    }, reduced ? 0 : REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, [phase, reduced, partsKey]);

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
    const stack = stackRef.current;
    if (!viewport) return undefined;
    const observer = new ResizeObserver(() => measureRef.current());
    observer.observe(viewport);
    if (stack) observer.observe(stack);
    return () => observer.disconnect();
  }, [fetchCount, partsKey]);

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

  const onSliceLoad = (event, index) => {
    settleSlice(event.currentTarget, index, generationRef.current);
  };

  const hint = phase === 'error'
    ? 'Preview unavailable'
    : phase !== 'ready'
      ? 'Loading preview'
      : holding
        ? 'Loading the next section'
        : reduced
          ? 'Scroll inside the frame to move through the page'
          : fineHover
            ? 'Hover to scroll the page'
            : 'Scrolls while this preview is on screen';

  const showPlaceholder = phase === 'loading';
  const readyCount = contiguousReadyCount(ready);

  return (
    <figure
      className="overflow-hidden rounded-2xl bg-[#10182c] shadow-[0_18px_50px_rgba(8,12,24,0.28)] ring-1 ring-white/10"
      aria-busy={phase === 'loading'}
      data-frame-phase={phase}
      data-frame-motion={motionOn ? 'on' : 'off'}
      data-frame-ready={readyCount}
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
        onScroll={() => {
          if (reducedRef.current) measureRef.current();
        }}
        onMouseEnter={() => {
          if (fineHover) play(1);
        }}
        onMouseLeave={() => {
          if (fineHover) play(-1);
        }}
      >
        <div ref={stackRef} className="relative z-[1] w-full will-change-transform">
          {parts.map((part, index) => {
            const knownBox = part.width > 0 && part.height > 0;
            const shouldLoad = near && index < fetchCount;
            const sliceReady = Boolean(ready[index]);
            const image = (
              <img
                ref={(node) => {
                  sliceRefs.current[index] = node;
                }}
                src={shouldLoad ? part.src : undefined}
                srcSet={shouldLoad && part.srcSet ? part.srcSet : undefined}
                sizes={shouldLoad && (part.srcSet || part.avifSrcSet) ? FRAME_SIZES : undefined}
                width={knownBox ? part.width : undefined}
                height={knownBox ? part.height : undefined}
                alt=""
                decoding="async"
                fetchpriority={index < 2 ? 'high' : 'low'}
                loading={index < 2 ? 'eager' : 'lazy'}
                draggable="false"
                onLoad={(event) => onSliceLoad(event, index)}
                onError={() => {
                  if (index === 0) setPhase('error');
                }}
                className={knownBox
                  ? `h-full w-full ${sliceReady ? 'opacity-100' : 'opacity-0'} ${reduced ? '' : 'transition-opacity duration-500 ease-out'}`
                  : `pointer-events-none block h-auto w-full max-w-none select-none ${sliceReady ? 'opacity-100' : 'opacity-0'} ${reduced ? '' : 'transition-opacity duration-500 ease-out'}`}
              />
            );
            return (
              <div
                key={`${part.src}-${index}`}
                data-slice=""
                className="relative w-full"
                style={knownBox ? { aspectRatio: `${part.width} / ${part.height}` } : undefined}
              >
                {!sliceReady && knownBox && (
                  <div
                    className={`absolute inset-0 ${reduced ? 'bg-white/[0.04]' : 'gallery-shimmer'}`}
                    aria-hidden="true"
                  />
                )}
                {knownBox ? (
                  <picture className="pointer-events-none absolute inset-0 block">
                    {shouldLoad && part.narrowAvif ? (
                      <source media={NARROW_MEDIA} type="image/avif" srcSet={part.narrowAvif} />
                    ) : null}
                    {shouldLoad && part.narrowSrc ? (
                      <source media={NARROW_MEDIA} type="image/webp" srcSet={part.narrowSrc} />
                    ) : null}
                    {shouldLoad && part.avifSrcSet ? (
                      <source type="image/avif" srcSet={part.avifSrcSet} sizes={FRAME_SIZES} />
                    ) : null}
                    {image}
                  </picture>
                ) : image}
              </div>
            );
          })}
        </div>

        {showPlaceholder && (
          <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
            <div className={`absolute inset-0 ${reduced ? 'bg-[#10182c]' : 'gallery-shimmer'}`} />
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
          <div className="absolute inset-0 z-[2] flex items-center justify-center bg-[#10182c] px-6 text-center text-sm text-white/70">
            Preview unavailable
          </div>
        )}

        {!reduced && (
          <button
            type="button"
            onClick={onOpen}
            className="absolute inset-0 z-[3] cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
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
