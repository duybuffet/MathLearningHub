// ── Topic Drill Page — focused single-topic practice ──────────
// Route: /drill/:areaId/:topicSlug
// Runs all flashcards + exercises for one topic in sequence.

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findTopicEntry, loadTopicByFile, topicIdFor } from '@/lib/content-loader';
import { collectTopicItems } from '@/lib/collect-due-items';
import { useSrStore } from '@/store/spaced-repetition-store';
import { FlashcardView } from '@/components/flashcards/flashcard-view';
import { ExerciseCard } from '@/components/exercises/exercise-card';
import type { Grade } from '@/lib/spaced-repetition-sm2';

export function TopicDrillPage() {
  const { areaId, topicSlug } = useParams<{ areaId: string; topicSlug: string }>();
  const entry = areaId && topicSlug ? findTopicEntry(areaId, topicSlug) : null;
  const topic = entry?.topic?.file ? loadTopicByFile(entry.topic.file) : null;

  const srStore = useSrStore();
  const [index, setIndex] = useState(0);

  if (!topic) {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <h1 className="font-serif text-2xl text-text-primary">Chủ đề không tồn tại</h1>
        <Link to="/" className="text-sm text-text-muted hover:text-text-primary">Về mục lục</Link>
      </div>
    );
  }

  const topicId = topicIdFor(areaId!, topicSlug!);
  const queue = collectTopicItems(topic);
  const advance = () => setIndex((i) => i + 1);

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <p className="text-text-muted">Chủ đề này chưa có thẻ hoặc bài tập.</p>
        <Link to={`/area/${areaId}/${topicSlug}`} className="text-sm text-text-muted hover:text-text-primary">
          Về mục lục đề
        </Link>
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <h1 className="font-serif text-2xl text-text-primary">Xong phần luyện tập</h1>
        <p className="text-text-muted">{queue.length} mục của bài {topic.title}.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setIndex(0)}
            className="rounded-btn bg-bg-card px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Luyện lại
          </button>
          <Link
            to={`/area/${areaId}/${topicSlug}`}
            className="rounded-btn bg-bg-card px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Về chủ đề
          </Link>
        </div>
      </div>
    );
  }

  const current = queue[index];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to={`/area/${areaId}/${topicSlug}`} className="text-xs text-text-muted hover:text-text-primary">
            ← {topic.title}
          </Link>
          <h1 className="font-serif text-2xl text-text-primary mt-1">
            Luyện tập
          </h1>
        </div>
        <span className="text-sm text-text-muted">
          {index + 1} / {queue.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 overflow-hidden rounded-full bg-bg-card">
        <div
          className="h-full bg-accent-orange rounded-full transition-all duration-300"
          style={{ width: `${(index / queue.length) * 100}%` }}
        />
      </div>

      {/* Current item */}
      {current.kind === 'flashcard' && current.flashcard && (
        <div>
          <FlashcardView
            key={`${topicId}-${current.flashcard.id}`}
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
          key={`${topicId}-${current.exercise.id}`}
          exercise={current.exercise}
          flashcards={topic.flashcards}
          onGraded={advance}
        />
      )}
    </div>
  );
}
