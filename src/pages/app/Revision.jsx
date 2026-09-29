import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Button } from '../../components/Button.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { Modal } from '../../components/Modal.jsx';
import { CHAPTERS_DATA } from '../../data/chaptersData.js';
import { getMistakes, addMistake, getSaved } from '../../lib/storage.js';
import { IconRotate } from '../../components/Icons.jsx';

const MISTAKE_TYPES = [
  { id: 'concept', label: 'Conceptual gap' },
  { id: 'calculation', label: 'Calculation error' },
  { id: 'silly', label: 'Silly mistake / misread' },
  { id: 'time', label: 'Time pressure' },
];

export default function Revision() {
  const [mistakes, setMistakes] = useState(() => getMistakes());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subject, setSubject] = useState('physics');
  const [chapterId, setChapterId] = useState('');
  const [type, setType] = useState('concept');
  const [note, setNote] = useState('');

  useEffect(() => {
    setMistakes(getMistakes());
  }, []);

  const handleAddMistake = (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    addMistake({
      subject,
      chapterId: chapterId || null,
      type,
      note: note.trim(),
      at: Date.now(),
    });

    setMistakes(getMistakes());
    setNote('');
    setIsAddModalOpen(false);
  };

  // Group mistake types count
  const typeCounts = mistakes.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Self-Correction Space
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
              Revision & Mistake Log
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '54ch' }}>
              Document mistakes honestly to identify patterns across concepts, calculations, and examination pressure.
            </p>
          </div>

          <Button variant="primary" size="default" onClick={() => setIsAddModalOpen(true)}>
            + Log Mistake
          </Button>
        </div>

        {/* Mistake Pattern Summary */}
        {mistakes.length > 0 && (
          <section
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-3)',
              padding: 'var(--s-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--s-3)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Error Classification Distribution
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--s-3)' }}>
              {MISTAKE_TYPES.map((t) => (
                <div key={t.id} style={{ padding: 'var(--s-3)', backgroundColor: 'var(--surface-elevated)', borderRadius: 'var(--r-2)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 600 }}>
                    {typeCounts[t.id] || 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mistake Entries List */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Recorded Mistakes</h2>

          {mistakes.length === 0 ? (
            <EmptyState
              title="No mistakes recorded yet."
              description="When you analyze practice questions or tests, log what went wrong here to prevent repeating it."
              icon={<IconRotate size={36} />}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              {mistakes.map((m) => (
                <div
                  key={m.id}
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-2)',
                    padding: 'var(--s-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--s-2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      {m.subject} · {MISTAKE_TYPES.find((t) => t.id === m.type)?.label || m.type}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {new Date(m.at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {m.note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add Mistake Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Log a Mistake"
        >
          <form onSubmit={handleAddMistake} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  height: '40px',
                  padding: '0 var(--s-3)',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-2)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="mathematics">Mathematics</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                What went wrong?
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  height: '40px',
                  padding: '0 var(--s-3)',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-2)',
                  color: 'var(--text-primary)',
                }}
              >
                {MISTAKE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Notes / What to remember
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Explain the error in simple words..."
                rows={4}
                required
                style={{
                  padding: 'var(--s-3)',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-2)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--s-3)', marginTop: 'var(--s-2)' }}>
              <Button type="submit" variant="primary">
                Save Mistake Entry
              </Button>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
