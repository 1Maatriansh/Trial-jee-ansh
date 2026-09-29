import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Button } from '../../components/Button.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { SHOW_DEMO_CONTENT } from '../../config.js';
import { IconCheckCircle, IconClock } from '../../components/Icons.jsx';

export default function Tests() {
  return (
    <AppLayout>
      <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
        {/* Header */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Exam Simulation
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
            Mock Tests
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '54ch' }}>
            Simulate real examination conditions with strict countdown timing, question palette states, and diagnostic score breakdowns.
          </p>
        </section>

        {/* Demo Test (Available if SHOW_DEMO_CONTENT is enabled) */}
        {SHOW_DEMO_CONTENT && (
          <section
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--r-3)',
              padding: 'var(--s-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--s-3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  padding: '2px 6px',
                  backgroundColor: 'var(--surface-elevated)',
                  borderRadius: 'var(--r-1)',
                  color: 'var(--warning)',
                  textTransform: 'uppercase',
                }}
              >
                Verification Only
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Demo Test Engine
              </span>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 'var(--s-1)' }}>
                Interface demo — not JEE content
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Contains sample placeholder questions to test the 5-state palette, auto-submit timer, and scoring engine. Results from this demo test do not count toward your real progress.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-4)', flexWrap: 'wrap', marginTop: 'var(--s-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-1)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <IconClock size={16} />
                <span>15 Minutes</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <span>5 Sample Questions</span>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Link to="/app/tests/test-demo-interface">
                  <Button variant="primary" size="default">
                    Launch Demo Test
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Regular Tests / Empty State */}
        <section>
          <EmptyState
            title="No full-length mock tests are available yet."
            description="When verified JEE test series papers are scheduled, they will show up here."
            icon={<IconCheckCircle size={36} />}
          />
        </section>
      </div>
    </AppLayout>
  );
}
