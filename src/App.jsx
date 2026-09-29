import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastProvider } from './components/Toast.jsx';
import { Background } from './components/Background.jsx';
import { Skeleton } from './components/Skeleton.jsx';
import { Button } from './components/Button.jsx';

// Lazy load the Intro experience so the app bundle never pays for GSAP or intro scenes
const Intro = lazy(() => import('./pages/intro/Intro.jsx'));

// Lazy load app pages
const Home = lazy(() => import('./pages/app/Home.jsx'));
const Learn = lazy(() => import('./pages/app/Learn.jsx'));
const Chapter = lazy(() => import('./pages/app/Chapter.jsx'));
const Pyqs = lazy(() => import('./pages/app/Pyqs.jsx'));
const Practice = lazy(() => import('./pages/app/Practice.jsx'));
const Tests = lazy(() => import('./pages/app/Tests.jsx'));
const TestRunner = lazy(() => import('./pages/app/TestRunner.jsx'));
const Focus = lazy(() => import('./pages/app/Focus.jsx'));
const Progress = lazy(() => import('./pages/app/Progress.jsx'));
const Saved = lazy(() => import('./pages/app/Saved.jsx'));
const Revision = lazy(() => import('./pages/app/Revision.jsx'));
const Profile = lazy(() => import('./pages/app/Profile.jsx'));

function PageLoader() {
  return (
    <div
      style={{
        padding: 'var(--s-8) var(--s-4)',
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--s-4)',
      }}
    >
      <Skeleton width="180px" height="1.5rem" />
      <Skeleton width="100%" height="120px" borderRadius="var(--r-3)" />
      <Skeleton width="100%" height="80px" borderRadius="var(--r-3)" />
    </div>
  );
}

function NotFound() {
  return (
    <div
      style={{
        minHeight: '80dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--s-6)',
        textAlign: 'center',
      }}
    >
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--s-2)' }}>
        404 · LOCATION UNKNOWN
      </p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: 'var(--s-3)' }}>
        This page doesn't exist.
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--s-6)', maxWidth: '40ch' }}>
        The link may be outdated or the page has moved. Return to the workspace.
      </p>
      {/* Hard rule (Section 2): app links only to /app, never to / */}
      <Link to="/app">
        <Button variant="primary" size="lg">
          Return to workspace
        </Button>
      </Link>
    </div>
  );
}

import { SecurityGuard } from './components/SecurityGuard.jsx';

export default function App() {
  return (
    <SecurityGuard>
      <ToastProvider>
        <Background />
        <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Cinematic Intro Route */}
            <Route path="/" element={<Intro />} />

            {/* Main App Routes */}
            <Route path="/app" element={<Home />} />
            <Route path="/app/learn" element={<Learn />} />
            <Route path="/app/learn/:subject" element={<Learn />} />
            <Route path="/app/learn/:subject/:chapterId" element={<Chapter />} />
            <Route path="/app/practice" element={<Practice />} />
            <Route path="/app/pyqs" element={<Pyqs />} />
            <Route path="/app/tests" element={<Tests />} />
            <Route path="/app/tests/:testId" element={<TestRunner />} />
            <Route path="/app/focus" element={<Focus />} />
            <Route path="/app/progress" element={<Progress />} />
            <Route path="/app/saved" element={<Saved />} />
            <Route path="/app/revision" element={<Revision />} />
            <Route path="/app/profile" element={<Profile />} />

            {/* 404 inside app */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  </SecurityGuard>
  );
}
