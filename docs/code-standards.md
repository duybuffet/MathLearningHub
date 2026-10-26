# Code Standards — Math Learning Hub

## Files & structure

- kebab-case filenames, meaningful + self-descriptive (readable via Grep alone).
- Each code file < 200 lines. Split large components/modules; SR engine is its own module.
- Directory layout mirrors cs-hub: `src/{components/{home,layout,topic,ui},content,hooks,lib,pages,store,types}`.
- Import alias `@/*` → `src/*`.

## Principles

- YAGNI / KISS / DRY. Interactive graphs only where they add value; else static/mermaid.
- TypeScript strict; no unused locals/params; type all content shapes in `types/`.

## Content authoring

- Intuition-first, NOT proof-heavy.
- Bilingual terms: Vietnamese labels/content, English CS/math term in parens on first use,
  e.g. "Giới hạn (limit)", "Độ phức tạp (Big-O)".
- Topic `id` convention: `area{N}_{slug}`.
- Every exercise answer = numbered steps, each step states the rule used; mark the
  common-mistake step with ⚠️; link related flashcard + CS relevance.

## Prose formatting (what the renderer supports)

Inside any `content` / `caption` / `title` string:
- Inline: `**bold**`, `*italic*`, `` `code` ``, inline math `$...$` and display math `$$...$$`
  (KaTeX). Remember JSON needs `\\` for a LaTeX backslash.
- Lists: lines starting with `- ` or `1. ` render as `<ul>/<ol>`.
- Never put Vietnamese or other non-Latin glyphs (—, ≈, →) inside math — KaTeX fonts lack them.
  Use `\approx`, `\to`, English `\text{}`. No literal `$` for currency; no stray single `*`.
- **Markdown pipe-tables** ARE rendered (great for tables of values, e.g. limits `x → c`).
  Separate the table from surrounding prose with a blank line (`\n\n`); each row wrapped in
  `| ... |`; include a `|---|` separator row. Cells support inline math.

## Validation

Run `npm run validate:content` after editing any topic JSON. It checks schema shape, parses every
formula with KaTeX (strict), flags Vietnamese inside math / mis-paired `$`, quiz `correct` range,
duplicate ids/options and `relatedFlashcard` links.

## Safety

- KaTeX rendered with `throwOnError: false`, `trust: false`.
- Mermaid `securityLevel: 'strict'`.
