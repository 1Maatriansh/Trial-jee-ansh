/**
 * Ansh JEE — Local Storage Wrapper
 *
 * All localStorage access goes through this module.
 * - All reads are validated; corrupted data falls back to safe defaults.
 * - All writes are wrapped in try/catch (private browsing can throw).
 * - Keys are namespaced as ajee:v1:<type>.
 * - Schema version is included in every stored object.
 *
 * Security: never store sensitive data here. Data is on the user's device only.
 */

const PREFIX = 'ajee:v1:';
const SCHEMA_VERSION = 1;

// ── Default shapes ─────────────────────────────────────────────────────────

const DEFAULTS = {
  profile: {
    v: SCHEMA_VERSION,
    name: '',
    classMode: 11,  // 11 | 12 | 'dropper'
    theme: 'mono',
    createdAt: 0,
    lastChapterId: null,
  },
  chapters: {},    // { [chapterId]: { status, openedAt, updatedAt, opens } }
  focus: [],       // append-only, capped at 2000
  attempts: [],    // append-only, capped at 5000
  tests: {
    inProgress: null,
    finished: [],
  },
  saved: {
    chapters: [],
    notes: [],       // [{ chapterId, sectionId }]
    questions: [],
    revision: [],
  },
  mistakes: [],    // mistake log
};

// ── Validation helpers ──────────────────────────────────────────────────────

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function validate(key, raw) {
  try {
    const parsed = JSON.parse(raw);
    // Minimal shape checks per key
    switch (key) {
      case 'profile':
        if (!isObject(parsed)) return null;
        if (typeof parsed.classMode === 'undefined') return null;
        return parsed;
      case 'chapters':
        if (!isObject(parsed)) return null;
        return parsed;
      case 'focus':
      case 'attempts':
      case 'mistakes':
        if (!Array.isArray(parsed)) return null;
        return parsed;
      case 'tests':
        if (!isObject(parsed)) return null;
        if (!Array.isArray(parsed.finished)) return null;
        return parsed;
      case 'saved':
        if (!isObject(parsed)) return null;
        if (!Array.isArray(parsed.chapters)) return null;
        return parsed;
      default:
        return parsed;
    }
  } catch {
    return null;
  }
}

// ── Core read/write ─────────────────────────────────────────────────────────

let _onWriteError = null;

/** Register a callback to be called when a write fails (e.g. to show a toast). */
export function onStorageWriteError(cb) {
  _onWriteError = cb;
}

