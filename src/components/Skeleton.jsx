import React from 'react';

/**
 * Ansh JEE — Skeleton Primitive
 * Renders shimmering placeholders with --surface-elevated.
 * Static block under prefers-reduced-motion.
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--r-2)',
  className = '',
  style = {},
}) {
  return (
    <div
      className={`skeleton-primitive ${className}`}
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--surface-elevated)',
        position: 'relative',
        overflow: 'hidden',
        display: 'block',
        ...style,
      }}
    >
      <div
        className="skeleton-shimmer"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
          animation: 'shimmer 1.6s linear infinite',
        }}
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-3)',
        padding: 'var(--s-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--s-3)',
      }}
    >
      <Skeleton width="40%" height="0.75rem" />
      <Skeleton width="80%" height="1.5rem" />
      <Skeleton width="100%" height="1rem" />
      <Skeleton width="60%" height="1rem" />
    </div>
  );
}
