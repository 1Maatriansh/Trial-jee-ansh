import React from 'react';
import { Button } from './Button.jsx';

/**
 * Ansh JEE — Empty State Primitive
 * Appendix B: A small line illustration (stroke SVG, theme-aware),
 * one sentence title, one sentence explanation, optional single action.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) {
  return (
    <div
      className={`empty-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--s-7) var(--s-4)',
        textAlign: 'center',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--r-3)',
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
      }}
    >
      <div
        style={{
          color: 'var(--text-muted)',
          marginBottom: 'var(--s-3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon || (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
        )}
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.25rem',
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: 'var(--s-2)',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          maxWidth: '46ch',
          lineHeight: 1.5,
          marginBottom: actionLabel ? 'var(--s-4)' : '0',
        }}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="secondary" size="default" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
