import type { ContentSection } from '@/types/content-schema-types';
import { InlineMarkdown } from './inline-markdown';

interface WorkedExampleSectionProps {
  section: ContentSection;
}

/** Renders a `worked_example` section: problem → numbered steps → result. */
export function WorkedExampleSection({ section }: WorkedExampleSectionProps) {
  const { title, problem, steps, result } = section;

  return (
    <div className="rounded-card border border-accent-green/30 bg-accent-green/5 p-5 space-y-4">
      {title && (
        <h3 className="text-base font-semibold text-text-primary">
          <InlineMarkdown text={title} />
        </h3>
      )}

      {problem && (
        <div className="rounded-btn bg-bg-panel border border-border-subtle px-4 py-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-1">
            Bài toán
          </span>
          <p className="text-text-primary leading-relaxed">
            <InlineMarkdown text={problem} />
          </p>
        </div>
      )}

      {steps && steps.length > 0 && (
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li
              key={i}
              className={`
                flex gap-3 rounded-btn px-3 py-2.5 border
                ${step.isCommonMistake
                  ? 'border-amber-500/40 bg-amber-500/10 border-l-4 border-l-amber-500'
                  : 'border-border-subtle/40 bg-bg-panel/50'}
              `}
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent-green/20 text-accent-green text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.isCommonMistake && (
                    <span className="mr-1" aria-label="Lỗi hay gặp">⚠️</span>
                  )}
                  <InlineMarkdown text={step.text} />
                </p>
                {step.rule && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue font-medium">
                    <InlineMarkdown text={step.rule} />
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {result && (
        <div className="flex items-start gap-2 rounded-btn border border-accent-green/40 bg-accent-green/10 px-4 py-3">
          <span className="text-accent-green text-base mt-0.5" aria-hidden="true">✅</span>
          <p className="text-text-primary font-semibold">
            <InlineMarkdown text={result} />
          </p>
        </div>
      )}
    </div>
  );
}
