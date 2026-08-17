// ── Flashcard View — flip + self-grade ────────────────────────
// Shows front, flips to back on click, then shows grade buttons.

import { useState } from 'react';
import type { Flashcard } from '@/types/content-schema-types';
import type { Grade } from '@/lib/spaced-repetition-sm2';
import { InlineMarkdown } from '@/components/topic/inline-markdown';

interface FlashcardViewProps {
  card: Flashcard;
  onGrade: (grade: Grade) => void;
}

const GRADE_LABELS: { grade: Grade; label: string; className: string }[] = [
  {
    grade: 'again',
    label: 'Chưa nhớ',
    className: 'border-red-500/40 text-red-400 hover:bg-red-500/10',
  },
  {
    grade: 'hard',
    label: 'Khó',
    className: 'border-orange-400/40 text-orange-400 hover:bg-orange-400/10',
  },
  {
    grade: 'good',
    label: 'Được',
    className: 'border-blue-400/40 text-blue-400 hover:bg-blue-400/10',
  },
  {
    grade: 'easy',
    label: 'Dễ',
    className: 'border-green-400/40 text-green-400 hover:bg-green-400/10',
  },
];

const TYPE_BADGE: Record<string, string> = {
  definition: 'Định nghĩa',
  formula: 'Công thức',
  concept: 'Khái niệm',
};

export function FlashcardView({ card, onGrade }: FlashcardViewProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Type badge */}
      <span className="self-start text-xs px-2 py-0.5 rounded-full border border-border-subtle text-text-muted">
        {TYPE_BADGE[card.type] ?? card.type}
      </span>

      {/* Card face */}
      <button
        onClick={() => !flipped && setFlipped(true)}
        className={[
          'w-full min-h-[140px] rounded-xl border p-6 text-left transition-colors duration-150',
          flipped
            ? 'border-accent-blue/30 bg-bg-card cursor-default'
            : 'border-border-subtle bg-bg-card hover:border-accent-blue/40 cursor-pointer',
        ].join(' ')}
        disabled={flipped}
        aria-label={flipped ? 'Mặt sau thẻ' : 'Nhấn để xem mặt sau'}
      >
        <p className="text-xs text-text-muted mb-3 uppercase tracking-wide">
          {flipped ? 'Mặt sau (Back)' : 'Mặt trước (Front)'}
        </p>
        <div className="text-text-primary text-base leading-relaxed">
          <InlineMarkdown text={flipped ? card.back : card.front} />
        </div>
        {!flipped && (
          <p className="mt-4 text-xs text-text-muted">Nhấn để lật thẻ →</p>
        )}
      </button>

      {/* Grade buttons (visible after flip) */}
      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {GRADE_LABELS.map(({ grade, label, className }) => (
            <button
              key={grade}
              onClick={() => onGrade(grade)}
              className={[
                'py-2 px-1 rounded-lg border text-sm font-medium transition-colors duration-150',
                className,
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
