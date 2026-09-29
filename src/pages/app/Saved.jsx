import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Button } from '../../components/Button.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { CHAPTERS_DATA } from '../../data/chaptersData.js';
import { getSaved, toggleSavedChapter, toggleSavedQuestion } from '../../lib/storage.js';
import { IconBookmark } from '../../components/Icons.jsx';

export default function Saved() {
  const [activeTab, setActiveTab] = useState('chapters'); // chapters | notes | questions
  const [savedData, setSavedData] = useState(() => getSaved());

  useEffect(() => {
    setSavedData(getSaved());
  }, []);

  const savedChapters = (savedData.chapters || [])
    .map((id) => CHAPTERS_DATA.find((c) => c.id === id))
    .filter(Boolean);

  const handleRemoveChapter = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedChapter(id);
    setSavedData(getSaved());
  };

  return (
    <AppLayout>
      <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Personal Bookmarks
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
            Saved Items
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '54ch' }}>
            Quickly return to chapters, reference notes, and difficult questions you bookmarked for later.
          </p>
        </section>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
          {['chapters', 'notes', 'questions'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'secondary'}
              size="default"
              onClick={() => setActiveTab(tab)}
              style={{ textTransform: 'capitalize' }}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Content per tab */}
        {activeTab === 'chapters' && (
          <div>
            {savedChapters.length === 0 ? (
              <EmptyState
                title="No saved chapters yet."
                description="Click the star or bookmark icon on any chapter to keep it in this list."
                icon={<IconBookmark size={36} />}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                {savedChapters.map((chap) => (
                  <Link
                    key={chap.id}
                    to={`/app/learn/${chap.subject}/${chap.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--s-4)',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-2)',
                      textDecoration: 'none',
                    }}
                  >
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        {chap.subject} · Class {chap.class}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                        {chap.name}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={(e) => handleRemoveChapter(chap.id, e)}
                    >
                      Remove
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <EmptyState
            title="No saved notes yet."
            description="Specific note sections you bookmark will appear here."
            icon={<IconBookmark size={36} />}
          />
        )}

        {activeTab === 'questions' && (
          <EmptyState
            title="No saved questions yet."
            description="Questions you bookmark during practice or tests will be listed here."
            icon={<IconBookmark size={36} />}
          />
        )}
      </div>
    </AppLayout>
  );
}
