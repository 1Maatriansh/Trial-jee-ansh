import React from 'react';

/**
 * Ansh JEE — Visual UI Fragments for Intro Scenes
 * Pure SVG/CSS drawings with technical schematic aesthetic.
 */

// Scene 02: Scattered fragments
export function ProblemFragments() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        height: '240px',
        margin: 'var(--s-4) auto',
        pointerEvents: 'none',
      }}
    >
      {/* PDF Card */}
      <div
        className="frag-pdf"
        style={{
          position: 'absolute',
          top: '20px',
          left: '10%',
          width: '150px',
          padding: 'var(--s-3)',
          backgroundColor: '#121212',
          border: '1px solid #333',
          borderRadius: 'var(--r-2)',
          transform: 'rotate(-6deg)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#888', textTransform: 'uppercase' }}>PDF · 48 MB</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', marginTop: '4px', color: '#eee' }}>Kinematics_Notes_v3.pdf</div>
      </div>

      {/* Browser Tabs Card */}
      <div
        className="frag-tabs"
        style={{
          position: 'absolute',
          top: '60px',
          right: '8%',
          width: '180px',
          padding: 'var(--s-3)',
          backgroundColor: '#141414',
          border: '1px solid #3d3d3d',
          borderRadius: 'var(--r-2)',
          transform: 'rotate(5deg)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#888' }}>42 Tabs Open</div>
        <div style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '4px' }}>JEE Main PYQ 2023 Shift 2...</div>
      </div>

      {/* Timetable Card */}
      <div
        className="frag-timetable"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '25%',
          width: '160px',
          padding: 'var(--s-3)',
          backgroundColor: '#0f0f0f',
          border: '1px solid #2a2a2a',
          borderRadius: 'var(--r-2)',
          transform: 'rotate(-2deg)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#e26d6d' }}>Timetable (Unfinished)</div>
        <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '4px' }}>Day 14: Rotational Motion?</div>
      </div>
    </div>
  );
}

// Scene 04: Notes Blueprint Diagram
export function NotesDiagram() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '480px',
        margin: 'var(--s-4) auto',
        backgroundColor: '#0d0d0d',
        border: '1px solid #262626',
        borderRadius: 'var(--r-3)',
        padding: 'var(--s-4)',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: 'var(--s-2)', marginBottom: 'var(--s-3)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#888', textTransform: 'uppercase' }}>
          02 · Kinematics Blueprint
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#6fbf8b' }}>
          Verified NTA
        </span>
      </div>

      {/* Free Body & Vector Stroke SVG */}
      <svg viewBox="0 0 400 120" style={{ width: '100%', height: '100px', display: 'block' }}>
        {/* Trajectory Parabola */}
        <path d="M 40 100 Q 200 -20 360 100" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" />
        {/* Launch Vector */}
        <line x1="40" y1="100" x2="110" y2="40" stroke="#8fb4ff" strokeWidth="2" markerEnd="url(#arrow)" />
        {/* Angle Arc */}
        <path d="M 70 100 A 30 30 0 0 0 65 78" fill="none" stroke="#aaaaaa" strokeWidth="1.2" />
        <text x="80" y="94" fill="#aaaaaa" fontSize="12" fontFamily="var(--font-mono)">θ</text>
        <text x="115" y="36" fill="#8fb4ff" fontSize="12" fontFamily="var(--font-mono)">u</text>
        {/* Peak Label */}
        <circle cx="200" cy="40" r="3" fill="#ffffff" />
        <text x="210" y="44" fill="#888888" fontSize="11" fontFamily="var(--font-mono)">v_y = 0</text>
      </svg>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#aaa', marginTop: 'var(--s-2)', textAlign: 'center' }}>
        y = x tan θ - (g x²) / (2 u² cos² θ)
      </div>
    </div>
  );
}

