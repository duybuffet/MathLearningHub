# Project Changelog — Math Learning Hub

## [Unreleased]

### Phase 6 — Content authoring: Areas 3-7 complete (2026-08-17)
- Authored all remaining 21 topics → 30/30 total across 7 areas:
  - Area 3 Đại số tuyến tính (5): vectors, matrices-operations, matrix-multiplication, determinant-inverse, linear-systems.
  - Area 4 Toán rời rạc (5): propositional-logic, sets-relations-functions, induction, combinatorics, recurrences.
  - Area 5 Xác suất & Thống kê (4): basic-probability, random-variables, expectation-variance, bayes-theorem.
  - Area 6 Đồ thị (3): graph-basics, graph-traversal, trees.
  - Area 7 Toán cho Thuật toán (4): big-o-asymptotics, recurrences-master-theorem, modular-arithmetic, gcd-primes.
- Integrated all `file` fields into curriculum.json; full build green (2720 modules).
- Fixed flagged birthday-paradox graph expression to a cleaner form.

### Phase 6 — Content authoring: Area 2 + render fix (2026-08-17)
- Authored all 4 topics of Area 2 (Giải tích nhẹ): limits, continuity, derivatives, integrals-basics.
- Fix: graph section `title`/`caption` and analogy/callout titles now render inline math (`$...$`) via InlineMarkdown (previously showed raw `$x^2$` text).
- Fix: replaced two function-plot expressions the parser can't handle — continuity step `x<0?-1:1` → `sign(x)`; removed integrals broken NaN-shading function.
- Feature/fix: prose now renders Markdown pipe-tables (new markdown-table.tsx + ProseBlocks); previously a table-of-values collapsed into an unreadable run-on `<p>`. All prose paths (intro/explanation/analogy/callout) + section titles now table- and math-aware.

### Phase 6 — Content authoring: Area 1 (2026-08-17)
- Authored all 5 topics of Area 1 (Đại số & Hàm số): powers-and-roots, linear-quadratic-functions, reading-graphs, logarithms, exponential-log-functions.
- Fixed learning order: functions + reading-graphs now precede logarithms (logarithm lesson depends on graph reading).

### Theming — Chalkboard theme (2026-08-17)
- Replaced cs-hub-inherited palette with a distinct "Chalkboard" theme: dark chalkboard-green surface, warm chalk-white text, pastel chalk accents. Updated index.css tokens, favicon, and mermaid diagram theme variables.


### Phase 1 — Project scaffold (2026-08-17)
- Initialized React 18 + Vite + TS + Tailwind project mirroring cs-learning-hub.
- Added deps: katex + react-katex (formulas), function-plot (interactive graphs).
- Configured: vite/tailwind/tsconfig/postcss, dark-theme tokens, routing shell.
- Seeded `./docs` (architecture, code standards, roadmap, changelog).
