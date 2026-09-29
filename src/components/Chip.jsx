import React from 'react';

/**
 * Ansh JEE — Chip Component
 * Mono label style, height 24px, 1px border, status indicators.
 * Appendix B: Never relies on colour alone (shape + text).
 */
export function Chip({
  label,
  status, // 'not_started' | 'in_progress' | 'done' | undefined
  className = '',
  style = {},
  variant = 'default', // 'default' | 'accent' | 'success' | 'warning'
  onClick,
}) {
  const isInteractive = Boolean(onClick);

  const getStatusSymbol = () => {
    switch (status) {
      case 'not_started':
        return '○';
      case 'in_progress':
        return '◐';
      case 'done':
        return '●';
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'not_started':
        return 'Not started';
      case 'in_progress':
        return 'In progress';
      case 'done':
        return 'Done';
      default:
        return label;
    }
  };

  return (
    <span
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick(e) : undefined}
      className={`chip-primitive ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--s-1)',
        height: '24px',
        padding: '0 var(--s-2)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        borderRadius: 'var(--r-2)',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        color: status === 'done' ? 'var(--success)' : status === 'in_progress' ? 'var(--warning)' : 'var(--text-secondary)',
        cursor: isInteractive ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        ...style,
      }}
    >
      {status && (
        <span aria-hidden="true" style={{ fontSize: '0.75rem', lineHeight: 1 }}>
          {getStatusSymbol()}
        </span>
      )}
      <span>{status ? getStatusLabel() : label}</span>
    </span>
  );
}
