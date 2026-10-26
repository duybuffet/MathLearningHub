// ── Flashcard View — flip + self-grade ────────────────────────
// Shows front, flips to back on tap, then shows grade buttons.

import { useState } from 'react';
import type { Flashcard } from '@/types/content-schema-types';
import type { Grade } from '@/lib/spaced-repetition-sm2';
import { ProseBlocks } from '@/components/topic/markdown-table';
import { SelfGradeButtons } from '@/components/ui/self-grade-buttons';

interface FlashcardViewProps {
  card: Flashcard;
  onGrade: (grade: Grade) => void;
}

const TYPE_LABEL: Record<string, string> = {
  definition: 'Định nghĩa',
  formula: 'Công thức',
  concept: 'Khái niệm',
};

export function FlashcardView({ card, onGrade }: FlashcardViewProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => !flipped && setFlipped(true)}
        className={[
          'flex min-h-[10rem] w-full flex-col rounded-card bg-bg-card px-5 py-5 text-left transition-colors',
          flipped ? 'cursor-default' : 'cursor-pointer hover:bg-bg-panel',
        ].join(' ')}
        disabled={flipped}
        aria-label={flipped ? 'Mặt sau thẻ' : 'Chạm để lật thẻ'}
      >
        <span className="mb-3 text-xs text-text-muted">{TYPE_LABEL[card.type] ?? card.type}</span>
        <div className="font-serif text-lg text-text-primary">
          <ProseBlocks content={card.front} className="leading-relaxed" />
        </div>
        {flipped ? (
          <div className="mt-4 border-t border-border-subtle pt-4 font-serif leading-relaxed text-text-secondary">
            <ProseBlocks content={card.back} className="leading-relaxed" />
          </div>
        ) : (
          <span className="mt-auto pt-5 text-xs text-text-muted">Nghĩ ra câu trả lời, rồi chạm để lật</span>
        )}
      </button>

      {flipped && <SelfGradeButtons onGrade={onGrade} prompt="Bạn nhớ câu này tới đâu?" />}
    </div>
  );
}
