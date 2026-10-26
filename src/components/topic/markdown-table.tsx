import { InlineMarkdown } from './inline-markdown';

// Renders prose blocks that may contain GitHub-style Markdown: pipe-tables,
// ordered/unordered lists, and paragraphs. Used by every prose section.

const SEPARATOR_RE = /^\s*\|?[\s:|-]+\|?\s*$/; // table separator: |---|---|
const LIST_RE = /^\s*(\d+[.)]|[-*])\s+(.*)$/; // "1. x" | "1) x" | "- x" | "* x"

/** True when a \n\n-delimited block is a pipe-table (≥2 rows, every line |...|). */
export function isTableBlock(block: string): boolean {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.length >= 2 && lines.every((l) => l.startsWith('|') && l.endsWith('|'));
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

/** Renders a run of Markdown list lines as <ol> or <ul>. */
function MarkdownList({ lines }: { lines: string[] }) {
  const ordered = /^\s*\d/.test(lines[0]);
  const items = lines.map((l) => l.replace(LIST_RE, '$2'));
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      className={`ml-5 space-y-1.5 ${ordered ? 'list-decimal' : 'list-disc'} text-text-secondary`}
    >
      {items.map((it, i) => (
        <li key={i} className="pl-1 leading-relaxed marker:text-text-muted">
          <InlineMarkdown text={it} />
        </li>
      ))}
    </Tag>
  );
}

type Segment = { type: 'list'; lines: string[] } | { type: 'p'; text: string };

/** Splits one block into list-runs + paragraph-runs (handles intro-line + list). */
function segmentBlock(block: string): Segment[] {
  const segs: Segment[] = [];
  for (const raw of block.split('\n')) {
    const isList = LIST_RE.test(raw);
    const last = segs[segs.length - 1];
    if (isList) {
      if (last && last.type === 'list') last.lines.push(raw);
      else segs.push({ type: 'list', lines: [raw] });
    } else {
      if (raw.trim() === '') continue;
      if (last && last.type === 'p') last.text += ' ' + raw.trim();
      else segs.push({ type: 'p', text: raw.trim() });
    }
  }
  return segs;
}

const FENCE_RE = /```[\w-]*\n?([\s\S]*?)```/g;

/** Splits content into ``` fenced code (kept whole) and \n\n-separated prose blocks. */
function splitBlocks(content: string): { code?: string; text?: string }[] {
  const out: { code?: string; text?: string }[] = [];
  let last = 0;
  for (const m of content.matchAll(FENCE_RE)) {
    const before = content.slice(last, m.index);
    before.split('\n\n').filter((b) => b.trim()).forEach((text) => out.push({ text }));
    out.push({ code: m[1].replace(/\n$/, '') });
    last = (m.index ?? 0) + m[0].length;
  }
  content.slice(last).split('\n\n').filter((b) => b.trim()).forEach((text) => out.push({ text }));
  return out;
}

/** Renders prose: fenced code, tables, lists and paragraphs (blocks separated by \n\n). */
export function ProseBlocks({
  content,
  className = 'text-text-secondary leading-relaxed',
}: {
  content: string;
  className?: string;
}) {
  const blocks = splitBlocks(content);
  return (
    <div className="space-y-3">
      {blocks.map(({ code, text }, i) => {
        if (code !== undefined) {
          return (
            <pre key={i} className="overflow-x-auto rounded-btn bg-bg-code px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-text-secondary">
              <code>{code}</code>
            </pre>
          );
        }
        const b = text as string;
        if (isTableBlock(b)) return <MarkdownTable key={i} source={b} />;
        return segmentBlock(b).map((seg, k) =>
          seg.type === 'list' ? (
            <MarkdownList key={`${i}-${k}`} lines={seg.lines} />
          ) : (
            // $$display math$$ renders a block element, which can't live inside <p>.
            seg.text.includes('$$') ? (
              <div key={`${i}-${k}`} className={className}>
                <InlineMarkdown text={seg.text} />
              </div>
            ) : (
              <p key={`${i}-${k}`} className={className}>
                <InlineMarkdown text={seg.text} />
              </p>
            )
          ),
        );
      })}
    </div>
  );
}
