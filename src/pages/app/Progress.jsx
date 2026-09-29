import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/AppLayout.jsx';
import { ProgressRing } from '../../components/ProgressRing.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { CHAPTERS_DATA } from '../../data/chaptersData.js';
import { getFocusSessions, getChapters, getTests, getAttempts } from '../../lib/storage.js';
import { formatDuration, getThisWeekStudyTime, getStartOfDay } from '../../lib/time.js';
import { IconBarChart } from '../../components/Icons.jsx';

export default function Progress() {
  const [sessions, setSessions] = useState(() => getFocusSessions());
  const [chaptersMap, setChaptersMap] = useState(() => getChapters());
  const [testsStorage, setTestsStorage] = useState(() => getTests());
  const [attempts, setAttempts] = useState(() => getAttempts());

  useEffect(() => {
    setSessions(getFocusSessions());
    setChaptersMap(getChapters());
    setTestsStorage(getTests());
    setAttempts(getAttempts());
  }, []);

  const weekStudyMs = getThisWeekStudyTime(sessions);
  const totalFocusSessions = sessions.length;

  // Real tests (exclude demo tests)
  const realFinishedTests = (testsStorage.finished || []).filter((t) => !t.isDemo);

  // Chapters completed
  const chaptersDoneCount = Object.values(chaptersMap).filter((c) => c.status === 'done').length;

  // Accuracy calculation (only if >= 5 attempts)
  const validAttempts = attempts.filter((a) => a.result === 'correct' || a.result === 'incorrect');
  const hasAccuracyData = validAttempts.length >= 5;
  const correctAttempts = validAttempts.filter((a) => a.result === 'correct').length;
  const accuracy = hasAccuracyData ? Math.round((correctAttempts / validAttempts.length) * 100) : null;

  return (
    <AppLayout>
      {({ currentClass }) => {
        const activeChapters = CHAPTERS_DATA.filter((c) => {
          if (currentClass === 'dropper') return true;
          return c.class === currentClass;
        });

        const getSubjectProgress = (sub) => {
          const subChaps = activeChapters.filter((c) => c.subject === sub);
          const total = subChaps.length;
          const done = subChaps.filter((c) => chaptersMap[c.id]?.status === 'done').length;
          const percent = total > 0 ? Math.round((done / total) * 100) : 0;
          return { total, done, percent };
        };

        const phyProg = getSubjectProgress('physics');
        const chemProg = getSubjectProgress('chemistry');
        const mathProg = getSubjectProgress('mathematics');

        // Check if fresh profile (zero activity)
        const isFresh = sessions.length === 0 && attempts.length === 0 && realFinishedTests.length === 0 && chaptersDoneCount === 0;

        return (
          <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
            <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Study Analytics
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
                Preparation Progress
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '54ch' }}>
                Metrics calculated directly from your logged study sessions and problem attempts on this device.
              </p>
            </section>

            {isFresh ? (
              <EmptyState
                title="Your activity will appear here after your first session."
                description="Start reading a chapter, solving practice questions, or tracking a focus session to see your preparation metrics."
                icon={<IconBarChart size={36} />}
              />
            ) : (
              <>
                {/* 4 Key Figures */}
                <section
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--s-4)',
                  }}
                >
                  <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-3)', padding: 'var(--s-5)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Study Time This Week</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 600, marginTop: 'var(--s-1)' }}>
                      {formatDuration(weekStudyMs)}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-3)', padding: 'var(--s-5)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Focus Sessions</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 600, marginTop: 'var(--s-1)' }}>
                      {totalFocusSessions}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-3)', padding: 'var(--s-5)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Chapters Done</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 600, marginTop: 'var(--s-1)' }}>
                      {chaptersDoneCount} / {activeChapters.length}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-3)', padding: 'var(--s-5)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Practice Accuracy</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 600, marginTop: 'var(--s-1)' }}>
                      {hasAccuracyData ? `${accuracy}%` : 'Need 5+ Qs'}
                    </div>
                  </div>
                </section>

                {/* Subject Syllabus Completion Rings */}
                <section
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-3)',
                    padding: 'var(--s-6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--s-5)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Syllabus Coverage by Subject
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--s-6)', textAlign: 'center' }}>
                    {/* Physics */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s-3)' }}>
                      <ProgressRing size={100} strokeWidth={6} progress={phyProg.percent} label={`${phyProg.percent}%`} />
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem' }}>Physics</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {phyProg.done} of {phyProg.total} chapters
                      </span>
                    </div>

                    {/* Chemistry */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s-3)' }}>
                      <ProgressRing size={100} strokeWidth={6} progress={chemProg.percent} label={`${chemProg.percent}%`} />
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem' }}>Chemistry</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {chemProg.done} of {chemProg.total} chapters
                      </span>
                    </div>

                    {/* Mathematics */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s-3)' }}>
                      <ProgressRing size={100} strokeWidth={6} progress={mathProg.percent} label={`${mathProg.percent}%`} />
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem' }}>Mathematics</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {mathProg.done} of {mathProg.total} chapters
                      </span>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        );
      }}
    </AppLayout>
  );
}
