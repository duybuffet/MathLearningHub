import type { ContentSection, CalloutVariant } from '@/types/content-schema-types';
import { MermaidDiagramRenderer } from '@/components/ui/mermaid-diagram-renderer';
import { FormulaSection } from './formula-section';
import { GraphSection } from './graph-section';
import { WorkedExampleSection } from './worked-example-section';
import { InlineMarkdown } from './inline-markdown';
import { ProseBlocks } from './markdown-table';

const CALLOUT_STYLES: Record<CalloutVariant, { border: string; text: string; label: string }> = {
  tip: { border: 'border-accent-green', text: 'text-accent-green', label: 'Mẹo' },
  info: { border: 'border-accent-blue', text: 'text-accent-blue', label: 'Ghi chú' },
  warning: { border: 'border-accent-orange', text: 'text-accent-orange', label: 'Cẩn thận' },
};

interface SectionContentRendererProps {
  sections: ContentSection[];
}

/** Maps each section type to the appropriate renderer. */
export function SectionContentRenderer({ sections }: SectionContentRendererProps) {
  if (sections.length === 0) return null;

  return (
    <div className="prose-reading space-y-8">
      {sections.map((section, i) => (
        <SectionBlock key={i} section={section} />
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: ContentSection }) {
  switch (section.type) {
    case 'intro':
    case 'explanation':
      return <ProseBlock section={section} />;

    case 'analogy':
      return <AnalogyCard section={section} />;

    case 'callout':
      return <CalloutBox section={section} />;

    case 'key_takeaways':
      return <KeyTakeaways section={section} />;

    case 'diagram':
      return section.mermaid ? (
        <MermaidDiagramRenderer chart={section.mermaid} caption={section.caption} />
      ) : null;

    case 'formula':
      return <FormulaSection section={section} />;

    case 'graph':
      return <GraphSection section={section} />;

    case 'worked_example':
      return <WorkedExampleSection section={section} />;

    default:
      return null;
  }
}

function ProseBlock({ section }: { section: ContentSection }) {
  return (
    <div>
      {section.title && (
        <h2 className="mb-3 mt-12 font-serif text-2xl leading-snug text-text-primary">
          <InlineMarkdown text={section.title} />
        </h2>
      )}
      <ProseBlocks content={section.content ?? ''} />
    </div>
  );
}

function AnalogyCard({ section }: { section: ContentSection }) {
  return (
    <aside className="border-l-2 border-accent-purple/70 pl-5">
      {section.title && (
        <p className="mb-2 font-sans text-sm font-medium text-accent-purple">
          <InlineMarkdown text={section.title} />
        </p>
      )}
      <ProseBlocks content={section.content ?? ''} />
    </aside>
  );
}

function CalloutBox({ section }: { section: ContentSection }) {
  const styles = CALLOUT_STYLES[section.variant ?? 'info'];
  return (
    <aside className={`rounded-r-card border-l-2 ${styles.border} bg-bg-card px-5 py-4`}>
      <p className={`mb-1.5 font-sans text-sm font-medium ${styles.text}`}>
        {section.title ? <InlineMarkdown text={section.title} /> : styles.label}
      </p>
      <ProseBlocks content={section.content ?? ''} className="text-[0.975rem] leading-relaxed text-text-secondary" />
    </aside>
  );
}

function KeyTakeaways({ section }: { section: ContentSection }) {
  return (
    <div className="rounded-card bg-bg-card px-5 py-5">
      <h2 className="mb-3 font-serif text-xl text-text-primary">
        {section.title ? <InlineMarkdown text={section.title} /> : 'Cần nhớ'}
      </h2>
      <ul className="space-y-2.5">
        {(section.items ?? []).map((item, i) => (
          <li key={i} className="flex gap-3 leading-relaxed text-text-secondary">
            <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" aria-hidden="true" />
            <span>
              <InlineMarkdown text={item} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
