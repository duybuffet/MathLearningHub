// ── Solution Steps View — step-by-step answer reveal ──────────
// Numbered solutionSteps (common-mistake steps highlighted), the final
// answer, the common-mistake note and the related flashcard.

import type { Exercise, SolutionStep } from '@/types/content-schema-types';
import { InlineMarkdown } from '@/components/topic/inline-markdown';
import { ProseBlocks } from '@/components/topic/markdown-table';

interface SolutionStepsViewProps {
  exercise: Exercise;
  relatedFlashcardFront?: string; // front text of relatedFlashcard, if resolved
}

function StepRow({ step, index }: { step: SolutionStep; index: number }) {
  return (
    <li className={`flex gap-3 ${step.isCommonMistake ? '-mx-2 rounded-btn bg-accent-orange/[0.07] px-2 py-2' : ''}`}>
      <span className="w-5 shrink-0 pt-px text-right text-sm tabular-nums text-text-muted">{index + 1}</span>
      <div className="min-w-0 flex-1 space-y-1">
        {step.isCommonMistake && <span className="block text-xs font-medium text-accent-orange">Chỗ hay sai</span>}
        <ProseBlocks content={step.text} className="text-[0.9375rem] leading-relaxed text-text-secondary" />
        {step.rule && (
          <p className="text-xs text-accent-blue">
            <InlineMarkdown text={step.rule} />
          </p>
        )}
      </div>
    </li>
  );
}

export function SolutionStepsView({ exercise, relatedFlashcardFront }: SolutionStepsViewProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-border-subtle pt-4">
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {exercise.solutionSteps.map((step, i) => (
          <StepRow key={i} step={step} index={i} />
        ))}
      </ol>

      <div className="border-t border-border-subtle pt-4 text-text-primary">
        <span className="mb-1 block text-sm font-medium text-accent-green">Đáp án</span>
        <ProseBlocks content={exercise.answer} className="leading-relaxed" />
      </div>

      {exercise.commonMistake && (
        <p className="border-l-2 border-accent-orange pl-4 text-sm leading-relaxed text-text-secondary">
          <span className="mb-0.5 block text-xs font-medium text-accent-orange">Lỗi hay gặp</span>
          <InlineMarkdown text={exercise.commonMistake} />
        </p>
      )}

      {relatedFlashcardFront && (
        <p className="text-sm text-text-muted">
          Thẻ liên quan: <InlineMarkdown text={relatedFlashcardFront} />
        </p>
      )}
    </div>
  );
}
