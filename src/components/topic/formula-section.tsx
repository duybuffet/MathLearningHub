import type { ContentSection } from '@/types/content-schema-types';
import { BlockFormula, InlineFormula } from '@/components/ui/katex-formula';
import { InlineMarkdown } from './inline-markdown';

interface FormulaSectionProps {
  section: ContentSection;
}

/** Renders a `formula` section: title, block math, reading line, symbol table, caption. */
export function FormulaSection({ section }: FormulaSectionProps) {
  const { title, latex, reading, symbols, caption } = section;

  return (
    <div className="space-y-4 rounded-card bg-bg-card px-4 py-5 sm:px-6">
      {title && (
        <h3 className="font-serif text-lg text-text-primary">
          <InlineMarkdown text={title} />
        </h3>
      )}

      {latex && (
        <div className="overflow-x-auto py-2">
          <BlockFormula latex={latex} />
        </div>
      )}

      {reading && (
        <p className="text-[0.975rem] italic text-text-secondary">
          <InlineMarkdown text={reading} />
        </p>
      )}

      {symbols && symbols.length > 0 && (
        <table className="w-full border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="pb-1 pr-4 text-left text-xs font-normal text-text-muted">Ký hiệu</th>
              <th className="pb-1 text-left text-xs font-normal text-text-muted">Ý nghĩa</th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((s, i) => (
              <tr key={i} className="border-b border-border-subtle last:border-0">
                <td className="whitespace-nowrap py-1.5 pr-4 align-top text-accent-orange">
                  <InlineFormula latex={s.sym} />
                </td>
                <td className="py-1.5 text-text-secondary">
                  <InlineMarkdown text={s.meaning} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {caption && (
        <p className="pt-1 font-sans text-xs text-text-muted">
          <InlineMarkdown text={caption} />
        </p>
      )}
    </div>
  );
}
