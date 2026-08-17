// ── SM-2 Spaced Repetition Algorithm (pure TS, no React) ───────
// Reference: Piotr Wozniak's SM-2 algorithm (SuperMemo 2).
// Pure functions — no side effects, no React, fully unit-testable.

/** Scheduling state persisted per flashcard or exercise. */
export interface CardSchedule {
  /** SM-2 ease factor, floor = 1.3. Default 2.5. */
  ease: number;
  /** Days until next review. 0 = due today / same session. */
  intervalDays: number;
  /** Number of consecutive successful reviews (resets on 'again'). */
  reps: number;
  /** ISO string for next due date. */
  dueDate: string;
}

/** Self-assessment grades mapped to SM-2 quality values. */
export type Grade = 'again' | 'hard' | 'good' | 'easy';

// Grade → SM-2 quality (q):
// again=2 (fail), hard=3, good=4, easy=5
const GRADE_QUALITY: Record<Grade, number> = {
  again: 2,
  hard: 3,
  good: 4,
  easy: 5,
};

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

/** Initial schedule: due immediately, ease 2.5, no history. */
export function initialSchedule(now: Date): CardSchedule {
  return {
    ease: DEFAULT_EASE,
    intervalDays: 0,
    reps: 0,
    dueDate: now.toISOString(),
  };
}

/**
 * SM-2 review computation.
 *
 * Interval progression:
 *   - again: reps=0, intervalDays=1 (retry next session / tomorrow)
 *   - reps=1 after success: 1 day
 *   - reps=2 after success: 6 days
 *   - reps>2: round(prevInterval * ease)
 *
 * Ease adjustment (SM-2 formula):
 *   ease' = ease + (0.1 - (5-q)*(0.08 + (5-q)*0.02))
 *   clamped to >= MIN_EASE
 */
export function review(
  sched: CardSchedule,
  grade: Grade,
  now: Date,
): CardSchedule {
  const q = GRADE_QUALITY[grade];

  if (grade === 'again') {
    // Failed: reset repetitions and reschedule for next day
    const due = new Date(now);
    due.setDate(due.getDate() + 1);
    const newEase = Math.max(MIN_EASE, sched.ease - 0.2);
    return {
      ease: newEase,
      intervalDays: 1,
      reps: 0,
      dueDate: due.toISOString(),
    };
  }

  // Successful review — increment reps and compute new interval
  const newReps = sched.reps + 1;

  let newInterval: number;
  if (newReps === 1) {
    newInterval = 1;
  } else if (newReps === 2) {
    newInterval = 6;
  } else {
    newInterval = Math.round(sched.intervalDays * sched.ease);
  }

  // SM-2 ease factor adjustment
  const easeAdj = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  const newEase = Math.max(MIN_EASE, sched.ease + easeAdj);

  const due = new Date(now);
  due.setDate(due.getDate() + newInterval);

  return {
    ease: newEase,
    intervalDays: newInterval,
    reps: newReps,
    dueDate: due.toISOString(),
  };
}

/** Returns true if the card is due for review at the given time. */
export function isDue(sched: CardSchedule, now: Date): boolean {
  return new Date(sched.dueDate) <= now;
}
