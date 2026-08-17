# Phase 01 — Project Scaffold

## Context links
- Plan: [plan.md](./plan.md)
- Scaffold analysis: [reports/scaffold-analysis-report.md](./reports/scaffold-analysis-report.md)
- Ref (read-only): `/Users/duytang/Workspace/duy/cs-learning-hub`

## Overview
- Date: 2026-08-17
- Priority: P1 (blocks all)
- Current status: pending
- Review status: not reviewed
- Description: Stand up an empty-but-runnable React+Vite+TS+Tailwind SPA mirroring cs-hub configs; add KaTeX + function-plot deps; routing shell renders a placeholder home; seed `./docs`.

## Key Insights
- cs-hub is glob-eager JSON driven → scaffold needs no content to boot.
- Design tokens live in `src/index.css` `:root`; Tailwind maps them — copy verbatim, same palette.
- KaTeX needs its CSS (`katex/dist/katex.min.css`) imported once in `main.tsx`.
- function-plot pulls d3 transitively; it is client-only (guard SSR — N/A here, pure SPA).

## Requirements
Functional: `npm run dev` serves a page; `npm run build` (`tsc -b && vite build`) passes; `@`→src alias works; router renders placeholder Home + a 404/coming-soon.
Non-functional: strict TS, files < 200 lines, dark theme renders, responsive viewport meta.

## Architecture
- Vite React SPA, no backend. Entry `main.tsx` → `RouterProvider(router)`.
- `router.tsx`: `AppLayoutShell` wraps `<Outlet/>`; index route = placeholder `HomePage`.
- Tailwind + PostCSS pipeline; CSS-var tokens.

## Related code files
Create (mirror cs-hub):
- `/Users/duytang/Workspace/duy/math-learning-hub/package.json`
- `.../vite.config.ts`, `.../tsconfig.json`, `.../tsconfig.node.json`
- `.../tailwind.config.js`, `.../postcss.config.js`, `.../vercel.json`
- `.../index.html` (retitle "Math Learning Hub")
- `.../src/main.tsx` (add `import 'katex/dist/katex.min.css'`)
- `.../src/index.css` (copy tokens; append KaTeX size/color overrides)
- `.../src/router.tsx` (placeholder routes; expanded in P3/P4/P5)
- `.../src/pages/home-page.tsx` (temp placeholder)
- `.../src/components/layout/app-layout-shell.tsx` (temp minimal)
- `.../.gitignore`, `.../.eslintrc.cjs` (mirror cs-hub if present)
- `./docs/development-roadmap.md`, `./docs/project-changelog.md`, `./docs/system-architecture.md`, `./docs/code-standards.md`
Modify: none. Delete: none.

## Implementation Steps
1. Copy cs-hub root configs (package.json, vite/ts/tailwind/postcss/vercel configs) into math-hub; rename project to `math-learning-hub`, keep scripts identical.
2. Add deps: `katex`, `react-katex`, `function-plot` (+ `@types` if needed). Run `npm install`; pin resolved versions.
3. Copy `index.html`; set `<title>Math Learning Hub` and description; keep font links.
4. Copy `src/index.css` tokens; append `.katex { font-size:1.05em }` + color inheritance overrides so formulas match dark theme.
5. Create `main.tsx` mirroring cs-hub + `import 'katex/dist/katex.min.css'`.
6. Create minimal `app-layout-shell.tsx` (`<Outlet/>` + bg) and placeholder `home-page.tsx`.
7. Create `router.tsx` with index route only (stub other routes as TODO comments for P3-P5).
8. Seed `./docs` four files with initial structure (roadmap phases mirror this plan).
9. Run `npm run dev` + `npm run build`; confirm zero TS/compile errors.

## Todo list
- [ ] Copy + rename root configs
- [ ] Install katex/react-katex/function-plot, pin versions
- [ ] index.html retitled
- [ ] index.css tokens + KaTeX overrides
- [ ] main.tsx + KaTeX CSS import
- [ ] Layout shell + placeholder home
- [ ] router.tsx index route
- [ ] Seed ./docs (4 files)
- [ ] dev + build pass

## Success Criteria
- `npm run dev` shows themed placeholder home on mobile + desktop widths.
- `npm run build` passes (tsc + vite) with no errors.
- KaTeX CSS loaded (a hardcoded test formula renders, then removed).

## Risk Assessment
- react-katex peer-dep mismatch with React 18 → verify version; fallback = use `katex.renderToString` directly in a thin wrapper (no react-katex).
- function-plot bundle size → lazy-import only in graph component (deferred to P3).

## Security Considerations
- No backend/secrets. KaTeX: render trusted authored strings only; set `throwOnError:false`, `trust:false` to block `\href`/HTML injection.

## Next Steps
- P2 (schema types + loader) builds on this scaffold. Keep router stubs ready for P3-P5 routes.
