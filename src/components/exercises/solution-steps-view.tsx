// ── Solution Steps View — step-by-step answer reveal ──────────
// Renders numbered solutionSteps with ⚠️ on isCommonMistake steps,
// then the ✅ final answer and optional commonMistake callout.

import type { Exercise, SolutionStep } from '@/types/content-schema-types';
import { InlineMarkdown } from '@/components/topic/inline-markdown';

interface SolutionStepsViewProps {
  exercise: Exercise;
  relatedFlashcardFront?: string; // front text of relatedFlashcard, if resolved
}

function StepRow({ step, index }: { step: SolutionStep; index: number }) {
  const isMistake = step.isCommonMistake;
  return (
    <li
      className={[
        'flex gap-3 p-3 rounded-lg border',
        isMistake
          ? 'border-amber-500/30 bg-amber-500/5'
          : 'border-border-subtle bg-bg-primary',
      ].join(' ')}
    >
      <span
        className={[
          'flex-shrink-0 w-6 h-6 rounded-full text-xs flex items-center justify-center font-semibold',
          isMistake ? 'bg-amber-500/20 text-amber-400' : 'bg-bg-card text-text-muted',
        ].join(' ')}
      >
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isMistake && (
            <span className="mr-1" aria-label="Lỗi hay gặp">
              ⚠️
            </span>
          )}
          <InlineMarkdown text={step.text} />
        </p>
        {step.rule && (
          <span className="mt-1 inline-block text-xs text-text-muted px-2 py-0.5 rounded border border-border-subtle">
            {step.rule}
          </span>
        )}
      </div>
    </li>
  );
}

export function SolutionStepsView({
  exercise,
  relatedFlashcardFront,
}: SolutionStepsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Steps */}
      <ol className="flex flex-col gap-2 list-none p-0 m-0">
        {exercise.solutionSteps.map((step, i) => (
          <StepRow key={i} step={step} index={i} />
        ))}
      </ol>

      {/* Final answer */}
      <div className="flex items-start gap-2 p-3 rounded-lg border border-green-500/30 bg-green-500/5">
        <span aria-label="Đáp án đúng">✅</span>
        <div className="text-sm text-green-300">
          <span className="font-semibold mr-1">Đáp án (Answer):</span>
          <InlineMarkdown text={exercise.answer} />
        </div>
      </div>

      {/* Common mistake callout */}
      {exercise.commonMistake && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
          <span aria-label="Lỗi hay gặp">⚠️</span>
          <div className="text-sm text-amber-300">
            <span className="font-semibold mr-1">Lỗi hay gặp (Common mistake):</span>
            <InlineMarkdown text={exercise.commonMistake} />
          </div>
        </div>
      )}

      {/* Related flashcard link */}
      {relatedFlashcardFront && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-blue-400/20 bg-blue-400/5 text-sm text-blue-300">
          <span aria-hidden>🃏</span>
          <div>
            <span className="font-semibold">Thẻ liên quan (Related flashcard): </span>
            <InlineMarkdown text={relatedFlashcardFront} />
          </div>
        </div>
      )}
    </div>
  );
}
