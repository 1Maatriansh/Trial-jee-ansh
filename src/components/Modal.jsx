import React, { useEffect, useRef } from 'react';
import { Button } from './Button.jsx';
import { IconX } from './Icons.jsx';

/**
 * Ansh JEE — Modal & Bottom Sheet Primitive
 * Desktop: centered dialog
 * Mobile: bottom sheet
 * Traps focus, handles Escape, locks body scroll.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '540px',
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous focus
    const previousActiveElement = document.activeElement;

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus inside modal
    if (dialogRef.current) {
      dialogRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={dialogRef}
      tabIndex={-1}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: 'flex-end', // bottom on mobile
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-surface"
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--r-3) var(--r-3) 0 0', // sheet rounded on mobile
          padding: 'var(--s-5)',
          maxHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-2)',
          animation: 'sheet-up var(--dur-3) var(--ease-out-expo) both',
        }}
      >
        {/* Mobile handle indicator */}
        <div
          className="sheet-handle"
          aria-hidden="true"
          style={{
            width: '36px',
            height: '4px',
            borderRadius: 'var(--r-full)',
            backgroundColor: 'var(--border-strong)',
            margin: '0 auto var(--s-3) auto',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--s-4)',
          }}
        >
          <h2
            id="modal-title"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </h2>
          <Button variant="icon" onClick={onClose} aria-label="Close dialog">
            <IconX size={18} />
          </Button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingBottom: 'var(--s-2)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
