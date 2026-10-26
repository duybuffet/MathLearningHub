// ── Exercise Card — single exercise with hints + solution reveal ─
// Difficulty badge, prompt, progressive hints, step-by-step solution,
// then SR self-grade buttons.

import { useState } from 'react';
import type { Exercise, Flashcard } from '@/types/content-schema-types';
import type { Grade } from '@/lib/spaced-repetition-sm2';
import { useSrStore } from '@/store/spaced-repetition-store';
import { InlineMarkdown } from '@/components/topic/inline-markdown';
import { ProseBlocks } from '@/components/topic/markdown-table';
import { SelfGradeButtons } from '@/components/ui/self-grade-buttons';
import { SolutionStepsView } from './solution-steps-view';

interface ExerciseCardProps {
  exercise: Exercise;
  /** Pass all topic flashcards so we can resolve relatedFlashcard front text. */
  flashcards?: Flashcard[];
  onGraded?: () => void;
  /** Show the tier label (review page); the topic page groups by tier instead. */
  showDifficulty?: boolean;
}

const DIFFICULTY_LABEL = {
  warmup: 'Khởi động',
  apply: 'Áp dụng',
  challenge: 'Thử thách',
};

export function ExerciseCard({ exercise, flashcards = [], onGraded, showDifficulty = true }: ExerciseCardProps) {
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [graded, setGraded] = useState(false);
  const gradeExercise = useSrStore((s) => s.gradeExercise);

  const relatedFc = exercise.relatedFlashcard
    ? flashcards.find((f) => f.id === exercise.relatedFlashcard)
    : undefined;

  function handleGrade(grade: Grade) {
    gradeExercise(exercise.id, grade);
    setGraded(true);
    onGraded?.();
  }

  const linkBtn = 'text-sm text-accent-blue transition-colors hover:text-text-primary';

  return (
    <div className="flex flex-col gap-4 rounded-card bg-bg-card px-5 py-5">
      {showDifficulty && <span className="text-xs text-text-muted">{DIFFICULTY_LABEL[exercise.difficulty]}</span>}

      <div className="font-serif text-text-primary">
        <ProseBlocks content={exercise.prompt} className="leading-relaxed" />
      </div>

      {/* Progressive hints */}
      {hintsShown > 0 && !solutionVisible && (
        <ol className="space-y-2 border-l border-accent-blue/40 pl-4">
          {exercise.hints.slice(0, hintsShown).map((hint, i) => (
            <li key={i} className="text-sm leading-relaxed text-text-secondary">
              <span className="mr-2 text-xs text-text-muted">Gợi ý {i + 1}</span>
              <InlineMarkdown text={hint} />
            </li>
          ))}
        </ol>
      )}

      {!solutionVisible && (
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {hintsShown < exercise.hints.length && (
            <button onClick={() => setHintsShown((n) => n + 1)} className={linkBtn}>
              {hintsShown === 0 ? 'Xem gợi ý' : 'Thêm gợi ý'}
              <span className="ml-1 text-text-muted tabular-nums">
                {hintsShown + 1}/{exercise.hints.length}
              </span>
            </button>
          )}
          <button onClick={() => setSolutionVisible(true)} className={linkBtn}>
            Xem lời giải
          </button>
        </div>
      )}

      {solutionVisible && (
        <SolutionStepsView exercise={exercise} relatedFlashcardFront={relatedFc?.front} />
      )}

      {solutionVisible && !graded && (
        <SelfGradeButtons onGrade={handleGrade} prompt="Bạn tự làm được tới đâu?" />
      )}

      {graded && <p className="text-xs text-text-muted">Đã lưu. Bài này sẽ quay lại trong mục Ôn tập.</p>}
    </div>
  );
}
