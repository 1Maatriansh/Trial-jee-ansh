/**
 * Ansh JEE — Syllabus Breakdown & Topic Weightage Registry
 * Reference mapping for detailed topics by chapter.
 */
import { CHAPTERS_DATA } from './chaptersData.js';

export const SYLLABUS_MAP = CHAPTERS_DATA.reduce((acc, chap) => {
  acc[chap.id] = {
    name: chap.name,
    subject: chap.subject,
    class: chap.class,
    topics: chap.topics,
  };
  return acc;
}, {});
