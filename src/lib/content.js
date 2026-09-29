/**
 * Ansh JEE — Lazy Content Loader
 * Dynamically imports content chunks via import.meta.glob.
 * If a content file is missing, it returns null without throwing,
 * allowing the UI to render the designed, honest empty state.
 */

const notesModules = import.meta.glob('../content/notes/*.js');
const pyqModules = import.meta.glob('../content/pyq/*.js');
const practiceModules = import.meta.glob('../content/practice/*.js');
const testModules = import.meta.glob('../content/tests/*.js');

export async function loadChapterNotes(chapterId) {
  const path = `../content/notes/${chapterId}.js`;
  if (notesModules[path]) {
    try {
      const mod = await notesModules[path]();
      return mod.default || mod;
    } catch (err) {
      console.warn(`[content] Error loading notes for ${chapterId}:`, err);
      return null;
    }
  }
  return null;
}

export async function loadChapterPyqs(chapterId) {
  const path = `../content/pyq/${chapterId}.js`;
  if (pyqModules[path]) {
    try {
      const mod = await pyqModules[path]();
      return mod.default || mod;
    } catch (err) {
      console.warn(`[content] Error loading PYQs for ${chapterId}:`, err);
      return null;
    }
  }
  return null;
}

export async function loadChapterPractice(chapterId) {
  const path = `../content/practice/${chapterId}.js`;
  if (practiceModules[path]) {
    try {
      const mod = await practiceModules[path]();
      return mod.default || mod;
    } catch (err) {
      console.warn(`[content] Error loading practice for ${chapterId}:`, err);
      return null;
    }
  }
  return null;
}

export async function loadTest(testId) {
  const path = `../content/tests/${testId}.js`;
  if (testModules[path]) {
    try {
      const mod = await testModules[path]();
      return mod.default || mod;
    } catch (err) {
      console.warn(`[content] Error loading test for ${testId}:`, err);
      return null;
    }
  }
  return null;
}