// Scene 05: PYQ Film Strip
export function PyqFilmStrip() {
  const sampleFrames = [
    { year: '2024', shift: 'Jan 29 · Shift 1', subject: 'Physics', topic: 'Rotational Dynamics' },
    { year: '2023', shift: 'Apr 08 · Shift 2', subject: 'Mathematics', topic: 'Definite Integrals' },
    { year: '2022', shift: 'Jun 25 · Shift 1', subject: 'Chemistry', topic: 'Chemical Kinetics' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--s-3)',
        justifyContent: 'center',
        margin: 'var(--s-4) auto',
        flexWrap: 'wrap',
      }}
    >
      {sampleFrames.map((frame, idx) => (
        <div
          key={idx}
          style={{
            width: '180px',
            backgroundColor: '#0e0e0e',
            border: '1px solid #2d2d2d',
            borderRadius: 'var(--r-2)',
            padding: 'var(--s-3)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#888' }}>
            <span>{frame.year}</span>
            <span style={{ color: '#fff' }}>JEE Main</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', color: '#eee', marginTop: 'var(--s-2)' }}>
            {frame.topic}
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#666', marginTop: '4px' }}>
            {frame.shift}
          </div>
        </div>
      ))}
    </div>
  );
}

// Scene 07: Computer-Based Test Simulator
export function TestSimulator() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '460px',
        margin: 'var(--s-4) auto',
        backgroundColor: '#0a0a0a',
        border: '1px solid #262626',
        borderRadius: 'var(--r-3)',
        padding: 'var(--s-4)',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a', paddingBottom: 'var(--s-2)', marginBottom: 'var(--s-3)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#888', textTransform: 'uppercase' }}>
          Section: Physics (Q. 12)
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#ffffff', fontWeight: 600 }}>
          ⏱ 02:41:09
        </span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--s-3)' }}>
        {/* Left question snippet */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.8125rem', color: '#ccc', lineHeight: 1.4 }}>
            A particle executes SHM with time period T. Find the time taken to move from x = 0 to x = A/2...
          </p>
          <div style={{ marginTop: 'var(--s-2)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: '#141414', border: '1px solid #333', borderRadius: 'var(--r-1)', color: '#fff' }}>
              ● (B) T / 12 (Locked)
            </div>
          </div>
        </div>

        {/* Right mini palette */}
        <div style={{ width: '120px', borderLeft: '1px solid #1a1a1a', paddingLeft: 'var(--s-3)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#888', textTransform: 'uppercase', marginBottom: '4px' }}>
            Palette
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            <span style={{ fontSize: '0.6875rem', textAlign: 'center', padding: '2px', backgroundColor: '#6fbf8b', color: '#000', borderRadius: '2px' }}>10</span>
            <span style={{ fontSize: '0.6875rem', textAlign: 'center', padding: '2px', backgroundColor: '#6fbf8b', color: '#000', borderRadius: '2px' }}>11</span>
            <span style={{ fontSize: '0.6875rem', textAlign: 'center', padding: '2px', border: '1px solid #fff', color: '#fff', borderRadius: '2px' }}>12</span>
            <span style={{ fontSize: '0.6875rem', textAlign: 'center', padding: '2px', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%' }}>13</span>
            <span style={{ fontSize: '0.6875rem', textAlign: 'center', padding: '2px', backgroundColor: '#e26d6d', color: '#fff', borderRadius: '2px' }}>14</span>
            <span style={{ fontSize: '0.6875rem', textAlign: 'center', padding: '2px', border: '1px solid #444', color: '#666', borderRadius: '2px' }}>15</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scene 10: The Preparation Loop Diagram
export function PreparationLoop() {
  const nodes = [
    { label: 'Learn', desc: 'Read & Understand' },
    { label: 'Practice', desc: 'Verify Concepts' },
    { label: 'Test', desc: 'Exam Simulation' },
    { label: 'Focus', desc: 'Deep Study Blocks' },
    { label: 'Review', desc: 'Correct Mistakes' },
    { label: 'Repeat', desc: 'Build Momentum' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 'var(--s-3)',
        maxWidth: '560px',
        margin: 'var(--s-5) auto',
      }}
    >
      {nodes.map((node, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#0f0f0f',
            border: '1px solid #262626',
            borderRadius: 'var(--r-2)',
            padding: 'var(--s-3)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: '#ffffff' }}>
            {node.label}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#888', marginTop: '4px' }}>
            {node.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
