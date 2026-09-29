import React, { useState } from 'react';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Button } from '../../components/Button.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { CHAPTERS_DATA } from '../../data/chaptersData.js';
import { IconFileText, IconSearch } from '../../components/Icons.jsx';

export default function Pyqs() {
  const [selectedExam, setSelectedExam] = useState('all'); // all | main | advanced
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const YEARS = ['2024', '2023', '2022', '2021', '2020'];

  const handleClearFilters = () => {
    setSelectedExam('all');
    setSelectedSubject('all');
    setSelectedYear('all');
    setSearchQuery('');
  };

  return (
    <AppLayout>
      {({ currentClass }) => (
        <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
          {/* Header */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Past Year Archive
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
              Previous Year Questions
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '54ch' }}>
              Filter past JEE Main and JEE Advanced exam questions by exam, subject, chapter, and year.
            </p>
          </section>

          {/* Filter Bar */}
          <section
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-3)',
              padding: 'var(--s-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--s-3)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-3)', alignItems: 'center' }}>
              {/* Exam Filter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Exam
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  style={{
                    height: '36px',
                    padding: '0 var(--s-3)',
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-2)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="all">All Exams</option>
                  <option value="main">JEE Main</option>
                  <option value="advanced">JEE Advanced</option>
                </select>
              </div>

              {/* Subject Filter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={{
                    height: '36px',
                    padding: '0 var(--s-3)',
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-2)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="all">All Subjects</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="mathematics">Mathematics</option>
                </select>
              </div>

              {/* Year Filter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{
                    height: '36px',
                    padding: '0 var(--s-3)',
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-2)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="all">All Years</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Clear button */}
              <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
                <Button variant="ghost" size="default" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              </div>
            </div>
          </section>

          {/* PYQ List / Honest Empty State */}
          <section>
            <EmptyState
              title="PYQs will appear here once the question set is added."
              description="No questions match the current filters or the database is currently empty."
              icon={<IconFileText size={36} />}
            />
          </section>
        </div>
      )}
    </AppLayout>
  );
}
