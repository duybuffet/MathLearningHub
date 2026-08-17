# System Architecture — Math Learning Hub

Client-only SPA. No backend. All learner state (progress + spaced-repetition) in
localStorage via zustand persist. Mirrors the `cs-learning-hub` architecture.

## Stack

- React 18 + Vite + TypeScript (strict), Tailwind (CSS-var dark theme).
- Routing: react-router-dom (`createBrowserRouter`), layout shell wraps pages.
- State: zustand + persist (progress store, SR store).
- Content: one JSON file per topic under `src/content/<area>/`, indexed by
  `src/content/curriculum.json` (area → unit → topic).
- Math rendering: KaTeX (react-katex). Graphs: function-plot (lazy). Diagrams: mermaid.
  Code: shiki.

## Content pipeline

`import.meta.glob` eagerly loads all topic JSON. A topic renders only when its
curriculum entry has a `file`. Adding a topic = add JSON + set `file`; no code change.

## Key modules

- `src/lib/content-loader.ts` — curriculum access + topic resolution.
- `src/lib/spaced-repetition-sm2.ts` — pure SM-2 scheduling (Phase 4).
- `src/store/progress-store-with-persist.ts` — read/quiz/view state.
- `src/store/spaced-repetition-store.ts` — flashcard/exercise review state (Phase 4).
- `src/components/topic/*` — section renderers, quiz, exercises, flashcards.

## Learning loop (per topic)

LEARN (content) → RECALL (flashcards) → PRACTICE (exercises) → SPACE (SM-2 review).
"Ôn hôm nay" page interleaves due items across topics.
