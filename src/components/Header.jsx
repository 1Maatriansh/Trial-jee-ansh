import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Segmented } from './Segmented.jsx';
import { ThemeSwitcher } from './ThemeSwitcher.jsx';
import { getProfile, updateProfile } from '../lib/storage.js';

const CLASS_OPTIONS = [
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: 'Drop', value: 'dropper' },
];

export function Header({ currentClass, onClassChange }) {
  const location = useLocation();

  return (
    <header className="app-header">
      {/* App Logo: Hard rule (Section 2) -> links strictly to /app, NEVER to / */}
      <Link
        to="/app"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--s-2)',
          textDecoration: 'none',
          color: 'var(--text-primary)',
        }}
        aria-label="Ansh JEE Home"
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--r-1)',
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--accent)',
          }}
        >
          AJ
        </div>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.125rem',
            fontWeight: 500,
            letterSpacing: '-0.02em',
          }}
        >
          Ansh JEE
        </span>
      </Link>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
        {/* Class Selection Segmented Control */}
        <Segmented
          options={CLASS_OPTIONS}
          value={currentClass}
          onChange={(newClass) => {
            onClassChange(newClass);
            updateProfile({ classMode: newClass });
          }}
        />

        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
