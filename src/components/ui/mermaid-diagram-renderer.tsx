import { useEffect, useRef, useState } from 'react';
import { InlineMarkdown } from '@/components/topic/inline-markdown';

// Lazy singleton mermaid instance, configured once for the dark theme.
let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;

function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        fontFamily: '"Be Vietnam Pro", system-ui, sans-serif',
        themeVariables: {
          background: '#1a2d28',
          primaryColor: '#1d322c',
          primaryTextColor: '#eee9dd',
          primaryBorderColor: '#f0d58c',
          lineColor: '#8fd3c5',
          secondaryColor: '#0f1c18',
          tertiaryColor: '#142420',
          clusterBkg: '#142420',
          clusterBorder: '#7f938a',
          edgeLabelBackground: '#1a2d28',
          nodeTextColor: '#eee9dd',
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
  const boxRef = useRef<HTMLDivElement>(null);

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

  // Wide diagrams would shrink to unreadable text on phones: keep them at
  // ≥80% of natural size and let the box scroll horizontally instead.
  useEffect(() => {
    const box = boxRef.current;
    const el = box?.querySelector('svg');
    if (!box || !el) return;
    const natural = el.viewBox.baseVal?.width || 0;
    const minWidth = Math.round(natural * 0.8);
    if (minWidth > box.clientWidth) {
      el.style.maxWidth = 'none';
      el.style.width = `${minWidth}px`;
    }
  }, [svg]);

  if (failed) {
    return (
      <pre className="rounded-card bg-bg-code p-4 text-xs text-text-muted overflow-x-auto font-mono">
        {chart}
      </pre>
    );
  }

  return (
    <figure className="rounded-card bg-bg-card px-3 py-4 font-sans">
      <div
        ref={boxRef}
        className="overflow-x-auto [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-text-muted">
          <InlineMarkdown text={caption} />
        </figcaption>
      )}
    </figure>
  );
}
