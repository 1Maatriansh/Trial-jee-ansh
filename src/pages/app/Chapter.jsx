import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Button } from '../../components/Button.jsx';
import { Chip } from '../../components/Chip.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { CHAPTERS_DATA } from '../../data/chaptersData.js';
import { FORMULA_DATA } from '../../data/formulaData.js';
import { loadChapterNotes, loadChapterPyqs } from '../../lib/content.js';
import {
  getChapters,
  setChapterStatus,
  markChapterOpened,
  getSaved,
  toggleSavedChapter,
  updateProfile,
} from '../../lib/storage.js';
import {
  IconChevronLeft,
  IconChevronRight,
  IconBookmark,
  IconFileText,
  IconTarget,
} from '../../components/Icons.jsx';

export default function Chapter() {
  const { subject, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [notes, setNotes] = useState(null);
  const [pyqs, setPyqs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('not_started');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const found = CHAPTERS_DATA.find((c) => c.id === chapterId);
    setChapter(found || null);

    if (found) {
      // Mark as opened and record as last visited chapter
      markChapterOpened(chapterId);
      updateProfile({ lastChapterId: chapterId });

      const chaptersMap = getChapters();
      setStatus(chaptersMap[chapterId]?.status || 'not_started');

      const saved = getSaved();
      setIsSaved(saved.chapters?.includes(chapterId) || false);

      // Lazy load notes and pyqs
      setIsLoading(true);
      Promise.all([loadChapterNotes(chapterId), loadChapterPyqs(chapterId)]).then(
        ([loadedNotes, loadedPyqs]) => {
          setNotes(loadedNotes);
          setPyqs(loadedPyqs);
          setIsLoading(false);
        }
      );
    }
  }, [chapterId]);

  if (!chapter) {
    return (
      <AppLayout>
        <div className="content-wrap" style={{ textAlign: 'center', padding: 'var(--s-8) 0' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--s-3)' }}>
            Chapter not found
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--s-5)' }}>
            The requested chapter identifier does not exist in the syllabus.
          </p>
          <Link to="/app/learn">
            <Button variant="primary">Return to Learn</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Find previous and next chapter within the same subject & class
  const subjectChapters = CHAPTERS_DATA.filter(
    (c) => c.subject === chapter.subject && c.class === chapter.class
  );
  const currentIndex = subjectChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? subjectChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < subjectChapters.length - 1 ? subjectChapters[currentIndex + 1] : null;

  const formulas = FORMULA_DATA[chapter.id] || null;

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setChapterStatus(chapter.id, newStatus);
  };

  const handleToggleSave = () => {
    const nextSaved = toggleSavedChapter(chapter.id);
    setIsSaved(nextSaved);
  };

  return (
    <AppLayout>
      <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
        {/* Sticky Back & Breadcrumb Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--s-3)',
            paddingBottom: 'var(--s-3)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            <Link to={`/app/learn/${chapter.subject}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
              <IconChevronLeft size={14} />
              <span style={{ textTransform: 'capitalize' }}>{chapter.subject}</span>
            </Link>
            <span>›</span>
            <span style={{ color: 'var(--text-primary)' }}>{chapter.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)' }}>
            {/* Status Selector */}
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--r-2)',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
              aria-label="Set chapter completion status"
            >
              <option value="not_started">○ Not started</option>
              <option value="in_progress">◐ In progress</option>
              <option value="done">● Done</option>
            </select>

            {/* Bookmark button */}
            <Button
              variant="icon"
              onClick={handleToggleSave}
              aria-label={isSaved ? 'Remove from saved' : 'Save chapter'}
            >
              <IconBookmark size={18} filled={isSaved} style={{ color: isSaved ? 'var(--accent)' : 'inherit' }} />
            </Button>
          </div>
        </div>

        {/* Chapter Header */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
          <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center' }}>
            <Chip label={`Class ${chapter.class}`} />
            <Chip label={chapter.subject} />
            <Chip label={`#${String(chapter.order).padStart(2, '0')}`} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.25rem, 1.5rem + 3vw, 3.5rem)' }}>
            {chapter.name}
          </h1>
        </section>

        {/* 1. Overview */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-3)',
            padding: 'var(--s-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s-2)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Overview
          </span>
          <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {chapter.overview}
          </p>
        </section>

        {/* 2. What this chapter covers (Topics) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
            What this chapter covers
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
            {chapter.topics.map((t, idx) => (
              <div
                key={idx}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: 'var(--s-2) var(--s-3)',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-2)',
                  color: 'var(--text-secondary)',
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* 3. Notes Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Notes</h2>
            {notes && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {notes.sections?.length || 0} Sections
              </span>
            )}
          </div>

          {notes ? (
            <div
              className="notes-content-container"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--s-5)',
                maxWidth: 'var(--reading-max)',
              }}
            >
              {notes.sections.map((sec) => (
                <div
                  key={sec.id}
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
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>{sec.title}</h3>
                  {sec.blocks.map((block, bIdx) => {
                    if (block.type === 'p') {
                      return <p key={bIdx} style={{ fontSize: '0.9375rem', lineHeight: 1.65 }}>{block.text}</p>;
                    }
                    if (block.type === 'callout') {
                      return (
                        <div
                          key={bIdx}
                          style={{
                            padding: 'var(--s-3) var(--s-4)',
                            backgroundColor: 'var(--surface-elevated)',
                            borderLeft: '3px solid var(--accent)',
                            borderRadius: '0 var(--r-2) var(--r-2) 0',
                            fontSize: '0.875rem',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {block.text}
                        </div>
                      );
                    }
                    if (block.type === 'formula') {
                      return (
                        <div
                          key={bIdx}
                          style={{
                            padding: 'var(--s-3)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.9375rem',
                            backgroundColor: 'var(--surface-elevated)',
                            borderRadius: 'var(--r-2)',
                            textAlign: 'center',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {block.text}
                        </div>
                      );
                    }
                    if (block.type === 'list') {
                      return (
                        <ul key={bIdx} style={{ listStyleType: 'disc', paddingLeft: 'var(--s-5)', display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                          {block.items.map((item, iIdx) => (
                            <li key={iIdx} style={{ fontSize: '0.9375rem' }}>{item}</li>
                          ))}
                        </ul>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Notes for this chapter haven't been added yet."
              description="They will appear here as soon as they are published."
              icon={<IconFileText size={32} />}
            />
          )}
        </section>

        {/* 4. PYQs Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Previous Year Questions</h2>
          {pyqs && pyqs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              {/* PYQ cards rendered here */}
            </div>
          ) : (
            <EmptyState
              title="PYQs will appear here once the question set is added."
              description="Questions for this chapter have not yet been linked."
              icon={<IconTarget size={32} />}
            />
          )}
        </section>

        {/* 5. Formulas Section (Only if verified formula data exists) */}
        {formulas && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Essential Formulas</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--s-3)',
              }}
            >
              {formulas.map((item, idx) => (
                <div
                  key={idx}
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
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {item.name}
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'var(--accent)',
                      padding: 'var(--s-2) 0',
                    }}
                  >
                    {item.formula}
                  </div>
                  {item.note && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Prev / Next Navigation Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 'var(--s-6)',
            borderTop: '1px solid var(--border)',
            gap: 'var(--s-3)',
          }}
        >
          {prevChapter ? (
            <Link to={`/app/learn/${prevChapter.subject}/${prevChapter.id}`} style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="default">
                ← {prevChapter.name}
              </Button>
            </Link>
          ) : <div />}

          {nextChapter && (
            <Link to={`/app/learn/${nextChapter.subject}/${nextChapter.id}`} style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="default">
                {nextChapter.name} →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
