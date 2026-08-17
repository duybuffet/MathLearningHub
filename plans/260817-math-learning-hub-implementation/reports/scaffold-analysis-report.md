# Scaffold Analysis — cs-learning-hub reference

Date: 2026-08-17. Source: `/Users/duytang/Workspace/duy/cs-learning-hub`. DO NOT MODIFY that repo.

## Files inspected (mirror these)

| cs-hub file | Role | Mirror notes for math-hub |
|---|---|---|
| `package.json` | deps + scripts | copy scripts verbatim; add katex/react-katex/function-plot |
| `vite.config.ts` | React SPA, `@`→src alias | copy verbatim |
| `tailwind.config.js` | CSS-var-backed dark tokens | copy verbatim (same palette) |
| `tsconfig.json` / `tsconfig.node.json` | strict TS, `@/*` paths, resolveJsonModule | copy verbatim |
| `index.html` | root div, Inter+JetBrains fonts, `/src/main.tsx` | copy; retitle; add KaTeX font note |
| `src/main.tsx` | `RouterProvider` + `./index.css` | copy verbatim |
| `src/router.tsx` | `createBrowserRouter`, layout shell wraps home+topic | extend: add review + curriculum + drill routes |
| `src/index.css` | design tokens `:root`, scrollbars | copy; append KaTeX overrides |
| `src/types/content-schema-types.ts` | `SectionType`, `ContentSection`, `QuizQuestion`, `Curriculum*`, `TopicProgress` | extend (see phase-02) |
| `src/content/curriculum.json` | phases[]→weeks[]→topics[]{slug,title,file} | mirror as areas[]→units[]→topics[] |
| `src/content/phase4/math-for-algorithms.json` | full topic sample (sections/visualizer/quiz) | template for math topic JSON |
| `src/lib/content-loader.ts` | `import.meta.glob` eager JSON, resolve by file/slug | copy pattern; rename phase→area |
| `src/store/progress-store-with-persist.ts` | zustand persist, `markRead/setQuizScore/viewMode` | copy; add SR store separately |
| `src/hooks/use-topic-progress.ts` | memoized per-topic selector | copy verbatim |
| `src/components/topic/deep-dive-content-renderer.tsx` | switch over section types + InlineMarkdown | extend with formula/graph/worked_example cases |
| `src/pages/topic-page.tsx` | resolve topic, IntersectionObserver markRead, quiz | extend: add exercises + flashcards blocks |
| `src/components/ui/mermaid-diagram-renderer.tsx` | lazy mermaid singleton, dark theme | copy verbatim |

## Directory layout (cs-hub) to mirror

```
src/{components/{home,layout,topic,ui,visualizers},content/<groups>,hooks,lib,pages,store,types}
root: index.html package.json postcss.config.js tailwind.config.js tsconfig.json tsconfig.node.json vercel.json vite.config.ts
```

## Exact dependency versions to reuse

runtime: react ^18.3.1, react-dom ^18.3.1, react-router-dom ^6.26.2, zustand ^4.5.5,
framer-motion ^11.5.4, mermaid ^11.16.0, shiki ^1.16.2, clsx ^2.1.1.
dev: typescript ^5.5.4, vite ^5.4.5, @vitejs/plugin-react ^4.3.1, tailwindcss ^3.4.11,
postcss ^8.4.45, autoprefixer ^10.4.20, @types/{node ^22.5.4,react ^18.3.5,react-dom ^18.3.0}.

## ADD for math-hub (latest stable at cutoff — pin on install)

- `katex` ^0.16.x + `react-katex` ^3.0.x — formula rendering (import `katex/dist/katex.min.css`).
- `function-plot` ^1.24.x — D3-based interactive graphs (pulls d3 transitively).

## Key mechanics observed

- Content is glob-eager JSON; a topic renders only if curriculum entry has `file`. Missing file → "Coming Soon". Enables incremental authoring — content phases add JSON + set `file`, no code change.
- Design tokens are CSS vars in `:root`; Tailwind maps them. Same dark palette reused as-is.
- `id` convention: `${groupId}_${slug}` (cs-hub uses `phase1_...`; math-hub uses `area1_...`).
- Files kept < 200 lines already (largest layout file 144). Respect same ceiling.
