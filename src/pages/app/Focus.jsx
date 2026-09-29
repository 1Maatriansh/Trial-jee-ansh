import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Button } from '../../components/Button.jsx';
import { ProgressRing } from '../../components/ProgressRing.jsx';
import { getFocusSessions, addFocusSession } from '../../lib/storage.js';
import {
  formatDuration,
  formatTimerDigits,
  getTodayStudyTime,
  calculateStreak,
  getStartOfWeek,
  getStartOfDay,
} from '../../lib/time.js';
import { IconClock } from '../../components/Icons.jsx';

const MODES = [
  { id: '25', label: '25 Min', minutes: 25 },
  { id: '50', label: '50 Min', minutes: 50 },
  { id: 'custom', label: 'Custom (10m)', minutes: 10 },
  { id: 'stopwatch', label: 'Stopwatch', minutes: 0 },
];

const SUBJECT_TAGS = ['Physics', 'Chemistry', 'Mathematics', 'Other'];

export default function Focus() {
  const [mode, setMode] = useState('25');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [sessions, setSessions] = useState(() => getFocusSessions());

  const startTimeRef = useRef(null);
  const accumulatedMsRef = useRef(0);

  const selectedModeObj = MODES.find((m) => m.id === mode);
  const totalPlannedMs = (selectedModeObj?.minutes || 0) * 60 * 1000;

  // Accurate timestamp timer loop
  useEffect(() => {
    if (!isRunning || isPaused) return;

    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const currentSegment = now - startTimeRef.current;
      const total = accumulatedMsRef.current + currentSegment;
      setElapsedMs(total);

      // Auto-finish countdown timer
      if (totalPlannedMs > 0 && total >= totalPlannedMs) {
        clearInterval(interval);
        handleEndSession(true);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, totalPlannedMs]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    accumulatedMsRef.current = 0;
    setElapsedMs(0);
  };

  const handlePause = () => {
    if (!isPaused) {
      accumulatedMsRef.current += Date.now() - startTimeRef.current;
      setIsPaused(true);
    } else {
      startTimeRef.current = Date.now();
      setIsPaused(false);
    }
  };

  const handleEndSession = (isCompleted = false) => {
    const finalElapsed = isPaused ? accumulatedMsRef.current : accumulatedMsRef.current + (Date.now() - (startTimeRef.current || Date.now()));
    setIsRunning(false);
    setIsPaused(false);
    setElapsedMs(0);
    accumulatedMsRef.current = 0;

    // Only save if session ran for at least 1 minute (60,000 ms)
    if (finalElapsed >= 60000) {
      const newSession = {
        id: crypto.randomUUID(),
        startedAt: Date.now() - finalElapsed,
        endedAt: Date.now(),
        plannedMs: totalPlannedMs,
        actualMs: finalElapsed,
        subject: selectedSubject.toLowerCase(),
        mode,
        completed: isCompleted || (totalPlannedMs > 0 && finalElapsed >= totalPlannedMs),
      };
      addFocusSession(newSession);
      setSessions(getFocusSessions());
    }
  };

  // Remaining time for countdown or elapsed time for stopwatch
  const displayRemainingMs = totalPlannedMs > 0 ? Math.max(0, totalPlannedMs - elapsedMs) : elapsedMs;
  const progressPercent = totalPlannedMs > 0 ? Math.min(100, (elapsedMs / totalPlannedMs) * 100) : 100;

  const todayStudyMs = getTodayStudyTime(sessions);
  const streakDays = calculateStreak(sessions);

  // Compute 7-day weekly bar data
  const weekStart = getStartOfWeek();
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const oneDayMs = 86400000;
  const weeklyData = dayLabels.map((label, idx) => {
    const dayTimestamp = weekStart + idx * oneDayMs;
    const dayEnd = dayTimestamp + oneDayMs;
    const dayMs = sessions
      .filter((s) => s.startedAt >= dayTimestamp && s.startedAt < dayEnd)
      .reduce((acc, s) => acc + (s.actualMs || 0), 0);
    return { label, minutes: Math.round(dayMs / 60000) };
  });
  const maxWeeklyMinutes = Math.max(60, ...weeklyData.map((d) => d.minutes));

  return (
    <AppLayout>
      <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Timed Study Blocks
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
            Focus Session
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '54ch' }}>
            Single-task study blocks to build sustained attention. Choose an interval, study without distractions, and log your hours.
          </p>
        </section>

        {/* Mode Selector */}
        {!isRunning && (
          <div style={{ display: 'flex', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
            {MODES.map((m) => (
              <Button
                key={m.id}
                variant={mode === m.id ? 'primary' : 'secondary'}
                size="default"
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </Button>
            ))}
          </div>
        )}

        {/* Subject Tag Selector */}
        {!isRunning && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Subject:
            </span>
            {SUBJECT_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedSubject(tag)}
                style={{
                  height: '28px',
                  padding: '0 var(--s-3)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  borderRadius: 'var(--r-2)',
                  border: '1px solid',
                  borderColor: selectedSubject === tag ? 'var(--border-strong)' : 'var(--border)',
                  backgroundColor: selectedSubject === tag ? 'var(--surface-elevated)' : 'transparent',
                  color: selectedSubject === tag ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Focus Timer Display */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-3)',
            padding: 'var(--s-8) var(--s-4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--s-5)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {selectedSubject} Focus Session
          </span>

          {/* Large Ring and Timer Digits */}
          <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProgressRing
              size={220}
              strokeWidth={6}
              progress={totalPlannedMs > 0 ? progressPercent : 100}
              color="var(--accent)"
            />
            <div
              style={{
                position: 'absolute',
                fontFamily: 'var(--font-mono)',
                fontSize: '3rem',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--text-primary)',
              }}
            >
              {formatTimerDigits(displayRemainingMs)}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 'var(--s-3)' }}>
            {!isRunning ? (
              <Button variant="primary" size="lg" onClick={handleStart}>
                Start Focus Session
              </Button>
            ) : (
              <>
                <Button variant="secondary" size="lg" onClick={handlePause}>
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="ghost" size="lg" onClick={() => handleEndSession(false)}>
                  End Session
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Today and Streak Overview */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--s-4)',
          }}
        >
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-3)', padding: 'var(--s-5)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Today's Focus
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 600, marginTop: 'var(--s-1)' }}>
              {formatDuration(todayStudyMs)}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-3)', padding: 'var(--s-5)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Consistency Streak
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 600, marginTop: 'var(--s-1)' }}>
              {streakDays} {streakDays === 1 ? 'day' : 'days'}
            </div>
          </div>
        </section>

        {/* Weekly Bar Chart (Plain SVG) */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-3)',
            padding: 'var(--s-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s-4)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            This Week's Activity
          </span>

          <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', gap: 'var(--s-3)', paddingTop: 'var(--s-4)' }}>
            {weeklyData.map((d, idx) => {
              const heightPercent = Math.max(4, (d.minutes / maxWeeklyMinutes) * 100);
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--s-2)',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '32px',
                      height: `${heightPercent}%`,
                      backgroundColor: d.minutes > 0 ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--r-1)',
                      transition: 'height var(--dur-3) var(--ease-out-expo)',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
