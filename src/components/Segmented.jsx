import React, { useRef } from 'react';

/**
 * Ansh JEE — Segmented Control Primitive
 * Used for Class Selector (Class 11, Class 12, Dropper) and Tab Filters.
 * - role="radiogroup" with keyboard arrow navigation
 * - Height: 36px desktop / 40px mobile
 * - Sliding indicator using transform
 */
export function Segmented({
  options = [], // [{ label: 'Class 11', value: 11 }]
  value,
  onChange,
  className = '',
}) {
  const containerRef = useRef(null);

  const selectedIndex = options.findIndex((opt) => opt.value === value);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (selectedIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (selectedIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  const segmentWidthPercent = options.length > 0 ? 100 / options.length : 100;

  return (
    <div
      role="radiogroup"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`segmented-control ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        height: '36px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-2)',
        padding: '2px',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* Sliding indicator */}
      {selectedIndex >= 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '2px',
            bottom: '2px',
            left: '2px',
            width: `calc(${segmentWidthPercent}% - 4px)`,
            transform: `translateX(${selectedIndex * 100}%)`,
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--r-1)',
            transition: 'transform var(--dur-2) var(--ease-standard)',
            boxShadow: 'var(--shadow-1)',
          }}
        />
      )}

      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={-1}
            onClick={() => onChange(opt.value)}
            style={{
              position: 'relative',
              zIndex: 1,
              flex: 1,
              height: '100%',
              padding: '0 var(--s-3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              transition: 'color var(--dur-1) var(--ease-standard)',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
