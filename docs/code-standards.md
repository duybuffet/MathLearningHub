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
- Inline: `**bold**`, `` `code` ``, and inline math `$...$` (KaTeX). Remember JSON needs `\\`
  for a LaTeX backslash.
- **Markdown pipe-tables** ARE rendered (great for tables of values, e.g. limits `x → c`).
  Separate the table from surrounding prose with a blank line (`\n\n`); each row wrapped in
  `| ... |`; include a `|---|` separator row. Cells support inline math.

## Safety

- KaTeX rendered with `throwOnError: false`, `trust: false`.
- Mermaid `securityLevel: 'strict'`.
