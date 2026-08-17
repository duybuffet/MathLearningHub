# Math Learning Hub

Toán nền cho Khoa học Máy tính — *Math foundations for Computer Science.*

A self-contained learning site to re-learn the core math behind CS (interview prep +
deeper understanding), built for retention: intuition-first lessons, KaTeX formulas,
interactive graphs, and spaced-repetition (SM-2) flashcards + exercises.

## Features

- **7 curriculum areas, 30 topics** — Algebra & Functions, Calculus-lite, Linear Algebra,
  Discrete Math, Probability & Statistics, Graph Theory, Math for Algorithms.
- **Retention loop per topic**: Learn → Recall (flashcards) → Practice (tiered exercises) →
  Space (SM-2). "Ôn hôm nay" (Review Today) interleaves due items across topics.
- **Rich lessons**: KaTeX formulas with plain-language readings, interactive function
  graphs, worked examples with ⚠️ common-mistake markers, quizzes.
- **Bilingual** Vietnamese content with English terms; **Chalkboard** dark theme.
- No backend — all progress + review state in `localStorage`.

## Stack

React 18 · Vite · TypeScript · Tailwind CSS · Zustand (persist) · React Router ·
KaTeX (react-katex) · function-plot · Mermaid · Shiki.

## Getting started

```bash
npm install
npm run dev            # default port 5173
npm run dev -- --port 3000   # custom port
npm run build          # type-check + production build
npm run preview        # preview the production build
```

## Content model

Each topic is one JSON file under `src/content/<area>/`, indexed by
`src/content/curriculum.json` (area → unit → topic). A topic renders once its curriculum
entry has a `file` — so adding a topic needs no code change. See `docs/` for architecture,
code standards, roadmap, and changelog.
