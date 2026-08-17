# Phase 03 — Section Renderers + Topic Page + Quiz

## Context links
- Plan: [plan.md](./plan.md) · Prev: [phase-02](./phase-02-content-schema-and-loader.md)
- Ref: `cs-learning-hub/src/components/topic/deep-dive-content-renderer.tsx`, `.../topic-page.tsx`, `.../quiz-section.tsx`, `.../ui/mermaid-diagram-renderer.tsx`

## Overview
- Date: 2026-08-17 · Priority: P1 · Status: pending · Review: not reviewed
- Description: Port cs-hub content renderer + topic page + quiz; ADD three math section renderers (formula/graph/worked_example) as separate < 200-line components. Topic page renders every section type in order, then quiz (exercises/flashcards wired in P4).

## Key Insights
- cs-hub renderer is a `switch` over `section.type` + `InlineMarkdown` helper — reuse both; just add cases.
- Keep each new renderer its own file (file-size rule + lazy-load function-plot).
- KaTeX render trusted strings only: `throwOnError:false`, `trust:false`; render inline math inside prose via a small `<Katex/>` wrapper so `InlineMarkdown` can pick up `$...$` if desired (KISS: block-level formula section first; inline `$...$` optional).

## Requirements
Functional: given a `MathTopic`, page shows header, view-mode toggle, all sections (prose, analogy, diagram(mermaid), code, callout, key_takeaways, **formula**, **graph**, **worked_example**), quiz with scoring; `markRead` via IntersectionObserver; "Coming Soon" when no file.
Non-functional: formulas legible mobile+desktop; graph responsive + touch-draggable; each file < 200 lines; lazy-load function-plot + mermaid.

## Architecture
- Renderer registry: extend `deep-dive-content-renderer.tsx` switch with 3 new cases → delegate to child components (renderer stays lean).
- `formula-block-renderer.tsx`: KaTeX block + "đọc là…" line + symbol legend list.
- `interactive-function-graph.tsx`: lazy `function-plot`; optional param sliders (framer-motion optional); ResizeObserver for responsive; static fallback text if init fails.
- `worked-example-block.tsx`: prompt, numbered steps (KaTeX-aware), `⚠️` marker on common-mistake step, ✅ result.
- `katex-formula.tsx`: thin `react-katex`/`katex` wrapper (block + inline), safe options.
- Topic page: mirror cs-hub structure; add slots (placeholders) for Flashcards + Exercises sections (populated P4).
- Quiz: port `quiz-section.tsx` + `quiz-question-card.tsx` + `quiz-result-summary.tsx` verbatim (QuizQuestion shape unchanged).

## Related code files
Create:
- `.../src/components/topic/deep-dive-content-renderer.tsx` (ported + 3 cases)
- `.../src/components/topic/formula-block-renderer.tsx`
- `.../src/components/topic/interactive-function-graph.tsx`
- `.../src/components/topic/worked-example-block.tsx`
- `.../src/components/ui/katex-formula.tsx`
- `.../src/components/ui/mermaid-diagram-renderer.tsx` (port verbatim)
- `.../src/components/topic/quiz-section.tsx`, `.../quiz-question-card.tsx`, `.../quiz-result-summary.tsx` (port)
- `.../src/components/topic/topic-page-header.tsx`, `.../view-mode-toggle.tsx` (port)
- `.../src/components/ui/syntax-highlighted-code-block.tsx` (port; shiki)
- `.../src/pages/topic-page.tsx` (port + extend)
- `.../src/hooks/use-topic-progress.ts` (port)
Modify: `.../src/router.tsx` (add `area/:areaId/:topicSlug` route). Delete: none.

## Implementation Steps
1. Port ui primitives: mermaid renderer, shiki code block, `katex-formula.tsx` wrapper.
2. Port `deep-dive-content-renderer.tsx`; add `case 'formula'|'graph'|'worked_example'` delegating to child components.
3. Build `formula-block-renderer` (KaTeX block + reading + symbol legend).
4. Build `interactive-function-graph` (lazy function-plot, sliders update `data[].fn` or a param, ResizeObserver, static fallback).
5. Build `worked-example-block` (numbered steps, ⚠️ on `isCommonMistake`, ✅ result, rule label per step).
6. Port quiz trio + header + view-mode toggle.
7. Port `topic-page.tsx`; wire route; add empty Flashcards/Exercises anchors for P4.
8. Add hardcoded fixture topic (all section types) to smoke-test; verify render mobile+desktop; then remove fixture.

## Todo list
- [ ] katex-formula wrapper (safe opts)
- [ ] mermaid + shiki ports
- [ ] extend content renderer (3 new cases)
- [ ] formula-block-renderer
- [ ] interactive-function-graph (lazy, responsive, fallback)
- [ ] worked-example-block (⚠️ + ✅)
- [ ] quiz trio + header + view toggle ports
- [ ] topic-page port + route + P4 anchors
- [ ] fixture smoke test then remove

## Success Criteria
- Fixture topic renders every section type correctly on 375px and 1440px widths.
- KaTeX renders inline + block; graph is draggable/responsive with a working static fallback.
- Quiz scores and persists best score (via progress store from P5 or temporary local state).

## Risk Assessment
- function-plot resize/redraw jank on slider drag → debounce updates; cap redraw rate.
- KaTeX + long formulas overflow on mobile → wrap in `overflow-x-auto` container.
- Graph a11y (canvas/SVG) → always ship the `reading`/caption text alongside.

## Security Considerations
- KaTeX `trust:false`, `throwOnError:false`. Mermaid `securityLevel:'strict'` (as cs-hub). No `dangerouslySetInnerHTML` except sanitized mermaid SVG (same as ref).

## Next Steps
- P4 fills Flashcards + Exercises slots on the topic page and adds SR wiring.
