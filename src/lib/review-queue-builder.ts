// ── Review Queue Builder (pure, no React) ─────────────────────
// Builds an interleaved review queue by round-robining topic buckets.
// Deterministic — no Math.random() in render path.

import type { Flashcard, Exercise } from '@/types/content-schema-types';

export type ReviewItemKind = 'flashcard' | 'exercise';

export interface ReviewItem {
  kind: ReviewItemKind;
  topicId: string;
  flashcard?: Flashcard;
  exercise?: Exercise;
}

interface TopicBucket {
  topicId: string;
  items: ReviewItem[];
}

/**
 * Round-robin interleave: picks one item from each topic bucket in turn.
 * Ensures items from different topics are mixed (anti-fluency-illusion).
 */
export function buildReviewQueue(buckets: TopicBucket[]): ReviewItem[] {
  const filled = buckets.filter((b) => b.items.length > 0);
  if (filled.length === 0) return [];

  const indices = filled.map(() => 0);
  const result: ReviewItem[] = [];

  let remaining = true;
  while (remaining) {
    remaining = false;
    for (let t = 0; t < filled.length; t++) {
      const bucket = filled[t];
      const idx = indices[t];
      if (idx < bucket.items.length) {
        result.push(bucket.items[idx]);
        indices[t]++;
        remaining = true;
      }
    }
  }
  return result;
}

/** Build a ReviewItem for a flashcard. */
export function flashcardItem(topicId: string, fc: Flashcard): ReviewItem {
  return { kind: 'flashcard', topicId, flashcard: fc };
}

/** Build a ReviewItem for an exercise. */
export function exerciseItem(topicId: string, ex: Exercise): ReviewItem {
  return { kind: 'exercise', topicId, exercise: ex };
}
