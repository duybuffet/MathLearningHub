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
    <div className="rounded-card border border-accent-blue/30 bg-accent-blue/5 p-5 space-y-4">
      {title && (
        <h3 className="text-base font-semibold text-text-primary">
          <InlineMarkdown text={title} />
        </h3>
      )}

      {latex && (
        <div className="overflow-x-auto py-2">
          <BlockFormula latex={latex} />
        </div>
      )}

      {reading && (
        <p className="text-text-muted text-sm italic">
          <InlineMarkdown text={reading} />
        </p>
      )}

      {symbols && symbols.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left text-text-muted font-medium pb-1 pr-4 w-16">Ký hiệu</th>
              <th className="text-left text-text-muted font-medium pb-1">Ý nghĩa</th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((s, i) => (
              <tr key={i} className="border-b border-border-subtle/40 last:border-0">
                <td className="py-1.5 pr-4 font-mono text-accent-orange">
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
        <p className="text-xs text-text-muted text-center pt-1">
          <InlineMarkdown text={caption} />
        </p>
      )}
    </div>
  );
}
