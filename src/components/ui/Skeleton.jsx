// src/components/ui/Skeleton.jsx
import React from 'react';

/**
 * Skeleton loading component with various preset shapes
 * Uses Tailwind animate-pulse for shimmer effect
 */

// Base skeleton with customizable dimensions
export const Skeleton = ({ 
  className = '', 
  width, 
  height, 
  rounded = 'md',
  ...props 
}) => {
  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div 
      className={`bg-secondary-200 dark:bg-secondary-700 animate-pulse ${roundedClasses[rounded] || 'rounded-md'} ${className}`}
      style={style}
      {...props}
    />
  );
};

// Text line skeleton
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        height={16} 
        className={i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
      />
    ))}
  </div>
);

// Avatar/circular skeleton
export const SkeletonAvatar = ({ size = 40, className = '' }) => (
  <Skeleton 
    width={size} 
    height={size} 
    rounded="full" 
    className={className}
  />
);

// Image/card skeleton
export const SkeletonImage = ({ aspectRatio = '16/9', className = '' }) => (
  <Skeleton 
    className={`w-full ${className}`}
    style={{ aspectRatio }}
    rounded="lg"
  />
);

// Card skeleton combining image + text
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white dark:bg-primary-800 rounded-xl shadow-md overflow-hidden ${className}`}>
    <SkeletonImage aspectRatio="16/9" />
    <div className="p-4 space-y-3">
      <Skeleton height={20} className="w-3/4" />
      <SkeletonText lines={2} />
      <div className="flex gap-2 pt-2">
        <Skeleton height={24} width={60} rounded="full" />
        <Skeleton height={24} width={80} rounded="full" />
      </div>
    </div>
  </div>
);

// Project card skeleton
export const SkeletonProjectCard = ({ className = '' }) => (
  <div className={`bg-white dark:bg-primary-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
    <SkeletonImage aspectRatio="4/3" />
    <div className="p-6 space-y-4">
      <Skeleton height={24} className="w-3/4" />
      <SkeletonText lines={2} />
      <div className="flex flex-wrap gap-2">
        <Skeleton height={28} width={70} rounded="full" />
        <Skeleton height={28} width={90} rounded="full" />
        <Skeleton height={28} width={60} rounded="full" />
      </div>
    </div>
  </div>
);

// Table row skeleton
export const SkeletonTableRow = ({ columns = 4, className = '' }) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton height={20} className={i === 0 ? 'w-full' : 'w-3/4'} />
      </td>
    ))}
  </tr>
);

// Metric card skeleton
export const SkeletonMetricCard = ({ className = '' }) => (
  <div className={`bg-white dark:bg-primary-800 rounded-xl shadow-md p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <Skeleton height={16} width={100} />
      <Skeleton height={40} width={40} rounded="lg" />
    </div>
    <Skeleton height={36} width={80} className="mb-2" />
    <Skeleton height={14} width={120} />
  </div>
);

// List item skeleton
export const SkeletonListItem = ({ hasAvatar = true, className = '' }) => (
  <div className={`flex items-center gap-4 p-4 ${className}`}>
    {hasAvatar && <SkeletonAvatar size={48} />}
    <div className="flex-1 space-y-2">
      <Skeleton height={18} className="w-3/4" />
      <Skeleton height={14} className="w-1/2" />
    </div>
    <Skeleton height={32} width={80} rounded="lg" />
  </div>
);

export default Skeleton;
