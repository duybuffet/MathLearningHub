import type { ContentSection, CalloutVariant } from '@/types/content-schema-types';
import { MermaidDiagramRenderer } from '@/components/ui/mermaid-diagram-renderer';
import { FormulaSection } from './formula-section';
import { GraphSection } from './graph-section';
import { WorkedExampleSection } from './worked-example-section';
import { InlineMarkdown } from './inline-markdown';
import { ProseBlocks } from './markdown-table';

const CALLOUT_STYLES: Record<CalloutVariant, { border: string; bg: string; text: string; icon: string }> = {
  tip: { border: 'border-accent-green', bg: 'bg-accent-green/10', text: 'text-accent-green', icon: '💡' },
  info: { border: 'border-accent-blue', bg: 'bg-accent-blue/10', text: 'text-accent-blue', icon: 'ℹ️' },
  warning: { border: 'border-accent-orange', bg: 'bg-accent-orange/10', text: 'text-accent-orange', icon: '⚠️' },
};

interface SectionContentRendererProps {
  sections: ContentSection[];
}

/** Maps each section type to the appropriate renderer. */
export function SectionContentRenderer({ sections }: SectionContentRendererProps) {
  if (sections.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
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
        <h2 className="text-xl font-semibold text-text-primary mb-3">
          <InlineMarkdown text={section.title} />
        </h2>
      )}
      <ProseBlocks content={section.content ?? ''} />
    </div>
  );
}

function AnalogyCard({ section }: { section: ContentSection }) {
  return (
    <div className="rounded-card border border-accent-purple/40 bg-accent-purple/10 p-5">
      {section.title && (
        <h3 className="text-base font-semibold text-accent-purple mb-2 flex items-center gap-2">
          <span aria-hidden="true">🧠</span>
          <InlineMarkdown text={section.title} />
        </h3>
      )}
      <ProseBlocks
        content={section.content ?? ''}
        className="text-text-secondary leading-relaxed text-sm"
      />
    </div>
  );
}

function CalloutBox({ section }: { section: ContentSection }) {
  const variant = section.variant ?? 'info';
  const styles = CALLOUT_STYLES[variant];
  return (
    <div className={`rounded-card border-l-4 ${styles.border} ${styles.bg} p-4`}>
      {section.title && (
        <p className={`text-sm font-semibold ${styles.text} mb-1 flex items-center gap-2`}>
          <span aria-hidden="true">{styles.icon}</span>
          <InlineMarkdown text={section.title} />
        </p>
      )}
      {!section.title && (
        <span className="text-lg mr-2" aria-hidden="true">{styles.icon}</span>
      )}
      <ProseBlocks
        content={section.content ?? ''}
        className="text-text-secondary text-sm leading-relaxed"
      />
    </div>
  );
}

function KeyTakeaways({ section }: { section: ContentSection }) {
  return (
    <div>
      {section.title && (
        <h2 className="text-xl font-semibold text-text-primary mb-3">
          <InlineMarkdown text={section.title} />
        </h2>
      )}
      <ul className="space-y-2">
        {(section.items ?? []).map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed">
            <span className="mt-0.5 text-accent-green shrink-0" aria-hidden="true">✓</span>
            <span><InlineMarkdown text={item} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
