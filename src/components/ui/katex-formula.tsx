import { BlockMath, InlineMath } from 'react-katex';

// react-katex v3: props are math, errorColor, renderError.
// throwOnError is controlled by renderError presence (if provided, errors don't throw).

function ErrorFallback({ latex }: { latex: string }) {
  return (
    <span className="font-mono text-red-400 text-sm break-all" title="KaTeX parse error">
      {latex}
    </span>
  );
}

interface BlockFormulaProps {
  latex: string;
  className?: string;
}

/** Renders a display-mode (block) KaTeX formula. Falls back to mono span on parse error. */
export function BlockFormula({ latex, className }: BlockFormulaProps) {
  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
      <BlockMath
        math={latex}
        errorColor="#f87171"
        renderError={(err) => <ErrorFallback latex={`${latex} [${err.message}]`} />}
      />
    </div>
  );
}

interface InlineFormulaProps {
  latex: string;
}

/** Renders an inline KaTeX formula. Falls back to mono span on parse error. */
export function InlineFormula({ latex }: InlineFormulaProps) {
  return (
    <InlineMath
      math={latex}
      errorColor="#f87171"
      renderError={() => <ErrorFallback latex={latex} />}
    />
  );
}
