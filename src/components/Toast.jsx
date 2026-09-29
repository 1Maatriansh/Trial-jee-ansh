import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, duration = 3000) => {
    setToast({ id: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="toast-container"
          style={{
            position: 'fixed',
            bottom: 'calc(var(--bottombar-h) + 16px + env(safe-area-inset-bottom))',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 'var(--z-toast)',
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-primary)',
            padding: 'var(--s-3) var(--s-5)',
            borderRadius: 'var(--r-2)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.875rem',
            boxShadow: 'var(--shadow-2)',
            animation: 'toast-in var(--dur-2) var(--ease-out-expo) both',
            maxWidth: 'calc(100vw - 32px)',
            pointerEvents: 'none',
          }}
        >
          {toast.message}
        </aside>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: (msg) => console.log('[Toast fallback]', msg) };
  }
  return ctx;
}
