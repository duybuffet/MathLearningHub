// ── Exercise List — renders exercises grouped by tier ──────────
// Warmup → Apply → Challenge order.

import type { Exercise, Flashcard } from '@/types/content-schema-types';
import { ExerciseCard } from './exercise-card';

interface ExerciseListProps {
  exercises: Exercise[];
  flashcards?: Flashcard[];
}

const TIER_ORDER = ['warmup', 'apply', 'challenge'] as const;
const TIER_LABELS = {
  warmup: 'Khởi động',
  apply: 'Áp dụng',
  challenge: 'Thử thách',
};

export function ExerciseList({ exercises, flashcards = [] }: ExerciseListProps) {
  if (exercises.length === 0) {
    return <p className="text-text-muted text-sm">Chưa có bài tập.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {TIER_ORDER.map((tier) => {
        const tiered = exercises.filter((e) => e.difficulty === tier);
        if (tiered.length === 0) return null;
        return (
          <div key={tier} className="flex flex-col gap-3">
            <h3 className="text-sm text-text-muted">
              {TIER_LABELS[tier]}
            </h3>
            {tiered.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} flashcards={flashcards} showDifficulty={false} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
