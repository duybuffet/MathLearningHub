import { useEffect, useRef, useState } from 'react';
import type { ContentSection } from '@/types/content-schema-types';
import { InlineMarkdown } from './inline-markdown';

interface GraphSectionProps {
  section: ContentSection;
}

/** Lazily renders an interactive function-plot graph. Gracefully falls back on error. */
export function GraphSection({ section }: GraphSectionProps) {
  const { title, functions: fns, xDomain, yDomain, caption } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !fns || fns.length === 0) return;

    let cancelled = false;

    // Lazy-import function-plot so it never runs during SSR/build-time.
    import('function-plot')
      .then(({ default: functionPlot }) => {
        if (cancelled || !containerRef.current) return;

        const width = containerRef.current.clientWidth || 480;
        const height = Math.round(width * 0.55);

        // Clear any previous render
        containerRef.current.innerHTML = '';

        functionPlot({
          target: containerRef.current,
          width,
          height,
          xAxis: xDomain ? { domain: xDomain } : undefined,
          yAxis: yDomain ? { domain: yDomain } : undefined,
          grid: true,
          data: fns.map((f) => ({
            fn: f.fn,
            color: f.color,
            graphType: (f.graphType as 'polyline' | 'scatter') ?? 'polyline',
          })),
        });

        setReady(true);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Graph failed to load';
          setError(msg);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!fns || fns.length === 0) return null;

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-base font-semibold text-text-primary">
          <InlineMarkdown text={title} />
        </h3>
      )}

      {error ? (
        <div className="rounded-card border border-border-subtle bg-bg-card p-4 text-center">
          <p className="text-text-muted text-sm">
            ⚠️ Không thể tải đồ thị — hãy thử tải lại trang.
          </p>
          <p className="text-text-muted text-xs mt-1 font-mono">{error}</p>
        </div>
      ) : (
        <div
          className={`
            rounded-card border border-border-subtle bg-bg-card overflow-hidden
            ${!ready ? 'min-h-[240px] flex items-center justify-center' : ''}
          `}
        >
          {!ready && (
            <p className="text-text-muted text-sm animate-pulse">Đang tải đồ thị…</p>
          )}
          {/* function-plot renders into this div */}
          <div ref={containerRef} className="w-full" />
        </div>
      )}

      {caption && (
        <p className="text-xs text-text-muted text-center">
          <InlineMarkdown text={caption} />
        </p>
      )}
    </div>
  );
}
