/**
 * Ansh JEE — Time & Date Helpers
 * Complies with Appendix F calculation rules:
 * - Day boundary: local midnight
 * - Week starts Monday
 * - Study time: sum of actualMs >= 1 min
 * - Streak: consecutive local days each with at least one focus session >= 10 mins
 */

/** Format milliseconds into "Xh Ym" or "Ym" */
export function formatDuration(ms) {
  if (!ms || ms < 60000) return '0m';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

/** Format milliseconds into MM:SS for timers */
export function formatTimerDigits(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Get start of local day (midnight timestamp) */
export function getStartOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Get start of local week (Monday 00:00:00) */
export function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Calculate consecutive day streak from focus sessions */
export function calculateStreak(sessions = []) {
  if (!sessions || sessions.length === 0) return 0;

  // Filter sessions >= 10 minutes (600,000 ms)
  const validSessions = sessions.filter((s) => (s.actualMs || 0) >= 600000);
  if (validSessions.length === 0) return 0;

  // Map to sorted unique local day timestamps
  const uniqueDays = Array.from(
    new Set(validSessions.map((s) => getStartOfDay(new Date(s.startedAt))))
  ).sort((a, b) => b - a); // descending

  if (uniqueDays.length === 0) return 0;

  const today = getStartOfDay(new Date());
  const oneDayMs = 86400000;

  // Streak continues if the most recent session was today or yesterday
  const mostRecent = uniqueDays[0];
  if (mostRecent !== today && mostRecent !== today - oneDayMs) {
    return 0;
  }

  let streak = 1;
  let checkDay = mostRecent;

  for (let i = 1; i < uniqueDays.length; i++) {
    if (uniqueDays[i] === checkDay - oneDayMs) {
      streak++;
      checkDay = uniqueDays[i];
    } else {
      break;
    }
  }

  return streak;
}

/** Get today's total study time in ms */
export function getTodayStudyTime(sessions = []) {
  const todayStart = getStartOfDay();
  return sessions
    .filter((s) => s.startedAt >= todayStart && (s.actualMs || 0) >= 60000)
    .reduce((acc, s) => acc + (s.actualMs || 0), 0);
}

/** Get this week's study time in ms */
export function getThisWeekStudyTime(sessions = []) {
  const weekStart = getStartOfWeek();
  return sessions
    .filter((s) => s.startedAt >= weekStart && (s.actualMs || 0) >= 60000)
    .reduce((acc, s) => acc + (s.actualMs || 0), 0);
}
