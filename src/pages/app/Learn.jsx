import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Chip } from '../../components/Chip.jsx';
import { CHAPTERS_DATA } from '../../data/chaptersData.js';
import { getChapters, getSaved, toggleSavedChapter } from '../../lib/storage.js';
import { IconSearch, IconBookmark, IconChevronLeft } from '../../components/Icons.jsx';

const SUBJECTS = [
  { id: 'physics', label: 'Physics' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'mathematics', label: 'Mathematics' },
];

export default function Learn() {
  const { subject: urlSubject } = useParams();
  const [selectedSubject, setSelectedSubject] = useState(urlSubject || 'physics');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | not_started | in_progress | done
  const [chaptersState, setChaptersState] = useState(() => getChapters());
  const [savedState, setSavedState] = useState(() => getSaved());

  const activeSubject = urlSubject || selectedSubject;

  const handleToggleSave = (chapterId, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedChapter(chapterId);
    setSavedState(getSaved());
  };

  return (
    <AppLayout>
      {({ currentClass }) => {
        // Filter chapters
        const chapters = CHAPTERS_DATA.filter((c) => {
          if (c.subject !== activeSubject) return false;
          if (currentClass !== 'dropper' && c.class !== currentClass) return false;
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const nameMatch = c.name.toLowerCase().includes(q);
            const topicMatch = c.topics.some((t) => t.toLowerCase().includes(q));
            if (!nameMatch && !topicMatch) return false;
          }
          if (statusFilter !== 'all') {
            const chapStatus = chaptersState[c.id]?.status || 'not_started';
            if (chapStatus !== statusFilter) return false;
          }
          return true;
        });

        // Group by class if dropper
        const class11Chapters = chapters.filter((c) => c.class === 11);
        const class12Chapters = chapters.filter((c) => c.class === 12);

        return (
          <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
            {/* Header / Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <Link to="/app" style={{ color: 'var(--text-secondary)' }}>Home</Link>
              <span>›</span>
              <span>Learn</span>
              <span>›</span>
              <span style={{ textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                {currentClass === 'dropper' ? 'Dropper' : `Class ${currentClass}`}
              </span>
            </div>

            {/* Subject Selector Tabs */}
            <div style={{ display: 'flex', gap: 'var(--s-2)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--s-2)' }}>
              {SUBJECTS.map((sub) => {
                const isActive = activeSubject === sub.id;
                return (
                  <Link
                    key={sub.id}
                    to={`/app/learn/${sub.id}`}
                    onClick={() => setSelectedSubject(sub.id)}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      padding: 'var(--s-2) var(--s-3)',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                      textDecoration: 'none',
                      borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      transition: 'color var(--dur-1) var(--ease-standard)',
                    }}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>

            {/* Search and Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-3)', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  position: 'relative',
                  flex: '1 1 240px',
                  maxWidth: '360px',
                }}
              >
                <input
                  type="text"
                  placeholder="Search chapter or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 var(--s-3) 0 var(--s-7)',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-2)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                  }}
                />
                <div style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <IconSearch size={18} />
                </div>
              </div>

              {/* Status filter chips */}
              <div style={{ display: 'flex', gap: 'var(--s-1)', flexWrap: 'wrap' }}>
                {['all', 'not_started', 'in_progress', 'done'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    style={{
                      height: '32px',
                      padding: '0 var(--s-3)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      textTransform: 'uppercase',
                      borderRadius: 'var(--r-2)',
                      border: '1px solid',
                      borderColor: statusFilter === st ? 'var(--border-strong)' : 'var(--border)',
                      backgroundColor: statusFilter === st ? 'var(--surface-elevated)' : 'transparent',
                      color: statusFilter === st ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {st === 'all' ? 'All' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapters List */}
            {currentClass === 'dropper' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--s-3)' }}>
                    Class 11 Syllabus
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                    {class11Chapters.map((c) => renderChapterRow(c, chaptersState, savedState, handleToggleSave))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--s-3)' }}>
                    Class 12 Syllabus
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                    {class12Chapters.map((c) => renderChapterRow(c, chaptersState, savedState, handleToggleSave))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                {chapters.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', padding: 'var(--s-6) 0', textAlign: 'center' }}>
                    No chapters match your search or filter.
                  </p>
                ) : (
                  chapters.map((c) => renderChapterRow(c, chaptersState, savedState, handleToggleSave))
                )}
              </div>
            )}
          </div>
        );
      }}
    </AppLayout>
  );
}

function renderChapterRow(chapter, chaptersState, savedState, handleToggleSave) {
  const status = chaptersState[chapter.id]?.status || 'not_started';
  const isSaved = savedState.chapters?.includes(chapter.id);
  const formattedOrder = String(chapter.order).padStart(2, '0');

  return (
    <Link
      key={chapter.id}
      to={`/app/learn/${chapter.subject}/${chapter.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--s-4)',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-2)',
        textDecoration: 'none',
        gap: 'var(--s-4)',
        minHeight: '64px',
        transition: 'border-color var(--dur-2) var(--ease-standard)',
      }}
      onPointerEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onPointerLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-4)', minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
        >
          {formattedOrder}
        </span>
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.125rem',
              color: 'var(--text-primary)',
              fontWeight: 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {chapter.name}
          </h3>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {chapter.topics.slice(0, 3).join(' · ')}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', flexShrink: 0 }}>
        <Chip status={status} />
        <button
          type="button"
          onClick={(e) => handleToggleSave(chapter.id, e)}
          style={{
            background: 'none',
            border: 'none',
            color: isSaved ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label={isSaved ? 'Remove from saved' : 'Save chapter'}
        >
          <IconBookmark size={18} filled={isSaved} />
        </button>
      </div>
    </Link>
  );
}
