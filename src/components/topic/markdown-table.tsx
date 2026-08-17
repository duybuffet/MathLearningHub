import { InlineMarkdown } from './inline-markdown';

// Renders GitHub-style Markdown pipe-tables that appear inside prose content.
// A "table block" is a group of consecutive lines each wrapped in `|...|`.

const SEPARATOR_RE = /^\s*\|?[\s:|-]+\|?\s*$/; // e.g. |---|---|

/** True when a \n\n-delimited block is a pipe-table (≥2 rows, every line |...|). */
export function isTableBlock(block: string): boolean {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    lines.length >= 2 &&
    lines.every((l) => l.startsWith('|') && l.endsWith('|'))
  );
}

function parseRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

/** Renders a Markdown pipe-table (first row = header, `---` separator dropped). */
export function MarkdownTable({ source }: { source: string }) {
  const lines = source.split('\n').map((l) => l.trim()).filter(Boolean);
  const rows = lines.filter((l) => !SEPARATOR_RE.test(l)).map(parseRow);
  if (rows.length === 0) return null;
  const [head, ...body] = rows;

  return (
    <div className="overflow-x-auto rounded-btn border border-border-subtle">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((c, i) => (
              <th
                key={i}
                className="bg-bg-panel px-3 py-2 text-center font-semibold text-text-primary whitespace-nowrap border-b border-border-subtle"
              >
                <InlineMarkdown text={c} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri} className="odd:bg-bg-card/40">
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 text-center font-mono text-text-secondary whitespace-nowrap border-t border-border-subtle"
                >
                  <InlineMarkdown text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Splits content on \n\n and renders each block as a table or a paragraph. */
export function ProseBlocks({
  content,
  className = 'text-text-secondary leading-relaxed',
}: {
  content: string;
  className?: string;
}) {
  const blocks = content.split('\n\n').filter(Boolean);
  return (
    <div className="space-y-3">
      {blocks.map((b, i) =>
        isTableBlock(b) ? (
          <MarkdownTable key={i} source={b} />
        ) : (
          <p key={i} className={className}>
            <InlineMarkdown text={b} />
          </p>
        ),
      )}
    </div>
  );
}
