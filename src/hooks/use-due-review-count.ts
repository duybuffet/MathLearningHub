import { useMemo } from 'react';
import { useSrStore } from '@/store/spaced-repetition-store';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { collectDueItems } from '@/lib/collect-due-items';

/** Number of flashcards + exercises due today (only topics the learner has read). */
export function useDueReviewCount(): number {
  const schedules = useSrStore((s) => s.schedules);
  const progress = useProgressStore((s) => s.progress);

  return useMemo(() => {
    const { dueFlashcardIds, dueExerciseIds } = useSrStore.getState();
    return collectDueItems(
      {
        dueFlashcardIds,
        dueExerciseIds,
        isTopicRead: (id) => Boolean(progress[id]?.read),
        isScheduled: (key) => key in schedules,
      },
      new Date(),
    ).length;
  }, [schedules, progress]);
}
