// ── Flashcard Deck — steps through a list of cards ────────────
// Shows progress counter, one card at a time, done state at end.

import { useState } from 'react';
import type { Flashcard } from '@/types/content-schema-types';
import type { Grade } from '@/lib/spaced-repetition-sm2';
import { useSrStore } from '@/store/spaced-repetition-store';
import { FlashcardView } from './flashcard-view';

interface DeckCard {
  topicId: string;
  card: Flashcard;
}

interface FlashcardDeckProps {
  cards: DeckCard[];
  onDone?: () => void;
}

export function FlashcardDeck({ cards, onDone }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0);
  const gradeFlashcard = useSrStore((s) => s.gradeFlashcard);

  if (cards.length === 0) {
    return (
      <p className="text-text-muted text-sm">Không có thẻ nào để ôn.</p>
    );
  }

  if (index >= cards.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <span className="text-3xl" aria-hidden>🎉</span>
        <p className="text-text-primary font-semibold">Xong rồi! (All done)</p>
        <p className="text-text-muted text-sm">
          Bạn đã ôn {cards.length} thẻ.
        </p>
        <button
          onClick={() => {
            setIndex(0);
            onDone?.();
          }}
          className="px-4 py-2 rounded-btn border border-border-subtle text-text-secondary text-sm hover:text-text-primary hover:border-accent-blue/40 transition-colors"
        >
          Ôn lại từ đầu
        </button>
      </div>
    );
  }

  const current = cards[index];

  function handleGrade(grade: Grade) {
    gradeFlashcard(current.card.id, grade);
    setIndex((i) => i + 1);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>
          {index + 1} / {cards.length} thẻ
        </span>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <div
              key={i}
              className={[
                'h-1 w-6 rounded-full transition-colors',
                i < index
                  ? 'bg-accent-blue'
                  : i === index
                    ? 'bg-accent-orange'
                    : 'bg-border-subtle',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      <FlashcardView
        key={current.card.id}
        card={current.card}
        onGrade={handleGrade}
      />
    </div>
  );
}
