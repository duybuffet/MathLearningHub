// ── Ôn tập hôm nay Page ───────────────────────────
// Gathers ALL due flashcards + exercises across authored topics,
// interleaves them by topic (round-robin), steps through one at a time.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSrStore } from '@/store/spaced-repetition-store';
import { useProgressStore } from '@/store/progress-store-with-persist';
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
          isTopicRead: (id) => Boolean(useProgressStore.getState().progress[id]?.read),
          isScheduled: (key) => key in useSrStore.getState().schedules,
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
      <div className="flex flex-col items-start gap-4 py-12">
        <h1 className="font-serif text-2xl text-text-primary">
          Chưa có gì đến hạn
        </h1>
        <p className="text-text-muted max-w-sm">
          Thẻ và bài tập của một bài sẽ vào đây sau khi bạn đọc xong bài đó. Đọc thêm một bài rồi quay lại.
        </p>
        <Link
          to="/"
          className="rounded-btn bg-bg-card px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          Về mục lục
        </Link>
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <h1 className="font-serif text-2xl text-text-primary">
          Xong phần ôn hôm nay
        </h1>
        <p className="text-text-muted">
          Bạn đã ôn {queue.length} mục hôm nay.
        </p>
        <Link
          to="/"
          className="rounded-btn bg-bg-card px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          Về mục lục
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
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-text-primary">
          Ôn tập hôm nay
        </h1>
        <Link to="/" className="text-sm text-text-muted hover:text-text-primary">
          Mục lục
        </Link>
      </div>

      {/* Counts */}
      <p className="text-sm text-text-muted">
        {fcCount} thẻ + {exCount} bài tập đến hạn. Đang ở mục {index + 1}/{queue.length}.
      </p>

      {/* Progress bar */}
      <div className="h-1 overflow-hidden rounded-full bg-bg-card">
        <div
          className="h-full rounded-full bg-accent-orange transition-all duration-300"
          style={{ width: `${((index) / queue.length) * 100}%` }}
        />
      </div>

      {/* Current item */}
      {current.kind === 'flashcard' && current.flashcard && (
        <div>
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
