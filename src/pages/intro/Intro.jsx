import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FOOTER_CREDIT } from '../../config.js';
import {
  ProblemFragments,
  NotesDiagram,
  PyqFilmStrip,
  TestSimulator,
  PreparationLoop,
} from './scenes.jsx';
import { ProgressRing } from '../../components/ProgressRing.jsx';

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    id: '01',
    eyebrow: 'Ansh JEE · Foundation',
    title: 'A quiet space for serious preparation.',
    prose: 'Designed for aspirants studying independently. Clear structure, zero algorithmic noise, and complete respect for your attention.',
  },
  {
    id: '02',
    eyebrow: '02 · The Problem',
    title: 'Preparation breaks down in fragmentation.',
    prose: 'Notes in unorganized folders. Formulas scattered on scraps of paper. Questions bookmarked across browser tabs. Too much friction before study even begins.',
    component: <ProblemFragments />,
  },
  {
    id: '03',
    eyebrow: '03 · The Workspace',
    title: 'One coherent preparation system.',
    prose: 'Notes, practice problems, past examination papers, simulated testing, and timed focus blocks — unified into a single offline-capable environment.',
  },
  {
    id: '04',
    eyebrow: '04 · Academic Notes',
    title: 'Concepts explained with precision.',
    prose: 'Curated syllabi with technical schematics, mathematical derivations, and essential formulas. Read without visual clutter or intrusive ads.',
    component: <NotesDiagram />,
  },
  {
    id: '05',
    eyebrow: '05 · Past Examinations',
    title: 'Direct insight from past JEE papers.',
    prose: 'Filter authentic past questions by chapter, year, examination shift, and difficulty. Understand the recurring patterns of real exam testing.',
    component: <PyqFilmStrip />,
  },
  {
    id: '06',
    eyebrow: '06 · Active Practice',
    title: 'Verify comprehension immediately.',
    prose: 'Passive reading creates an illusion of competence. Active problem solving with immediate reasoning turns theory into durable intuition.',
  },
  {
    id: '07',
    eyebrow: '07 · CBT Test Simulator',
    title: 'Authentic examination conditions.',
    prose: 'Full computer-based test runner with five-state question tracking, timestamp-accurate countdowns, standard marking schemes, and immediate diagnostic review.',
    component: <TestSimulator />,
  },
  {
    id: '08',
    eyebrow: '08 · Deliberate Focus',
    title: 'Protect your cognitive stamina.',
    prose: 'Focused blocks reduce context switching. Timed intervals build the uninterrupted mental endurance demanded by three-hour examination papers.',
    component: (
      <div style={{ margin: 'var(--s-4) auto', display: 'flex', justifyContent: 'center' }}>
        <ProgressRing size={130} strokeWidth={5} progress={80} label="25:00" />
      </div>
    ),
  },
  {
    id: '09',
    eyebrow: '09 · Honest Progress',
    title: 'Only real work is recorded.',
    prose: 'No artificial badges or inflated scores. Track verified study hours, completed chapters, and problem accuracy directly from your device.',
  },
  {
    id: '10',
    eyebrow: '10 · The Study Loop',
    title: 'A sustainable daily rhythm.',
    prose: 'Learn concepts. Solve problems. Simulate timed tests. Review errors. Repeat deliberately.',
    component: <PreparationLoop />,
  },
  {
    id: '11',
    eyebrow: '11 · Mindset',
    title: 'Consistency over intensity.',
    prose: 'You do not need to finish everything today. You need only to return tomorrow and do the work calmly.',
  },
  {
    id: '12',
    eyebrow: '12 · Begin',
    title: 'Everything you need. One place.',
    prose: '"I built this for the student who studies alone, often on a phone, often without a plan. You do not have to be perfect. You just have to come back tomorrow." — Maatriansh',
    isFinal: true,
  },
];

