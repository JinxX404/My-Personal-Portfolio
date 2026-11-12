import React, { useRef } from 'react';
import { useReducedMotion } from 'hooks/useReducedMotion';

const MAX_TILT = 4.5;

/**
 * Light perspective tilt for a project cover card.
 * Disabled when the visitor prefers reduced motion or the site turns animations off.
 */
const TiltCard = ({ children, className = '' }) => {
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  const onMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    const rotX = (-py * MAX_TILT * 2).toFixed(2);
    const rotY = (px * MAX_TILT * 2).toFixed(2);
    node.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  };

  if (reduced) {
    return <div className={`h-full ${className}`}>{children}</div>;
  }

  return (
    <div className={`h-full ${className}`} style={{ perspective: '900px' }}>
      <div
        ref={ref}
        className="project-tilt h-full transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: 'rotateX(0deg) rotateY(0deg) translateY(0px)' }}
        onMouseMove={onMove}
        onMouseLeave={reset}
      >
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
