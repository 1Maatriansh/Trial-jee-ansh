import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/Button.jsx';
import { Modal } from '../../components/Modal.jsx';
import { loadTest } from '../../lib/content.js';
import { getTests, setTestInProgress, addFinishedTest } from '../../lib/storage.js';
import { formatTimerDigits } from '../../lib/time.js';
import { IconChevronLeft, IconChevronRight, IconCheckCircle } from '../../components/Icons.jsx';

export default function TestRunner() {
  const { testId } = useParams();
  const [testData, setTestData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: answer }
  const [questionStates, setQuestionStates] = useState({}); // { [qId]: 'not_visited' | 'not_answered' | 'answered' | 'marked' | 'answered_marked' }
  const [remainingMs, setRemainingMs] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);

  const startTimeRef = useRef(null);
  const durationMsRef = useRef(null);

  // Load test data
  useEffect(() => {
    loadTest(testId).then((data) => {
      if (!data) return;
      setTestData(data);

      const duration = (data.durationMinutes || 15) * 60 * 1000;
      durationMsRef.current = duration;

      // Check for in-progress attempt in storage
      const testsStorage = getTests();
      if (testsStorage.inProgress && testsStorage.inProgress.testId === testId) {
        const saved = testsStorage.inProgress;
        startTimeRef.current = saved.startedAt;
        setUserAnswers(saved.answers || {});
        setQuestionStates(saved.states || {});
        setCurrentQIndex(saved.current || 0);
      } else {
        const now = Date.now();
        startTimeRef.current = now;
        // Initialize first question as visited
        const allQuestions = data.sections.flatMap((s) => s.questions);
        const initialStates = {};
        allQuestions.forEach((q, idx) => {
          initialStates[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
        });
        setQuestionStates(initialStates);
        setTestInProgress({
          testId,
          startedAt: now,
          durationMs: duration,
          current: 0,
          answers: {},
          states: initialStates,
        });
      }
    });
  }, [testId]);

  // Timestamp-based accurate timer
  useEffect(() => {
    if (!startTimeRef.current || !durationMsRef.current || testResult) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const left = Math.max(0, durationMsRef.current - elapsed);
      setRemainingMs(left);

      if (left <= 0) {
        clearInterval(interval);
        handleAutoSubmit();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [testData, testResult]);

  // Save interaction state
  const persistState = (newAnswers, newStates, nextIndex) => {
    setTestInProgress({
      testId,
      startedAt: startTimeRef.current,
      durationMs: durationMsRef.current,
      current: nextIndex,
      answers: newAnswers,
      states: newStates,
    });
  };

  if (!testData) {
    return (
      <div style={{ padding: 'var(--s-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading examination environment...
      </div>
    );
  }

  const allQuestions = testData.sections.flatMap((s) => s.questions);
  const currentQ = allQuestions[currentQIndex];

  const handleSelectOption = (optId) => {
    const nextAnswers = { ...userAnswers, [currentQ.id]: optId };
    setUserAnswers(nextAnswers);

    // If marked, become answered_marked; otherwise answered
    const currentState = questionStates[currentQ.id];
    let nextState = 'answered';
    if (currentState === 'marked' || currentState === 'answered_marked') {
      nextState = 'answered_marked';
    }

    const nextStates = { ...questionStates, [currentQ.id]: nextState };
    setQuestionStates(nextStates);
    persistState(nextAnswers, nextStates, currentQIndex);
  };

  const handleNumericalInput = (val) => {
    const nextAnswers = { ...userAnswers, [currentQ.id]: val };
    setUserAnswers(nextAnswers);

    let nextState = val.trim() ? 'answered' : 'not_answered';
    const currentState = questionStates[currentQ.id];
    if (currentState === 'marked' || currentState === 'answered_marked') {
      nextState = val.trim() ? 'answered_marked' : 'marked';
    }

    const nextStates = { ...questionStates, [currentQ.id]: nextState };
    setQuestionStates(nextStates);
    persistState(nextAnswers, nextStates, currentQIndex);
  };

  const handleClearResponse = () => {
    const nextAnswers = { ...userAnswers };
    delete nextAnswers[currentQ.id];
    setUserAnswers(nextAnswers);

    const currentState = questionStates[currentQ.id];
    const nextState = (currentState === 'answered_marked' || currentState === 'marked') ? 'marked' : 'not_answered';
    const nextStates = { ...questionStates, [currentQ.id]: nextState };
    setQuestionStates(nextStates);
    persistState(nextAnswers, nextStates, currentQIndex);
  };

  const handleMarkForReviewAndNext = () => {
    const hasAnswer = userAnswers[currentQ.id] !== undefined && userAnswers[currentQ.id] !== '';
    const nextState = hasAnswer ? 'answered_marked' : 'marked';
    const nextStates = { ...questionStates, [currentQ.id]: nextState };

    const nextIndex = Math.min(allQuestions.length - 1, currentQIndex + 1);
    if (nextStates[allQuestions[nextIndex].id] === 'not_visited') {
      nextStates[allQuestions[nextIndex].id] = 'not_answered';
    }

    setQuestionStates(nextStates);
    setCurrentQIndex(nextIndex);
    persistState(userAnswers, nextStates, nextIndex);
  };

  const handleSaveAndNext = () => {
    const nextIndex = Math.min(allQuestions.length - 1, currentQIndex + 1);
    const nextStates = { ...questionStates };
    if (nextStates[allQuestions[nextIndex].id] === 'not_visited') {
      nextStates[allQuestions[nextIndex].id] = 'not_answered';
    }
    setQuestionStates(nextStates);
    setCurrentQIndex(nextIndex);
    persistState(userAnswers, nextStates, nextIndex);
  };

  const handleJumpToQuestion = (idx) => {
    const nextStates = { ...questionStates };
    if (nextStates[allQuestions[idx].id] === 'not_visited') {
      nextStates[allQuestions[idx].id] = 'not_answered';
    }
    setQuestionStates(nextStates);
    setCurrentQIndex(idx);
    persistState(userAnswers, nextStates, idx);
  };

  const calculateResult = () => {
    const marksScheme = testData.marking || { correct: 4, wrong: -1 };
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let score = 0;

    allQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans === undefined || ans === '') {
        unattemptedCount++;
      } else if (ans.toString().trim().toLowerCase() === q.answer.toString().trim().toLowerCase()) {
        correctCount++;
        score += marksScheme.correct;
      } else {
        incorrectCount++;
        score += marksScheme.wrong;
      }
    });

    const attempted = correctCount + incorrectCount;
    const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;
    const timeUsedMs = durationMsRef.current - remainingMs;

    const result = {
      id: crypto.randomUUID(),
      testId,
      submittedAt: Date.now(),
      score,
      correct: correctCount,
      incorrect: incorrectCount,
      unattempted: unattemptedCount,
      totalQuestions: allQuestions.length,
      accuracy,
      timeMs: timeUsedMs,
      isDemo: Boolean(testData.isDemo),
    };

    addFinishedTest(result);
    setTestResult(result);
    setIsSubmitModalOpen(false);
  };

  const handleAutoSubmit = () => {
    calculateResult();
  };

  // State Counts for legend
  const answeredCount = Object.values(questionStates).filter((s) => s === 'answered').length;
  const notAnsweredCount = Object.values(questionStates).filter((s) => s === 'not_answered').length;
  const markedCount = Object.values(questionStates).filter((s) => s === 'marked').length;
  const answeredMarkedCount = Object.values(questionStates).filter((s) => s === 'answered_marked').length;
  const notVisitedCount = Object.values(questionStates).filter((s) => s === 'not_visited').length;

  // If test is submitted, render results screen
  if (testResult) {
    return (
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', color: 'var(--text-primary)', padding: 'var(--s-6) var(--s-4)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Test Performance Analysis
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', marginTop: 'var(--s-1)' }}>
              {testData.title}
            </h1>
            {testResult.isDemo && (
              <p style={{ color: 'var(--warning)', fontSize: '0.875rem', marginTop: 'var(--s-1)' }}>
                Notice: Results from this interface demo test are not added to your workspace progress analytics.
              </p>
            )}
          </div>

          {/* Results Score Card */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-3)',
              padding: 'var(--s-6)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 'var(--s-4)',
              textAlign: 'center',
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--accent)' }}>
                {testResult.score}
              </div>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 600 }}>
                {testResult.accuracy}%
              </div>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Correct</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--success)' }}>
                {testResult.correct}
              </div>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Incorrect</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--danger)' }}>
                {testResult.incorrect}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 'var(--s-3)' }}>
            <Button variant={reviewMode ? 'secondary' : 'primary'} size="default" onClick={() => setReviewMode(!reviewMode)}>
              {reviewMode ? 'Hide Solutions' : 'Review Questions & Solutions'}
            </Button>
            <Link to="/app/tests">
              <Button variant="ghost" size="default">Return to Tests</Button>
            </Link>
          </div>

          {/* Review Mode Accordion */}
          {reviewMode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
              {allQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns && userAns.toString().trim().toLowerCase() === q.answer.toString().trim().toLowerCase();
                return (
                  <div
                    key={q.id}
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid',
                      borderColor: isCorrect ? 'var(--success)' : userAns ? 'var(--danger)' : 'var(--border)',
                      borderRadius: 'var(--r-3)',
                      padding: 'var(--s-5)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--s-3)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Question {idx + 1}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: isCorrect ? 'var(--success)' : userAns ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {isCorrect ? 'Correct (+4)' : userAns ? 'Incorrect (-1)' : 'Unattempted (0)'}
                      </span>
                    </div>

                    <p style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{q.statement}</p>

                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <div>Your Answer: <strong style={{ color: 'var(--text-primary)' }}>{userAns || 'None'}</strong></div>
                      <div>Correct Answer: <strong style={{ color: 'var(--success)' }}>{q.answer}</strong></div>
                    </div>

                    {q.explanation && (
                      <div style={{ padding: 'var(--s-3)', backgroundColor: 'var(--surface-elevated)', borderRadius: 'var(--r-2)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Test Header Bar */}
      <header
        style={{
          height: '56px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--s-4)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem' }}>
          {testData.title}
        </span>

        {/* Timestamp Countdown Timer */}
        <div
          role="timer"
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.125rem',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            color: remainingMs < 120000 ? 'var(--danger)' : 'var(--text-primary)',
            padding: '4px 12px',
            backgroundColor: 'var(--surface-elevated)',
            borderRadius: 'var(--r-2)',
            border: '1px solid var(--border)',
          }}
        >
          ⏱ {formatTimerDigits(remainingMs)}
        </div>
      </header>

      {/* Main Runner Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Question View */}
        <div style={{ flex: 1, padding: 'var(--s-6) var(--s-4)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Question {currentQIndex + 1} of {allQuestions.length}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                +{testData.marking?.correct || 4} / {testData.marking?.wrong || -1} Marks
              </span>
            </div>

            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              {currentQ.statement}
            </p>

            {/* Options or Numerical input */}
            {currentQ.type === 'mcq' && currentQ.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      style={{
                        padding: 'var(--s-4)',
                        backgroundColor: isSelected ? 'var(--surface-elevated)' : 'var(--surface)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                        borderRadius: 'var(--r-2)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--s-3)',
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '2px solid',
                          borderColor: isSelected ? 'var(--accent)' : 'var(--border-strong)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'numerical' && (
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--s-2)' }}>
                  Enter Numerical Answer
                </label>
                <input
                  type="text"
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => handleNumericalInput(e.target.value)}
                  placeholder="e.g. 10.5"
                  style={{
                    height: '44px',
                    padding: '0 var(--s-3)',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-2)',
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    maxWidth: '240px',
                  }}
                />
              </div>
            )}

            {/* Action Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)', marginTop: 'var(--s-4)' }}>
              <Button variant="secondary" onClick={handleMarkForReviewAndNext}>
                Mark for Review & Next
              </Button>
              <Button variant="ghost" onClick={handleClearResponse}>
                Clear Response
              </Button>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--s-2)' }}>
                <Button
                  variant="secondary"
                  disabled={currentQIndex === 0}
                  onClick={() => handleJumpToQuestion(currentQIndex - 1)}
                >
                  Previous
                </Button>
                <Button variant="primary" onClick={handleSaveAndNext}>
                  Save & Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Question Palette (Desktop) */}
        <aside
          style={{
            width: '280px',
            borderLeft: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            padding: 'var(--s-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s-4)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Question Palette
          </span>

          {/* Palette Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 'var(--s-2)',
            }}
          >
            {allQuestions.map((q, idx) => {
              const qState = questionStates[q.id] || 'not_visited';
              const isCurrent = idx === currentQIndex;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleJumpToQuestion(idx)}
                  aria-label={`Question ${idx + 1}, ${qState.replace('_', ' ')}`}
                  style={{
                    height: '36px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: (qState === 'marked' || qState === 'answered_marked') ? '50%' : 'var(--r-1)',
                    border: isCurrent ? '2px solid var(--text-primary)' : '1px solid var(--border-strong)',
                    backgroundColor:
                      qState === 'answered' ? 'rgba(111, 191, 139, 0.25)' :
                      qState === 'answered_marked' ? 'rgba(111, 191, 139, 0.4)' :
                      qState === 'not_answered' ? 'rgba(226, 109, 109, 0.25)' :
                      qState === 'marked' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color:
                      qState === 'answered' || qState === 'answered_marked' ? 'var(--success)' :
                      qState === 'not_answered' ? 'var(--danger)' : 'var(--text-primary)',
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div>● {answeredCount} Answered</div>
            <div>○ {notAnsweredCount} Not Answered</div>
            <div>⚑ {markedCount} Marked for Review</div>
            <div>✓ {answeredMarkedCount} Answered & Marked</div>
            <div>□ {notVisitedCount} Not Visited</div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <Button
              variant="primary"
              size="lg"
              style={{ width: '100%' }}
              onClick={() => setIsSubmitModalOpen(true)}
            >
              Submit Test
            </Button>
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit test?"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            You cannot change your answers after submitting. Please review your attempt summary below:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--s-2)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
            <div>Answered: <strong>{answeredCount + answeredMarkedCount}</strong></div>
            <div>Not Answered: <strong>{notAnsweredCount}</strong></div>
            <div>Marked for Review: <strong>{markedCount}</strong></div>
            <div>Not Visited: <strong>{notVisitedCount}</strong></div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--s-3)', marginTop: 'var(--s-2)' }}>
            <Button variant="primary" onClick={calculateResult}>
              Confirm & Submit
            </Button>
            <Button variant="ghost" onClick={() => setIsSubmitModalOpen(false)}>
              Keep Working
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
