// ── Spaced Repetition Store (zustand + localStorage persist) ───
// Tracks SM-2 CardSchedule per flashcard and exercise.
// Flashcard ids prefixed "fc:", exercise ids prefixed "ex:".

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type CardSchedule,
  type Grade,
  initialSchedule,
  review,
  isDue,
} from '@/lib/spaced-repetition-sm2';

interface SrState {
  /** Namespaced schedules: keys are "fc:<id>" or "ex:<id>". */
  schedules: Record<string, CardSchedule>;

  // ── Actions ──
  gradeFlashcard: (cardId: string, grade: Grade) => void;
  gradeExercise: (exerciseId: string, grade: Grade) => void;

  // ── Selectors ──
  getSchedule: (namespacedId: string) => CardSchedule | undefined;
  dueFlashcardIds: (ids: string[], now: Date) => string[];
  dueExerciseIds: (ids: string[], now: Date) => string[];
}

function fcKey(id: string): string {
  return `fc:${id}`;
}

function exKey(id: string): string {
  return `ex:${id}`;
}

export const useSrStore = create<SrState>()(
  persist(
    (set, get) => ({
      schedules: {},

      gradeFlashcard(cardId, grade) {
        const key = fcKey(cardId);
        const now = new Date(Date.now());
        set((state) => {
          const prev = state.schedules[key] ?? initialSchedule(now);
          return {
            schedules: {
              ...state.schedules,
              [key]: review(prev, grade, now),
            },
          };
        });
      },

      gradeExercise(exerciseId, grade) {
        const key = exKey(exerciseId);
        const now = new Date(Date.now());
        set((state) => {
          const prev = state.schedules[key] ?? initialSchedule(now);
          return {
            schedules: {
              ...state.schedules,
              [key]: review(prev, grade, now),
            },
          };
        });
      },

      getSchedule(namespacedId) {
        return get().schedules[namespacedId];
      },

      dueFlashcardIds(ids, now) {
        const { schedules } = get();
        return ids.filter((id) => {
          const sched = schedules[fcKey(id)];
          // Never-reviewed cards are immediately due
          if (!sched) return true;
          return isDue(sched, now);
        });
      },

      dueExerciseIds(ids, now) {
        const { schedules } = get();
        return ids.filter((id) => {
          const sched = schedules[exKey(id)];
          if (!sched) return true;
          return isDue(sched, now);
        });
      },
    }),
    { name: 'math-hub-srs' },
  ),
);
