import { InlineMath } from 'react-katex';

// Splits text by **bold**, `code`, and $inline math$ tokens.
// Used throughout section renderers for math-aware prose.
const TOKEN_RE = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$)/g;

interface InlineMarkdownProps {
  text: string;
}

function renderToken(token: string, idx: number): React.ReactNode {
  if (token.startsWith('**') && token.endsWith('**')) {
    return (
      <strong key={idx} className="text-text-primary font-semibold">
        {token.slice(2, -2)}
      </strong>
    );
  }
  if (token.startsWith('`') && token.endsWith('`')) {
    return (
      <code
        key={idx}
        className="font-mono text-accent-blue bg-bg-code px-1 py-0.5 rounded text-[0.9em]"
      >
        {token.slice(1, -1)}
      </code>
    );
  }
  if (token.startsWith('$') && token.endsWith('$')) {
    const latex = token.slice(1, -1);
    try {
      return <InlineMath key={idx} math={latex} />;
    } catch {
      return <span key={idx} className="font-mono text-text-muted">{token}</span>;
    }
  }
  return <span key={idx}>{token}</span>;
}

/** Renders a single line of markdown-lite with bold, code, and $inline math$. */
export function InlineMarkdown({ text }: InlineMarkdownProps) {
  const parts = text.split(TOKEN_RE).filter(Boolean);
  return <>{parts.map((p, i) => renderToken(p, i))}</>;
}

/** Splits content on \n\n into paragraphs and renders each through InlineMarkdown. */
export function ParagraphBlock({
  content,
  className = 'text-text-secondary leading-relaxed',
}: {
  content: string;
  className?: string;
}) {
  const paragraphs = content.split('\n\n').filter(Boolean);
  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => (
        <p key={i} className={className}>
          <InlineMarkdown text={p} />
        </p>
      ))}
    </div>
  );
}
