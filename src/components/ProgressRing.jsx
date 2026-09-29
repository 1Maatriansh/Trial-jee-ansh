import React from 'react';

/**
 * Ansh JEE — Progress Ring Primitive
 * SVG progress ring with stroke-linecap round and smooth stroke-dashoffset transition.
 */
export function ProgressRing({
  progress = 0, // 0 to 100
  size = 64,
  strokeWidth = 4,
  label = null,
  color = 'var(--accent)',
  trackColor = 'var(--border)',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset var(--dur-4) var(--ease-out-expo)',
          }}
        />
      </svg>
      {label !== null && (
        <span
          style={{
            position: 'absolute',
            fontFamily: 'var(--font-mono)',
            fontSize: `${Math.max(10, size * 0.22)}px`,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
