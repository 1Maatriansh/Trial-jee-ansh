import React, { useState } from 'react';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Button } from '../../components/Button.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { CHAPTERS_DATA } from '../../data/chaptersData.js';
import { IconTarget } from '../../components/Icons.jsx';

export default function Practice() {
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [selectedChapterId, setSelectedChapterId] = useState('');

  return (
    <AppLayout>
      {({ currentClass }) => {
        const chapters = CHAPTERS_DATA.filter((c) => {
          if (c.subject !== selectedSubject) return false;
          if (currentClass !== 'dropper' && c.class !== currentClass) return false;
          return true;
        });

        return (
          <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
            <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Active Practice
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
                Practice Questions
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '54ch' }}>
                Test your conceptual clarity with targeted question sets. Answers and time taken are recorded locally for your revision.
              </p>
            </section>

            {/* Subject Selector */}
            <div style={{ display: 'flex', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
              {['physics', 'chemistry', 'mathematics'].map((sub) => (
                <Button
                  key={sub}
                  variant={selectedSubject === sub ? 'primary' : 'secondary'}
                  size="default"
                  onClick={() => {
                    setSelectedSubject(sub);
                    setSelectedChapterId('');
                  }}
                  style={{ textTransform: 'capitalize' }}
                >
                  {sub}
                </Button>
              ))}
            </div>

            {/* Chapter Selection Grid */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Select Chapter</h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 'var(--s-3)',
                }}
              >
                {chapters.map((chap) => {
                  const isSelected = chap.id === selectedChapterId;
                  return (
                    <button
                      key={chap.id}
                      type="button"
                      onClick={() => setSelectedChapterId(chap.id)}
                      style={{
                        padding: 'var(--s-4)',
                        backgroundColor: isSelected ? 'var(--surface-elevated)' : 'var(--surface)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--border-strong)' : 'var(--border)',
                        borderRadius: 'var(--r-2)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'border-color var(--dur-1) var(--ease-standard)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--s-1)',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        #{String(chap.order).padStart(2, '0')} · Class {chap.class}
                      </span>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {chap.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Questions Area / Honest Empty State */}
            <section style={{ marginTop: 'var(--s-4)' }}>
              <EmptyState
                title="Practice questions for this chapter aren't available yet."
                description="The practice set will appear here once questions have been reviewed and published."
                icon={<IconTarget size={36} />}
              />
            </section>
          </div>
        );
      }}
    </AppLayout>
  );
}
