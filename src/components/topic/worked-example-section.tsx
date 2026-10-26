import type { ContentSection } from '@/types/content-schema-types';
import { InlineMarkdown } from './inline-markdown';
import { ProseBlocks } from './markdown-table';

interface WorkedExampleSectionProps {
  section: ContentSection;
}

/** Renders a `worked_example` section: problem → numbered steps → result. */
export function WorkedExampleSection({ section }: WorkedExampleSectionProps) {
  const { title, problem, steps, result } = section;

  return (
    <div className="space-y-4 rounded-card bg-bg-card px-4 py-5 sm:px-6">
      <p className="font-sans text-sm font-medium text-accent-green">Ví dụ giải từng bước</p>
      {title && (
        <h3 className="-mt-2 font-serif text-lg text-text-primary">
          <InlineMarkdown text={title} />
        </h3>
      )}

      {problem && (
        <ProseBlocks content={problem} className="leading-relaxed text-text-primary" />
      )}

      {steps && steps.length > 0 && (
        <ol className="space-y-3 border-t border-border-subtle pt-4">
          {steps.map((step, i) => (
            <li
              key={i}
              className={`flex gap-3 ${step.isCommonMistake ? '-mx-2 rounded-btn bg-accent-orange/[0.07] px-2 py-2' : ''}`}
            >
              <span className="w-5 shrink-0 pt-px text-right font-sans text-sm tabular-nums text-text-muted">{i + 1}</span>
              <div className="min-w-0 flex-1 space-y-1">
                {step.isCommonMistake && (
                  <span className="block font-sans text-xs font-medium text-accent-orange">Chỗ hay sai</span>
                )}
                <ProseBlocks content={step.text} className="leading-relaxed text-text-secondary" />
                {step.rule && (
                  <p className="font-sans text-xs text-accent-blue">
                    <InlineMarkdown text={step.rule} />
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {result && (
        <p className="border-t border-border-subtle pt-4 text-text-primary">
          <span className="mr-2 font-sans text-sm font-medium text-accent-green">Kết quả</span>
          <InlineMarkdown text={result} />
        </p>
      )}
    </div>
  );
}
