import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_CREDIT, EXTERNAL_LINKS } from '../config.js';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s-4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--s-4)',
          }}
        >
          {/* Brand & Note */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>ANSH JEE</span>
            <span style={{ textTransform: 'none', color: 'var(--text-muted)' }}>
              All progress is stored on this device only.
            </span>
          </div>

          {/* Quick links: Hard rule -> no link to / */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-4)' }}>
            <Link to="/app/learn" style={{ color: 'var(--text-secondary)' }}>Learn</Link>
            <Link to="/app/practice" style={{ color: 'var(--text-secondary)' }}>Practice</Link>
            <Link to="/app/pyqs" style={{ color: 'var(--text-secondary)' }}>PYQs</Link>
            <Link to="/app/tests" style={{ color: 'var(--text-secondary)' }}>Tests</Link>
            <Link to="/app/focus" style={{ color: 'var(--text-secondary)' }}>Focus</Link>
            <Link to="/app/progress" style={{ color: 'var(--text-secondary)' }}>Progress</Link>
          </div>

          {/* External links from config (only shown if configured) */}
          <div style={{ display: 'flex', gap: 'var(--s-3)' }}>
            {EXTERNAL_LINKS.telegram && (
              <a href={EXTERNAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                Telegram
              </a>
            )}
            {EXTERNAL_LINKS.youtube && (
              <a href={EXTERNAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                YouTube
              </a>
            )}
          </div>
        </div>

        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--border)',
            margin: 'var(--s-2) 0',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--s-2)',
            fontSize: '0.6875rem',
          }}
        >
          <span>© {currentYear} Ansh JEE. Educational workspace.</span>
          <span style={{ color: 'var(--text-primary)' }}>
            {FOOTER_CREDIT}
          </span>
        </div>
      </div>
    </footer>
  );
}
