import { useEffect, useRef, useState } from 'react';

// Lazy singleton mermaid instance, configured once for the dark theme.
let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;

function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        fontFamily: 'Inter, system-ui, sans-serif',
        themeVariables: {
          background: '#1b2e28',
          primaryColor: '#16261f',
          primaryTextColor: '#f2efe6',
          primaryBorderColor: '#ffe08a',
          lineColor: '#7fded1',
          secondaryColor: '#0e1a16',
          tertiaryColor: '#12211d',
        },
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

let diagramSeq = 0;

interface MermaidDiagramRendererProps {
  chart: string;
  caption?: string;
}

// Renders a Mermaid diagram to inline SVG. Falls back to raw source on error.
export function MermaidDiagramRenderer({ chart, caption }: MermaidDiagramRendererProps) {
  const [svg, setSvg] = useState<string>('');
  const [failed, setFailed] = useState(false);
  const idRef = useRef(`mmd-${(diagramSeq += 1)}`);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    getMermaid()
      .then((mermaid) => mermaid.render(idRef.current, chart))
      .then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (failed) {
    return (
      <pre className="rounded-card bg-bg-code p-4 text-xs text-text-muted overflow-x-auto font-mono">
        {chart}
      </pre>
    );
  }

  return (
    <figure className="rounded-card border border-border-subtle bg-bg-card p-4 my-2">
      <div
        className="flex justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
