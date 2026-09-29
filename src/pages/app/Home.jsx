import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Button } from '../../components/Button.jsx';
import { CHAPTERS_DATA } from '../../data/chaptersData.js';
import { getProfile, getChapters, getFocusSessions, getAttempts, updateProfile } from '../../lib/storage.js';
import { formatDuration, getTodayStudyTime, calculateStreak } from '../../lib/time.js';
import { Modal } from '../../components/Modal.jsx';
import { Segmented } from '../../components/Segmented.jsx';
import {
  IconTarget,
  IconFileText,
  IconCheckCircle,
  IconClock,
  IconChevronRight,
} from '../../components/Icons.jsx';

export default function Home() {
  const [profile, setProfile] = useState(() => getProfile());
  const [chaptersState, setChaptersState] = useState(() => getChapters());
  const [focusSessions, setFocusSessions] = useState(() => getFocusSessions());
  const [attempts, setAttempts] = useState(() => getAttempts());
  const [showFirstRun, setShowFirstRun] = useState(false);
  const [firstRunName, setFirstRunName] = useState('');
  const [firstRunClass, setFirstRunClass] = useState(11);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setChaptersState(getChapters());
    setFocusSessions(getFocusSessions());
    setAttempts(getAttempts());

    if (!p.createdAt) {
      setShowFirstRun(true);
      setFirstRunClass(p.classMode || 11);
    }
  }, []);

  const handleFinishFirstRun = () => {
    updateProfile({
      name: firstRunName.trim(),
      classMode: firstRunClass,
      createdAt: Date.now(),
    });
    setProfile(getProfile());
    setShowFirstRun(false);
  };

  const handleSkipFirstRun = () => {
    updateProfile({
      createdAt: Date.now(),
    });
    setProfile(getProfile());
    setShowFirstRun(false);
  };

  const currentClass = profile.classMode ?? 11;
  const greeting = profile.name ? `Welcome back, ${profile.name}` : 'Welcome back';

  const lastChapterId = profile.lastChapterId;
  const lastChapter = lastChapterId ? CHAPTERS_DATA.find((c) => c.id === lastChapterId) : null;

  const activeChapters = CHAPTERS_DATA.filter((chap) => {
    if (currentClass === 'dropper') return true;
    return chap.class === currentClass;
  });

  const getSubjectStats = (subject) => {
    const subjectChaps = activeChapters.filter((c) => c.subject === subject);
    const total = subjectChaps.length;
    const done = subjectChaps.filter((c) => chaptersState[c.id]?.status === 'done').length;
    return { total, done };
  };

  const phyStats = getSubjectStats('physics');
  const chemStats = getSubjectStats('chemistry');
  const mathStats = getSubjectStats('mathematics');

  const todayStudyMs = getTodayStudyTime(focusSessions);
  const streakDays = calculateStreak(focusSessions);

  return (
    <AppLayout>
      <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
        {/* Top Header */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
              }}
            >
              {currentClass === 'dropper' ? 'Dropper Syllabus · Complete Course' : `Class ${currentClass} Syllabus`}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
            {greeting}
          </h1>
        </section>

        {/* Continue Studying Card */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              In-Progress Chapter
            </span>
            {lastChapter && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}
              >
                {lastChapter.subject}
              </span>
            )}
          </div>

          {lastChapter ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 'var(--s-1)' }}>
                  {lastChapter.name}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {lastChapter.topics.slice(0, 3).join(' · ')}
                </p>
              </div>
              <Link to={`/app/learn/${lastChapter.subject}/${lastChapter.id}`}>
                <Button variant="primary" size="default">
                  Resume Study
                </Button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--s-1)' }}>
                  Begin with a Chapter
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Select a subject below to access theory notes and practice questions.
                </p>
              </div>
              <Link to="/app/learn">
                <Button variant="secondary" size="default">
                  Browse Chapters
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Subjects Grid */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Subjects</h2>
            <Link to="/app/learn" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              View all →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--s-4)',
            }}
          >
            {/* Physics */}
            <Link
              to="/app/learn/physics"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-3)',
                padding: 'var(--s-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--s-3)',
                textDecoration: 'none',
                transition: 'border-color var(--dur-2) var(--ease-standard)',
              }}
              onPointerEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              onPointerLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  01 · Physics
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {phyStats.done}/{phyStats.total} completed
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                Physics
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Mechanics, electromagnetism, optics, thermodynamics, and modern physics.
              </p>
            </Link>

            {/* Chemistry */}
            <Link
              to="/app/learn/chemistry"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-3)',
                padding: 'var(--s-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--s-3)',
                textDecoration: 'none',
                transition: 'border-color var(--dur-2) var(--ease-standard)',
              }}
              onPointerEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              onPointerLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  02 · Chemistry
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {chemStats.done}/{chemStats.total} completed
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                Chemistry
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Physical calculations, coordination chemistry, and organic mechanisms.
              </p>
            </Link>

            {/* Mathematics */}
            <Link
              to="/app/learn/mathematics"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-3)',
                padding: 'var(--s-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--s-3)',
                textDecoration: 'none',
                transition: 'border-color var(--dur-2) var(--ease-standard)',
              }}
              onPointerEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              onPointerLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  03 · Mathematics
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {mathStats.done}/{mathStats.total} completed
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                Mathematics
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Differential and integral calculus, coordinate geometry, algebra, and vectors.
              </p>
            </Link>
          </div>
        </section>

        {/* Quick Access Tools */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Workspace Tools</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 'var(--s-3)',
            }}
          >
            <Link to="/app/practice" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-2)', padding: 'var(--s-4)', display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                <IconTarget size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>Practice</span>
              </div>
            </Link>

            <Link to="/app/pyqs" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-2)', padding: 'var(--s-4)', display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                <IconFileText size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>Past Papers</span>
              </div>
            </Link>

            <Link to="/app/tests" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-2)', padding: 'var(--s-4)', display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                <IconCheckCircle size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>Mock Tests</span>
              </div>
            </Link>

            <Link to="/app/focus" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-2)', padding: 'var(--s-4)', display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                <IconClock size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>Focus Timer</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Activity & Stats Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--s-4)',
          }}
        >
          {/* Today & Streak */}
          <div
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Logged Study Today
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              {formatDuration(todayStudyMs)}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {streakDays > 0 ? `${streakDays} day focus streak active` : 'Log a 10m focus block to initiate streak'}
            </p>
          </div>

          {/* Questions Attempted */}
          <div
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Problems Solved
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              {attempts.length}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Across practice sessions and past papers
            </p>
          </div>
        </section>
      </div>

      {/* First-Run Setup Modal */}
      <Modal
        isOpen={showFirstRun}
        onClose={handleSkipFirstRun}
        title="Set up your space"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Select your preparation syllabus. This adjusts chapter indexes, testing, and progress tracking across the workspace.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Preparation Track
            </label>
            <Segmented
              options={[
                { label: 'Class 11', value: 11 },
                { label: 'Class 12', value: 12 },
                { label: 'Dropper', value: 'dropper' },
              ]}
              value={firstRunClass}
              onChange={setFirstRunClass}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={firstRunName}
              onChange={(e) => setFirstRunName(e.target.value)}
              placeholder="e.g. Aarav"
              maxLength={30}
              style={{
                height: '40px',
                padding: '0 var(--s-3)',
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-2)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--s-3)', marginTop: 'var(--s-2)' }}>
            <Button variant="primary" onClick={handleFinishFirstRun}>
              Enter Workspace
            </Button>
            <Button variant="ghost" onClick={handleSkipFirstRun}>
              Skip for now
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