export default function Intro() {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const sceneLayersRef = useRef([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const track = trackRef.current;
    if (!track) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const totalScenes = SCENES.length;

    // Master ScrollTrigger timeline scrubbing over the track
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress; // 0.0 to 1.0

        // Update progress bar width
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${Math.min(100, progress * 100)}%`;
        }

        // Determine active scene
        const sceneIndex = Math.min(
          totalScenes - 1,
          Math.floor(progress * totalScenes)
        );
        setActiveSceneIndex(sceneIndex);

        // Animate scene layers opacity and transform based on segment progress
        sceneLayersRef.current.forEach((layer, idx) => {
          if (!layer) return;

          const sceneStart = idx / totalScenes;
          const sceneEnd = (idx + 1) / totalScenes;
          const sceneMid = (sceneStart + sceneEnd) / 2;

          let opacity = 0;
          let translateY = 20;
          let scale = 0.96;

          if (progress >= sceneStart && progress <= sceneEnd) {
            // Scene is active
            const localProgress = (progress - sceneStart) / (sceneEnd - sceneStart); // 0 to 1
            if (localProgress < 0.25) {
              // Fade in
              const t = localProgress / 0.25;
              opacity = t;
              translateY = 20 * (1 - t);
              scale = 0.96 + 0.04 * t;
            } else if (localProgress > 0.8) {
              // Fade out (unless it's the final scene)
              if (idx === totalScenes - 1) {
                opacity = 1;
                translateY = 0;
                scale = 1;
              } else {
                const t = (localProgress - 0.8) / 0.2;
                opacity = 1 - t;
                translateY = -20 * t;
                scale = 1 - 0.04 * t;
              }
            } else {
              opacity = 1;
              translateY = 0;
              scale = 1;
            }
          } else if (idx === totalScenes - 1 && progress > sceneEnd) {
            // Keep final scene visible at the very bottom
            opacity = 1;
            translateY = 0;
            scale = 1;
          }

          layer.style.opacity = opacity.toFixed(3);
          layer.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          layer.classList.toggle('is-active', opacity > 0.5);
        });
      },
    });

    ScrollTrigger.refresh();

    return () => {
      st.kill();
    };
  }, []);

  const handleEnterApp = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !prefersReduced) {
      document.startViewTransition(() => {
        navigate('/app');
      });
    } else {
      navigate('/app');
    }
  };

  const handleSkipToFinal = () => {
    const track = trackRef.current;
    if (track) {
      const targetScroll = track.offsetHeight - window.innerHeight;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className="intro-container" data-theme="mono">
      {/* Top progress indicator */}
      <div className="intro-progress-line">
        <div ref={progressBarRef} className="intro-progress-fill" />
      </div>

      {/* HUD: Scene Number Indicator */}
      <div className="intro-hud-indicator">
        <span>SCENE {String(activeSceneIndex + 1).padStart(2, '0')}</span>
        <span>/</span>
        <span>{String(SCENES.length).padStart(2, '0')}</span>
      </div>

      {/* HUD: Skip button */}
      <button
        type="button"
        className="intro-hud-skip"
        onClick={handleSkipToFinal}
        aria-label="Skip to workspace entrance"
      >
        Skip to Workspace
      </button>

      {/* Master Scroll Track */}
      <div ref={trackRef} className="intro-scroll-track">
        {/* Pinned Cinematic Stage */}
        <div className="intro-stage">
          <div className="intro-grid-bg" />
          <div className="intro-vignette" />
          <div className="intro-grain-layer" />

          {/* Render All Scenes Inside Pinned Stage */}
          {SCENES.map((scene, idx) => (
            <div
              key={scene.id}
              ref={(el) => (sceneLayersRef.current[idx] = el)}
              className={`intro-scene-layer ${idx === 0 ? 'is-active' : ''}`}
              style={{
                opacity: idx === 0 ? 1 : 0,
                transform: idx === 0 ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 20px, 0) scale(0.96)',
              }}
            >
              <div className="intro-card">
                <span className="intro-eyebrow">{scene.eyebrow}</span>
                {idx === 0 ? (
                  <h1 className="intro-hero-title">{scene.title}</h1>
                ) : (
                  <h2 className="intro-section-title">{scene.title}</h2>
                )}
                {scene.component}
                <p className="intro-prose" style={{ marginTop: scene.component ? 'var(--s-3)' : '0' }}>
                  {scene.prose}
                </p>

                {scene.isFinal && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="intro-enter-btn"
                      onClick={handleEnterApp}
                      aria-label="Enter Ansh JEE workspace"
                    >
                      <span>ENTER WORKSPACE</span>
                      <span aria-hidden="true">→</span>
                    </button>

                    <div style={{ marginTop: 'var(--s-6)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
                      {FOOTER_CREDIT}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
