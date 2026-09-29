import React, { useState, useEffect } from 'react';
import { Header } from './Header.jsx';
import { Rail } from './Rail.jsx';
import { BottomBar } from './BottomBar.jsx';
import { Footer } from './Footer.jsx';
import { getProfile, updateProfile } from '../lib/storage.js';

export function AppLayout({ children }) {
  const [currentClass, setCurrentClass] = useState(11);

  useEffect(() => {
    const profile = getProfile();
    if (profile && profile.classMode !== undefined) {
      setCurrentClass(profile.classMode);
    }
  }, []);

  const handleClassChange = (newClass) => {
    setCurrentClass(newClass);
    updateProfile({ classMode: newClass });
  };

  return (
    <div className="app-root">
      <Header currentClass={currentClass} onClassChange={handleClassChange} />
      <Rail />

      <main className="app-main">
        <div className="page-enter">
          {typeof children === 'function' ? children({ currentClass }) : children}
        </div>
        <Footer />
      </main>

      <BottomBar />
    </div>
  );
}
