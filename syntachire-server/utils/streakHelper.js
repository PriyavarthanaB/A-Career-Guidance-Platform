function toDateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function updateStreak(streak, activityDate = new Date()) {
  const today = toDateKey(activityDate);
  const last = streak.lastActivityDate ? toDateKey(streak.lastActivityDate) : null;

  if (last === today) {
    return streak;
  }

  const gap = last ? daysBetween(streak.lastActivityDate, activityDate) : null;

  if (!last || gap === 1) {
    streak.current = (last ? streak.current : 0) + 1;
  } else if (gap > 1) {
    streak.current = 1;
  }

  streak.longest = Math.max(streak.longest || 0, streak.current);
  streak.lastActivityDate = activityDate;
  return streak;
}

module.exports = { toDateKey, updateStreak };
