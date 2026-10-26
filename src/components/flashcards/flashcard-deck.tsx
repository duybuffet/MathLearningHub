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
      <div className="flex flex-col items-start gap-3 rounded-card bg-bg-card px-5 py-5">
        <p className="text-text-primary">Đã ôn hết {cards.length} thẻ.</p>
        <p className="text-sm text-text-muted">Các thẻ sẽ quay lại trong mục Ôn tập khi đến hạn.</p>
        <button
          onClick={() => {
            setIndex(0);
            onDone?.();
          }}
          className="rounded-btn bg-bg-panel px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
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
    <div className="flex flex-col gap-3">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span className="tabular-nums">
          Thẻ {index + 1}/{cards.length}
        </span>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-bg-card">
          <div
            className="h-full rounded-full bg-accent-orange transition-[width] duration-300"
            style={{ width: `${(index / cards.length) * 100}%` }}
          />
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
