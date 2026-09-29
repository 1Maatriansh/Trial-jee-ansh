import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/AppLayout.jsx';
import { Button } from '../../components/Button.jsx';
import { Modal } from '../../components/Modal.jsx';
import { useToast } from '../../components/Toast.jsx';
import {
  getProfile,
  updateProfile,
  exportAll,
  importAll,
  resetAll,
} from '../../lib/storage.js';

export default function Profile() {
  const [profile, setProfile] = useState(() => getProfile());
  const [nameInput, setNameInput] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setNameInput(p.name || '');
  }, []);

  const handleSaveName = (e) => {
    e.preventDefault();
    updateProfile({ name: nameInput.trim() });
    setProfile(getProfile());
    showToast('Name updated');
  };

  const handleExportData = () => {
    try {
      const backup = exportAll();
      const dateStr = new Date().toISOString().slice(0, 10);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ansh-jee-backup-${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup downloaded');
    } catch {
      showToast('Export failed');
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importAll(parsed);
        setProfile(getProfile());
        showToast('Backup restored successfully');
      } catch (err) {
        console.error(err);
        showToast("That file doesn't look like an Ansh JEE backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    resetAll();
    setProfile(getProfile());
    setNameInput('');
    setIsResetModalOpen(false);
    showToast('Data reset complete');
  };

  return (
    <AppLayout>
      <div className="content-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Personal Settings
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
            Profile & Data Storage
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '54ch' }}>
            Ansh JEE stores your progress on this device only. Nothing is sent to a server. Clearing your browser data will remove it, so export a backup if you want to keep it.
          </p>
        </section>

        {/* Name Configuration */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-3)',
            padding: 'var(--s-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s-4)',
            maxWidth: '480px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Display Identity
          </span>

          <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              What should we call you? (Optional)
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Aarav"
              maxLength={40}
              style={{
                height: '40px',
                padding: '0 var(--s-3)',
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-2)',
                color: 'var(--text-primary)',
              }}
            />
            <div>
              <Button type="submit" variant="primary">
                Save Name
              </Button>
            </div>
          </form>
        </section>

        {/* Backup & Data Management */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-3)',
            padding: 'var(--s-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s-4)',
            maxWidth: '480px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Data Portability
          </span>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Export all recorded focus sessions, chapter statuses, bookmarks, test records, and mistake notes as a single JSON file.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
            <Button variant="secondary" onClick={handleExportData}>
              Export Data (JSON)
            </Button>

            <label style={{ cursor: 'pointer' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '44px',
                  padding: '0 var(--s-4)',
                  borderRadius: 'var(--r-2)',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                }}
              >
                Import Data
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </section>

        {/* Danger Zone: Reset */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--r-3)',
            padding: 'var(--s-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s-3)',
            maxWidth: '480px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--danger)' }}>
            Danger Zone
          </span>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Resetting your data clears all focus logs, test history, and bookmarks from this browser immediately.
          </p>
          <div>
            <Button variant="secondary" onClick={() => setIsResetModalOpen(true)} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
              Reset My Data
            </Button>
          </div>
        </section>

        {/* Reset Confirmation Modal */}
        <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title="Reset all preparation data?"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              This action cannot be undone. All your recorded focus hours, chapter completion states, and test results stored on this device will be erased.
            </p>
            <div style={{ display: 'flex', gap: 'var(--s-3)' }}>
              <Button variant="primary" onClick={handleConfirmReset} style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
                Yes, Reset Everything
              </Button>
              <Button variant="ghost" onClick={() => setIsResetModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