export function read(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return structuredClone(DEFAULTS[key] ?? null);
    const validated = validate(key, raw);
    if (validated === null) {
      console.warn(`[storage] Corrupted data for key "${key}", using default.`);
      return structuredClone(DEFAULTS[key] ?? null);
    }
    // Merge with defaults to handle added fields in future schema versions
    if (key in DEFAULTS && isObject(DEFAULTS[key]) && isObject(validated)) {
      return { ...structuredClone(DEFAULTS[key]), ...validated };
    }
    return validated;
  } catch {
    return structuredClone(DEFAULTS[key] ?? null);
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] Write failed for key "${key}":`, err);
    if (_onWriteError) _onWriteError(key);
    return false;
  }
}

// ── Convenience helpers ─────────────────────────────────────────────────────

export function getProfile() {
  return read('profile');
}

export function setProfile(profile) {
  return write('profile', { ...profile, v: SCHEMA_VERSION });
}

export function updateProfile(updates) {
  const current = getProfile();
  return setProfile({ ...current, ...updates });
}

export function getChapters() {
  return read('chapters');
}

export function setChapterStatus(chapterId, status) {
  const chapters = getChapters();
  const now = Date.now();
  const existing = chapters[chapterId] ?? { openedAt: now, opens: 0 };
  chapters[chapterId] = {
    ...existing,
    status,
    updatedAt: now,
    opens: (existing.opens || 0) + 1,
  };
  return write('chapters', chapters);
}

export function markChapterOpened(chapterId) {
  const chapters = getChapters();
  const now = Date.now();
  const existing = chapters[chapterId];
  if (!existing) {
    chapters[chapterId] = { status: 'not_started', openedAt: now, updatedAt: now, opens: 1 };
  } else {
    chapters[chapterId] = { ...existing, updatedAt: now, opens: (existing.opens || 0) + 1 };
  }
  return write('chapters', chapters);
}

export function getFocusSessions() {
  return read('focus');
}

export function addFocusSession(session) {
  const sessions = getFocusSessions();
  const capped = sessions.length >= 2000 ? sessions.slice(-1999) : sessions;
  return write('focus', [...capped, { ...session, id: session.id ?? crypto.randomUUID() }]);
}

export function getAttempts() {
  return read('attempts');
}

export function addAttempt(attempt) {
  const attempts = getAttempts();
  const capped = attempts.length >= 5000 ? attempts.slice(-4999) : attempts;
  return write('attempts', [...capped, { ...attempt, id: attempt.id ?? crypto.randomUUID() }]);
}

export function getTests() {
  return read('tests');
}

export function setTestInProgress(state) {
  const tests = getTests();
  return write('tests', { ...tests, inProgress: state });
}

export function addFinishedTest(result) {
  const tests = getTests();
  return write('tests', {
    ...tests,
    inProgress: null,
    finished: [...(tests.finished || []), result],
  });
}

export function getSaved() {
  return read('saved');
}

export function toggleSavedChapter(chapterId) {
  const saved = getSaved();
  const idx = saved.chapters.indexOf(chapterId);
  if (idx === -1) {
    saved.chapters = [...saved.chapters, chapterId];
  } else {
    saved.chapters = saved.chapters.filter(id => id !== chapterId);
  }
  write('saved', saved);
  return idx === -1; // returns true if now saved
}

export function toggleSavedQuestion(questionId) {
  const saved = getSaved();
  const idx = saved.questions.indexOf(questionId);
  if (idx === -1) {
    saved.questions = [...saved.questions, questionId];
  } else {
    saved.questions = saved.questions.filter(id => id !== questionId);
  }
  write('saved', saved);
  return idx === -1;
}

export function toggleRevisionQuestion(questionId) {
  const saved = getSaved();
  const idx = saved.revision.indexOf(questionId);
  if (idx === -1) {
    saved.revision = [...saved.revision, questionId];
  } else {
    saved.revision = saved.revision.filter(id => id !== questionId);
  }
  write('saved', saved);
  return idx === -1;
}

export function getMistakes() {
  return read('mistakes');
}

export function addMistake(mistake) {
  const mistakes = getMistakes();
  return write('mistakes', [...mistakes, { ...mistake, id: crypto.randomUUID() }]);
}

// ── Export / Import / Reset ─────────────────────────────────────────────────

export function exportAll() {
  const keys = ['profile', 'chapters', 'focus', 'attempts', 'tests', 'saved', 'mistakes'];
  const data = {};
  for (const key of keys) {
    data[key] = read(key);
  }
  return { exportedAt: new Date().toISOString(), version: SCHEMA_VERSION, data };
}

export function importAll(backup) {
  if (!isObject(backup) || !isObject(backup.data)) {
    throw new Error('Invalid backup format.');
  }
  const keys = ['profile', 'chapters', 'focus', 'attempts', 'tests', 'saved', 'mistakes'];
  for (const key of keys) {
    if (backup.data[key] !== undefined) {
      // Validate before writing
      const raw = JSON.stringify(backup.data[key]);
      const validated = validate(key, raw);
      if (validated !== null) {
        write(key, validated);
      }
    }
  }
}

export function resetAll() {
  const keys = ['profile', 'chapters', 'focus', 'attempts', 'tests', 'saved', 'mistakes'];
  for (const key of keys) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      // ignore
    }
  }
}
