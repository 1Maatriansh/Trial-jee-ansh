import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconHome,
  IconBook,
  IconTarget,
  IconFileText,
  IconCheckCircle,
  IconClock,
  IconBarChart,
  IconBookmark,
  IconRotate,
  IconUser,
} from './Icons.jsx';

const PRIMARY_NAV = [
  { path: '/app', label: 'Home', icon: IconHome, exact: true },
  { path: '/app/learn', label: 'Learn', icon: IconBook },
  { path: '/app/practice', label: 'Practice', icon: IconTarget },
  { path: '/app/pyqs', label: 'PYQs', icon: IconFileText },
  { path: '/app/tests', label: 'Tests', icon: IconCheckCircle },
];

const SECONDARY_NAV = [
  { path: '/app/focus', label: 'Focus', icon: IconClock },
  { path: '/app/progress', label: 'Progress', icon: IconBarChart },
  { path: '/app/saved', label: 'Saved', icon: IconBookmark },
  { path: '/app/revision', label: 'Revision', icon: IconRotate },
];

export function Rail() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      className="rail"
      data-open={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Desktop navigation"
    >
      {/* Top spacing */}
      <div style={{ height: 'var(--header-h-lg)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 'var(--s-3) var(--s-2)', gap: 'var(--s-1)' }}>
        {/* Primary Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--s-3)',
                  height: '40px',
                  padding: '0 var(--s-3)',
                  borderRadius: 'var(--r-2)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--surface-elevated)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 500 : 400,
                  transition: 'background var(--dur-1) var(--ease-standard), color var(--dur-1) var(--ease-standard)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                })}
              >
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>
                  <Icon size={18} />
                </div>
                <span style={{ opacity: isHovered ? 1 : 0, transition: 'opacity var(--dur-2) var(--ease-standard)' }}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Hairline Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: 'var(--s-3) var(--s-2)' }} />

        {/* Secondary Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {SECONDARY_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--s-3)',
                  height: '40px',
                  padding: '0 var(--s-3)',
                  borderRadius: 'var(--r-2)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--surface-elevated)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 500 : 400,
                  transition: 'background var(--dur-1) var(--ease-standard), color var(--dur-1) var(--ease-standard)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                })}
              >
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>
                  <Icon size={18} />
                </div>
                <span style={{ opacity: isHovered ? 1 : 0, transition: 'opacity var(--dur-2) var(--ease-standard)' }}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile link */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
          <NavLink
            to="/app/profile"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--s-3)',
              height: '40px',
              padding: '0 var(--s-3)',
              borderRadius: 'var(--r-2)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--surface-elevated)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              textDecoration: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.875rem',
              fontWeight: isActive ? 500 : 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            })}
          >
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>
              <IconUser size={18} />
            </div>
            <span style={{ opacity: isHovered ? 1 : 0, transition: 'opacity var(--dur-2) var(--ease-standard)' }}>
              Profile
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
