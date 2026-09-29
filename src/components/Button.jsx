import React from 'react';

/**
 * Ansh JEE — Button Primitive
 * Complies with Appendix B specification:
 * - Minimum touch target 44x44px (48px on large CTAs)
 * - Variants: primary, secondary, ghost, icon
 * - Hover, active (scale .97), focus-visible, loading spinner, disabled
 */
export function Button({
  children,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: 'var(--font-ui), system-ui, sans-serif',
    fontWeight: 600,
    fontSize: size === 'lg' ? '1rem' : '0.9375rem',
    minHeight: size === 'lg' ? '48px' : '44px',
    padding: variant === 'icon' ? '0' : (size === 'lg' ? '0 var(--s-6)' : '0 var(--s-4)'),
    minWidth: variant === 'icon' ? (size === 'lg' ? '48px' : '44px') : 'auto',
    borderRadius: 'var(--r-2)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all var(--dur-2) var(--ease-standard), transform var(--dur-1) var(--ease-standard)',
    userSelect: 'none',
    textDecoration: 'none',
    boxSizing: 'border-box',
    border: 'none',
  };

  let variantStyle = {};

  if (variant === 'primary') {
    variantStyle = {
      backgroundColor: 'var(--accent)',
      color: 'var(--accent-contrast)',
      boxShadow: 'var(--shadow-1)',
    };
  } else if (variant === 'secondary') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)',
    };
  } else if (variant === 'ghost') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
    };
  } else if (variant === 'icon') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
    };
  }

  const handlePointerDown = (e) => {
    if (!disabled && !isLoading) {
      e.currentTarget.style.transform = 'scale(0.97)';
    }
  };

  const handlePointerUp = (e) => {
    if (!disabled && !isLoading) {
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  const handlePointerEnter = (e) => {
    if (disabled || isLoading) return;
    if (variant === 'primary') {
      e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.borderColor = 'var(--text-secondary)';
      e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
    } else if (variant === 'ghost' || variant === 'icon') {
      e.currentTarget.style.color = 'var(--text-primary)';
      e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
    }
  };

  const handlePointerLeave = (e) => {
    if (disabled || isLoading) return;
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    if (variant === 'primary') {
      e.currentTarget.style.backgroundColor = 'var(--accent)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
      e.currentTarget.style.backgroundColor = 'transparent';
    } else if (variant === 'ghost' || variant === 'icon') {
      e.currentTarget.style.color = 'var(--text-secondary)';
      e.currentTarget.style.backgroundColor = 'transparent';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{ ...baseStyle, ...variantStyle }}
      className={`btn-primitive ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
          aria-label="Loading"
        />
      ) : (
        children
      )}
    </button>
  );
}
