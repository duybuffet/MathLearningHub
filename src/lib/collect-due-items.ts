// ── Collect Due Items (pure utility) ──────────────────────────
// Scans all authored topics and gathers due flashcards + exercises
// using the SR store's due selectors, then returns interleaved queue.

import { loadAuthoredTopics } from '@/lib/content-loader';
import {
  buildReviewQueue,
  flashcardItem,
  exerciseItem,
  type ReviewItem,
} from '@/lib/review-queue-builder';
import type { MathTopic } from '@/types/content-schema-types';

interface SrSelectors {
  dueFlashcardIds: (ids: string[], now: Date) => string[];
  dueExerciseIds: (ids: string[], now: Date) => string[];
  /** Topics not read yet contribute no NEW cards — only ones already scheduled. */
  isTopicRead: (topicId: string) => boolean;
  /** True once a card has been graded at least once (key "fc:<id>" | "ex:<id>"). */
  isScheduled: (key: string) => boolean;
}

/** Collect all due items across authored topics, interleaved by topic. */
export function collectDueItems(srSelectors: SrSelectors, now: Date): ReviewItem[] {
  const topics = loadAuthoredTopics();

  const buckets = topics.map((topic: MathTopic) => {
    const read = srSelectors.isTopicRead(topic.id);
    const fcIds = topic.flashcards.map((f) => f.id).filter((id) => read || srSelectors.isScheduled(`fc:${id}`));
    const exIds = topic.exercises.map((e) => e.id).filter((id) => read || srSelectors.isScheduled(`ex:${id}`));

    const dueFC = srSelectors.dueFlashcardIds(fcIds, now);
    const dueEX = srSelectors.dueExerciseIds(exIds, now);

    const fcMap = new Map(topic.flashcards.map((f) => [f.id, f]));
    const exMap = new Map(topic.exercises.map((e) => [e.id, e]));

    const items: ReviewItem[] = [
      ...dueFC.map((id) => flashcardItem(topic.id, fcMap.get(id)!)),
      ...dueEX.map((id) => exerciseItem(topic.id, exMap.get(id)!)),
    ];

    return { topicId: topic.id, items };
  });

  return buildReviewQueue(buckets);
}

/** Collect items for a single topic (drill mode). */
export function collectTopicItems(topic: MathTopic): ReviewItem[] {
  const items: ReviewItem[] = [
    ...topic.flashcards.map((f) => flashcardItem(topic.id, f)),
    ...topic.exercises.map((e) => exerciseItem(topic.id, e)),
  ];
  return [{ topicId: topic.id, items }].flatMap((b) => b.items);
}
