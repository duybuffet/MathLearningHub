// ── Ôn hôm nay (Review Today) Page ───────────────────────────
// Gathers ALL due flashcards + exercises across authored topics,
// interleaves them by topic (round-robin), steps through one at a time.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSrStore } from '@/store/spaced-repetition-store';
import { collectDueItems } from '@/lib/collect-due-items';
import { loadAuthoredTopics } from '@/lib/content-loader';
import { FlashcardView } from '@/components/flashcards/flashcard-view';
import { ExerciseCard } from '@/components/exercises/exercise-card';
import type { Grade } from '@/lib/spaced-repetition-sm2';

export function ReviewTodayPage() {
  const srStore = useSrStore();
  const now = useMemo(() => new Date(Date.now()), []);

  // Collect all authored topics for flashcard resolution
  const allTopics = useMemo(() => loadAuthoredTopics(), []);

  // Build the due queue once on mount
  const queue = useMemo(
    () =>
      collectDueItems(
        {
          dueFlashcardIds: srStore.dueFlashcardIds,
          dueExerciseIds: srStore.dueExerciseIds,
        },
        now,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [index, setIndex] = useState(0);

  const fcCount = queue.filter((i) => i.kind === 'flashcard').length;
  const exCount = queue.filter((i) => i.kind === 'exercise').length;

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <span className="text-5xl" aria-hidden>🎉</span>
        <h1 className="text-2xl font-bold text-text-primary">
          Hôm nay không có gì cần ôn
        </h1>
        <p className="text-text-muted max-w-sm">
          Tất cả thẻ và bài tập chưa đến hạn. Hãy học thêm một chủ đề mới!
        </p>
        <Link
          to="/"
          className="px-4 py-2 rounded-btn border border-border-subtle text-text-secondary text-sm hover:text-text-primary hover:border-accent-blue transition-colors"
        >
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <span className="text-4xl" aria-hidden>✅</span>
        <h1 className="text-2xl font-bold text-text-primary">
          Ôn tập xong rồi!
        </h1>
        <p className="text-text-muted">
          Bạn đã ôn {queue.length} mục hôm nay.
        </p>
        <Link
          to="/"
          className="px-4 py-2 rounded-btn border border-border-subtle text-text-secondary text-sm hover:text-text-primary hover:border-accent-blue transition-colors"
        >
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  const current = queue[index];
  const advance = () => setIndex((i) => i + 1);

  // Find flashcards for the current topic (for exercise relatedFlashcard resolution)
  const topicFlashcards =
    allTopics.find((t) => t.id === current.topicId)?.flashcards ?? [];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary">
          Ôn hôm nay (Review Today)
        </h1>
        <Link to="/" className="text-sm text-text-muted hover:text-text-primary">
          ← Trang chủ
        </Link>
      </div>

      {/* Counts */}
      <p className="text-sm text-text-muted">
        {fcCount} thẻ + {exCount} bài tập tới hạn · {index + 1}/{queue.length}
      </p>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-bg-card overflow-hidden">
        <div
          className="h-full bg-accent-blue rounded-full transition-all duration-300"
          style={{ width: `${((index) / queue.length) * 100}%` }}
        />
      </div>

      {/* Current item */}
      {current.kind === 'flashcard' && current.flashcard && (
        <div className="p-5 rounded-xl border border-border-subtle bg-bg-card">
          <p className="text-xs text-text-muted mb-3">Thẻ ghi nhớ (Flashcard)</p>
          <FlashcardView
            key={current.flashcard.id}
            card={current.flashcard}
            onGrade={(grade: Grade) => {
              srStore.gradeFlashcard(current.flashcard!.id, grade);
              advance();
            }}
          />
        </div>
      )}

      {current.kind === 'exercise' && current.exercise && (
        <ExerciseCard
          key={current.exercise.id}
          exercise={current.exercise}
          flashcards={topicFlashcards}
          onGraded={advance}
        />
      )}
    </div>
  );
}
