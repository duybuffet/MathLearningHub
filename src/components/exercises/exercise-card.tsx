// ── Exercise Card — single exercise with hints + solution reveal ─
// Difficulty badge, prompt, progressive hints, step-by-step solution,
// then SR self-grade buttons.

import { useState } from 'react';
import type { Exercise, Flashcard } from '@/types/content-schema-types';
import type { Grade } from '@/lib/spaced-repetition-sm2';
import { useSrStore } from '@/store/spaced-repetition-store';
import { InlineMarkdown } from '@/components/topic/inline-markdown';
import { SolutionStepsView } from './solution-steps-view';

interface ExerciseCardProps {
  exercise: Exercise;
  /** Pass all topic flashcards so we can resolve relatedFlashcard front text. */
  flashcards?: Flashcard[];
  onGraded?: () => void;
}

const DIFFICULTY_META = {
  warmup: { label: 'Khởi động (Warmup)', className: 'text-green-400 border-green-400/30 bg-green-400/5' },
  apply: { label: 'Áp dụng (Apply)', className: 'text-blue-400 border-blue-400/30 bg-blue-400/5' },
  challenge: { label: 'Thử thách (Challenge)', className: 'text-purple-400 border-purple-400/30 bg-purple-400/5' },
};

const GRADE_BTNS: { grade: Grade; label: string; cls: string }[] = [
  { grade: 'again', label: 'Chưa nhớ', cls: 'border-red-500/40 text-red-400 hover:bg-red-500/10' },
  { grade: 'hard', label: 'Khó', cls: 'border-orange-400/40 text-orange-400 hover:bg-orange-400/10' },
  { grade: 'good', label: 'Được', cls: 'border-blue-400/40 text-blue-400 hover:bg-blue-400/10' },
  { grade: 'easy', label: 'Dễ', cls: 'border-green-400/40 text-green-400 hover:bg-green-400/10' },
];

export function ExerciseCard({ exercise, flashcards = [], onGraded }: ExerciseCardProps) {
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [graded, setGraded] = useState(false);
  const gradeExercise = useSrStore((s) => s.gradeExercise);

  const meta = DIFFICULTY_META[exercise.difficulty];
  const relatedFc = exercise.relatedFlashcard
    ? flashcards.find((f) => f.id === exercise.relatedFlashcard)
    : undefined;

  function handleGrade(grade: Grade) {
    gradeExercise(exercise.id, grade);
    setGraded(true);
    onGraded?.();
  }

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-border-subtle bg-bg-card">
      {/* Difficulty badge */}
      <span className={`self-start text-xs px-2 py-0.5 rounded-full border font-medium ${meta.className}`}>
        {meta.label}
      </span>

      {/* Prompt */}
      <div className="text-text-primary text-sm leading-relaxed">
        <InlineMarkdown text={exercise.prompt} />
      </div>

      {/* Progressive hints */}
      {exercise.hints.length > 0 && !solutionVisible && (
        <div className="flex flex-col gap-2">
          {exercise.hints.slice(0, hintsShown).map((hint, i) => (
            <div key={i} className="text-sm text-text-muted px-3 py-2 rounded-lg border border-border-subtle bg-bg-primary">
              <span className="text-text-muted mr-1">💡</span>
              <InlineMarkdown text={hint} />
            </div>
          ))}
          {hintsShown < exercise.hints.length && (
            <button
              onClick={() => setHintsShown((n) => n + 1)}
              className="self-start text-xs text-text-muted hover:text-text-primary border border-border-subtle rounded px-3 py-1.5 transition-colors"
            >
              Hiện gợi ý ({hintsShown + 1}/{exercise.hints.length})
            </button>
          )}
        </div>
      )}

      {/* Solution reveal */}
      {!solutionVisible ? (
        <button
          onClick={() => setSolutionVisible(true)}
          className="self-start text-sm border border-border-subtle rounded-btn px-4 py-2 text-text-secondary hover:text-text-primary hover:border-accent-blue/40 transition-colors"
        >
          Xem lời giải (Solution)
        </button>
      ) : (
        <SolutionStepsView
          exercise={exercise}
          relatedFlashcardFront={relatedFc?.front}
        />
      )}

      {/* Self-grade after viewing solution */}
      {solutionVisible && !graded && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-muted">Tự đánh giá (Self-grade):</p>
          <div className="grid grid-cols-4 gap-2">
            {GRADE_BTNS.map(({ grade, label, cls }) => (
              <button
                key={grade}
                onClick={() => handleGrade(grade)}
                className={`py-2 px-1 rounded-lg border text-sm font-medium transition-colors ${cls}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {graded && (
        <p className="text-xs text-text-muted">
          ✓ Đã ghi lại kết quả — sẽ ôn lại theo lịch.
        </p>
      )}
    </div>
  );
}
