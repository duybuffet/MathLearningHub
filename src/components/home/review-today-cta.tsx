// CTA card: shows due SR count → links to /review. Empty state when nothing due.
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useSrStore } from '@/store/spaced-repetition-store';
import { loadAuthoredTopics } from '@/lib/content-loader';

export function ReviewTodayCta() {
  const srStore = useSrStore();
  const now = useMemo(() => new Date(Date.now()), []);

  const dueCount = useMemo(() => {
    const topics = loadAuthoredTopics();
    let total = 0;
    for (const topic of topics) {
      total += srStore.dueFlashcardIds(topic.flashcards.map((f) => f.id), now).length;
      total += srStore.dueExerciseIds(topic.exercises.map((e) => e.id), now).length;
    }
    return total;
  }, [srStore, now]);

  if (dueCount === 0) {
    return (
      <div className="rounded-card border border-border-subtle bg-bg-card p-5 flex items-center gap-4">
        <span className="text-2xl" aria-hidden="true">✓</span>
        <div>
          <p className="font-semibold text-text-primary text-sm">Hoàn thành cho hôm nay!</p>
          <p className="text-xs text-text-muted mt-0.5">Không có thẻ ôn tập. Hãy học thêm chủ đề mới.</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      to="/review"
      className="block rounded-card border border-accent-orange/40 bg-accent-orange/5 p-5 hover:bg-accent-orange/10 transition-colors no-underline group"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-orange/15 text-xl flex-shrink-0" aria-hidden="true">
          🔥
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-primary">
            Ôn hôm nay (Review Today)
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            <span className="font-semibold text-accent-orange">{dueCount}</span> thẻ cần ôn —{' '}
            <span className="text-text-muted">đừng để quên!</span>
          </p>
        </div>
        <span className="text-accent-orange text-lg group-hover:translate-x-1 transition-transform duration-150 flex-shrink-0">
          →
        </span>
      </div>
    </Link>
  );
}
