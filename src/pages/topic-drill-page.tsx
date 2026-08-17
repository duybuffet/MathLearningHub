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
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-4xl" aria-hidden>🚧</span>
        <h1 className="text-xl font-bold text-text-primary">Chủ đề không tồn tại</h1>
        <Link to="/" className="text-sm text-text-muted hover:text-text-primary">← Về trang chủ</Link>
      </div>
    );
  }

  const topicId = topicIdFor(areaId!, topicSlug!);
  const queue = collectTopicItems(topic);
  const advance = () => setIndex((i) => i + 1);

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-text-muted">Chủ đề này chưa có thẻ hoặc bài tập.</p>
        <Link to={`/area/${areaId}/${topicSlug}`} className="text-sm text-text-muted hover:text-text-primary">
          ← Về trang chủ đề
        </Link>
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <span className="text-4xl" aria-hidden>🎯</span>
        <h1 className="text-xl font-bold text-text-primary">Hoàn thành luyện tập!</h1>
        <p className="text-text-muted">{queue.length} mục — {topic.title}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setIndex(0)}
            className="px-4 py-2 rounded-btn border border-border-subtle text-text-secondary text-sm hover:border-accent-blue hover:text-text-primary transition-colors"
          >
            Luyện lại
          </button>
          <Link
            to={`/area/${areaId}/${topicSlug}`}
            className="px-4 py-2 rounded-btn border border-border-subtle text-text-secondary text-sm hover:border-accent-blue hover:text-text-primary transition-colors"
          >
            Về chủ đề
          </Link>
        </div>
      </div>
    );
  }

  const current = queue[index];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to={`/area/${areaId}/${topicSlug}`} className="text-xs text-text-muted hover:text-text-primary">
            ← {topic.title}
          </Link>
          <h1 className="text-xl font-bold text-text-primary mt-1">
            Luyện tập (Drill)
          </h1>
        </div>
        <span className="text-sm text-text-muted">
          {index + 1} / {queue.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-bg-card overflow-hidden">
        <div
          className="h-full bg-accent-orange rounded-full transition-all duration-300"
          style={{ width: `${(index / queue.length) * 100}%` }}
        />
      </div>

      {/* Current item */}
      {current.kind === 'flashcard' && current.flashcard && (
        <div className="p-5 rounded-xl border border-border-subtle bg-bg-card">
          <p className="text-xs text-text-muted mb-3">Thẻ ghi nhớ (Flashcard)</p>
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
