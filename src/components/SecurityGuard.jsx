import React, { useEffect, useState } from 'react';
import { ALLOWED_DOMAINS } from '../config.js';

/**
 * Ansh JEE — Security & Domain Guard
 * Complies with Section 29 requirements:
 * 1. Domain allow-list check (renders neutral notice if served on unlisted host)
 * 2. Frame-busting check (prevents clickjacking/embedding)
 */
export function SecurityGuard({ children }) {
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    // 1. Frame-busting defense
    try {
      if (window.top !== window.self) {
        window.top.location = window.self.location;
      }
    } catch {
      // If cross-origin frame blocks access to window.top.location
      document.body.innerHTML = '';
    }

    // 2. Domain allow-list defense
    const hostname = window.location.hostname;
    // Development is always allowed
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
      setIsAllowed(true);
      return;
    }

    // If ALLOWED_DOMAINS has configured production domains, verify against them
    const configuredDomains = ALLOWED_DOMAINS.filter((d) => d !== 'localhost' && d !== '127.0.0.1');
    if (configuredDomains.length > 0) {
      const matched = configuredDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`));
      if (!matched) {
        setIsAllowed(false);
      }
    }
  }, []);

  if (!isAllowed) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          backgroundColor: '#050505',
          color: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
          Unauthorized Host
        </h1>
        <p style={{ color: '#888', maxWidth: '400px', lineHeight: 1.5 }}>
          This software instance is only authorized to run on official domains.
        </p>
      </div>
    );
  }

  return children;
}
