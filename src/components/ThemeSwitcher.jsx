import React, { useState, useEffect, useRef } from 'react';
import { getProfile, updateProfile } from '../lib/storage.js';
import { IconTheme } from './Icons.jsx';

const THEMES = [
  { id: 'mono', label: 'Mono', color: '#050505', dot: '#ffffff' },
  { id: 'paper', label: 'Paper', color: '#f6f3ee', dot: '#141414' },
  { id: 'midnight', label: 'Midnight', color: '#060a12', dot: '#8fb4ff' },
  { id: 'ember', label: 'Ember', color: '#0a0705', dot: '#f0a04b' },
  { id: 'sage', label: 'Sage', color: '#070b09', dot: '#9cc9a8' },
];

const THEME_COLORS = {
  mono: '#050505',
  paper: '#f6f3ee',
  midnight: '#060a12',
  ember: '#0a0705',
  sage: '#070b09',
};

export function ThemeSwitcher({ className = '' }) {
  const [currentTheme, setCurrentTheme] = useState('mono');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const profile = getProfile();
    if (profile && profile.theme) {
      setCurrentTheme(profile.theme);
      document.documentElement.setAttribute('data-theme', profile.theme);
    }
  }, []);

  // Close popover when clicked outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleClickOutside);
    return () => window.removeEventListener('pointerdown', handleClickOutside);
  }, [isOpen]);

  const switchTheme = (themeId, event) => {
    if (themeId === currentTheme) {
      setIsOpen(false);
      return;
    }

    const apply = () => {
      document.documentElement.setAttribute('data-theme', themeId);
      setCurrentTheme(themeId);
      updateProfile({ theme: themeId });

      // Update meta theme-color
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta && THEME_COLORS[themeId]) {
        meta.setAttribute('content', THEME_COLORS[themeId]);
      }
    };

    // Use View Transitions API if supported and user has no reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !prefersReduced && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      document.documentElement.style.setProperty('--vt-x', `${x}px`);
      document.documentElement.style.setProperty('--vt-y', `${y}px`);

      document.startViewTransition(() => {
        apply();
      });
    } else {
      apply();
    }

    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`theme-switcher ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Change theme"
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--r-2)',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all var(--dur-2) var(--ease-standard)',
        }}
        onPointerEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.borderColor = 'var(--border-strong)';
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        <IconTheme size={18} />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Theme options"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + var(--s-2))',
            right: 0,
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--r-3)',
            padding: 'var(--s-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s-1)',
            minWidth: '140px',
            boxShadow: 'var(--shadow-2)',
            zIndex: 'var(--z-modal)',
            animation: 'modal-fade var(--dur-2) var(--ease-out-expo) both',
          }}
        >
          {THEMES.map((theme) => {
            const isSelected = theme.id === currentTheme;
            return (
              <button
                key={theme.id}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={(e) => switchTheme(theme.id, e)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--s-3)',
                  padding: 'var(--s-2) var(--s-3)',
                  borderRadius: 'var(--r-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  textAlign: 'left',
                  transition: 'background var(--dur-1) var(--ease-standard)',
                }}
                onPointerEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                }}
                onPointerLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: theme.color,
                    border: `1.5px solid ${theme.dot}`,
                    flexShrink: 0,
                  }}
                />
                <span>{theme.label}</span>
                {isSelected && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--accent)' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
