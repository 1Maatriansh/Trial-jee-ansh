import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconHome,
  IconBook,
  IconClock,
  IconBarChart,
  IconMoreHorizontal,
  IconTarget,
  IconFileText,
  IconCheckCircle,
  IconBookmark,
  IconRotate,
  IconUser,
} from './Icons.jsx';
import { Modal } from './Modal.jsx';

const MOBILE_PRIMARY = [
  { path: '/app', label: 'Home', icon: IconHome, exact: true },
  { path: '/app/learn', label: 'Learn', icon: IconBook },
  { path: '/app/focus', label: 'Focus', icon: IconClock },
  { path: '/app/progress', label: 'Progress', icon: IconBarChart },
];

const MORE_LINKS = [
  { path: '/app/practice', label: 'Practice Questions', icon: IconTarget },
  { path: '/app/pyqs', label: 'Previous Year Questions (PYQs)', icon: IconFileText },
  { path: '/app/tests', label: 'CBT Test Engine', icon: IconCheckCircle },
  { path: '/app/saved', label: 'Saved Bookmarks', icon: IconBookmark },
  { path: '/app/revision', label: 'Revision & Mistake Log', icon: IconRotate },
  { path: '/app/profile', label: 'Profile & Data Settings', icon: IconUser },
];

export function BottomBar() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      <nav className="bottom-bar" aria-label="Mobile navigation">
        {MOBILE_PRIMARY.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '56px',
                height: '100%',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                textDecoration: 'none',
                gap: '4px',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              })}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* More Button */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '56px',
            height: '100%',
            color: isMoreOpen ? 'var(--accent)' : 'var(--text-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            gap: '4px',
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
          aria-label="More navigation links"
        >
          <IconMoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* More Bottom Sheet */}
      <Modal isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} title="Workspace Tools">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
          {MORE_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMoreOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--s-3)',
                  padding: 'var(--s-3) var(--s-4)',
                  borderRadius: 'var(--r-2)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--surface-elevated)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-strong)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.9375rem',
                  fontFamily: 'var(--font-ui)',
                })}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
