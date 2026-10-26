# Content review — Area 2 (Giải tích nhẹ / Calculus-lite)

Files: `src/content/area2/{limits,continuity,derivatives,integrals-basics}.json`
Validator: `node scripts/validate-content.mjs area2` → ✓ all valid.
All numbers re-computed with python3 (bisection, GD iterations, H_n, Riemann sums, sigmoid/backprop via central differences, crossover n^10 vs 1.01^n, (1-1/n)^n).
Existing ids kept; new ids follow `fc-<topic>-*`, `ex-<topic>-<tier>-2`, `q-<topic>-4..6`.

## (a) Errors found & fixed

### limits.json
- Worked ex. 2, step 3 rule: "5n²+100n is NOT O(n³)" — **false** (Big-O is an upper bound; it is O(n³), just loose). Now: it is Θ(n²); O(n³) is true but not tight. Result line now states Θ(n²).
- Key takeaway "lim f/g = const → same order (O notation)" — missing "0 < c < ∞" and wrong notation; now Θ with the 0 / c / ∞ trichotomy. Flashcard `fc-lim-bigo` likewise adds Θ.
- Graph caption "both are O(1/n) and O(1/n²) respectively — constant factors don't affect order" — muddled/irrelevant; rewritten (both → 0, different rates).
- Explanation bullet "lim 1/n = 0 → constants shrink to 0, can be dropped" — imprecise; rewritten as c/n → 0 (lower-order term over dominant term).
- `isCommonMistake` mislabeled on worked ex. 1 step 4 and `ex-lim-warmup-1` step 4 (plain verification steps, not slips) → rewritten to describe the real slip (assuming direct substitution always works / checking only one side).
- `ex-lim-challenge-1` commonMistake claimed "O(n²+n)" is wrong — it isn't wrong, just redundant; reworded.
- Analogy table had 8 columns (breaks on mobile) → transposed to 2-column x / f(x) table.

### continuity.json
- **Quiz q-cont-2 option**: "left limit (→1.999...) ≠ right limit" — wrong: left limit of floor at 2 is **1**; option + explanation fixed.
- **Quiz q-cont-3**: distractor "f has exactly one root in (1,2)" is actually TRUE for x³−2 (strictly increasing) → ambiguous question. Reworded to "using IVT alone" and option to "IVT guarantees uniqueness"; explanation notes uniqueness comes from f' > 0.
- `ex-cont-challenge-1` `relatedFlashcard` pointed to `fc-cont-ivt` (IVT) for a ReLU/differentiability question → new `fc-cont-diff`.
- `ex-cont-challenge-1` reasoning: claimed GD fails for sign() because the derivative doesn't exist at 0, and "sign has no useful subgradient". Real issue: derivative = 0 everywhere else (no gradient signal); subgradient talk removed (sign isn't convex). Answer/steps rewritten.
- Removable discontinuity defined only as "f undefined at c" — also covers f(c) defined but ≠ limit (the page's own callout example). Fixed in explanation + `fc-cont-types`. Renamed "gián đoạn điểm" → "gián đoạn bỏ được (removable)" consistently.
- Graph caption said ReLU is "smoother" than the sign function — ReLU isn't smooth; now: continuous with non-zero derivative over a large region.
- IVT formula only covered f(a) < k < f(b); now "k between f(a) and f(b)", c ∈ [a,b] (formula split onto 2 lines for mobile). `fc-cont-ivt` adds "existence, not uniqueness".
- Mislabeled `isCommonMistake` on the conclusion steps of `ex-cont-apply-1` and worked ex. 1 → moved to actual slips.
- `ex-cont-warmup-1` rule "limit = ∞ means does not exist" refined (here the two sides also go to ±∞ in opposite directions).

### derivatives.json
- "f'(x) = 0 → extremum (peak or trough)" in analogy, key takeaways and `fc-deriv-sign` — **wrong** (x³ at 0). Now "stationary point — may be max, min, or neither".
- `ex-deriv-challenge-1` last step: α = 1.5 "doesn't converge but oscillates" — actually **diverges** (w: 0 → 9 → −9 → 27; error ×(−2) per step). Added the error recurrence (1−2α) and the exact convergence condition 0 < α < 1. relatedFlashcard → new `fc-deriv-lr`.
- GD explanation "derivative ≈ 0 → reached the minimum" — imprecise; now "near a stationary point (minimum for convex loss; possibly local min/saddle for NNs)".
- Power-rule symbol "n can be any real" — added the x > 0 caveat.
- Worked ex. 1 step 4 mistake text clarified (f(3) = 86 vs f'(3) = 97, verified).

### integrals-basics.json
- **Accumulated-area graph caption**: "when f increases F slopes up; when f = 0, F has an extremum" — wrong on both counts and contradicted by the plotted x³/3 (f = x² = 0 at 0 but F has an inflection, not an extremum). Rewritten: F increases where f > 0, F' = f.
- Worked ex. 2: listed **Poisson** as a PDF example — Poisson is discrete (no PDF) → "Gaussian, exponential". The example was titled "kỳ vọng…" but never computed an expectation → added E[X] = 1 step.
- Intro claimed integrals relate to "amortized analysis" and vague "total operation counts" — replaced with sums ↔ integrals bounding (Σ1/k ≈ ln n). Key takeaway likewise.
- Riemann-sum formula never defined Δx or x_i → symbols added.
- `fc-int-def` clarified to signed area.

### Quiz index balance
All four files were almost always `correct = 1/2`. Existing questions re-ordered (explanations don't reference letters); now limits [3,0,1,2,0,3], continuity [1,3,0,2,1,3], derivatives [3,0,1,2,0,3], integrals [2,3,0,1,3,0].

## (b) Additions per topic (now: limits 11 fc / 6 ex / 6 quiz; continuity 9/6/6; derivatives 12/6/6; integrals 10/6/6)

- **Limits**: one-sided limits & 3 ways a limit fails to exist; growth-rate comparison via lim f/g (o / Θ table) + ladder log n ≪ √n ≪ n ≪ n log n ≪ n² ≪ 2ⁿ ≪ n!; graph log₂n / n / n² / 2ⁿ; L'Hôpital formula (with "only 0/0, ∞/∞" warning); worked ex. ln n/n and n³/2ⁿ; callout (1−1/n)ⁿ → 1/e (empty hash buckets, bootstrap OOB). New exercises: rational limit 2/5; n log n vs n^1.5 via L'Hôpital; hash-bucket 1/e (1^∞ form). Quiz: 1.01ⁿ vs n¹⁰ (crossover ≈ 9 170), |x|/x, when L'Hôpital applies.
- **Continuity**: building-block rules for recognising continuity; continuous ≠ differentiable (|x|, ReLU); Extreme Value Theorem; bisection step-count formula k ≥ log₂((b−a)/ε) + hand-run 3 bisection steps; `git bisect` as discrete IVT. Exercises: piecewise parameter k = 1.5; bisection steps [0,100] to 0.001 → 17; x⁵+x−1 exactly one root (IVT + monotonicity) + 2 bisection steps. Quiz: which function is continuous everywhere; bisection 10 steps; differentiable ⇒ continuous.
- **Derivatives**: common-derivative table (eˣ, aˣ, ln x, sigmoid); product rule; chain rule (+ Leibniz form); worked ex. chain/product; partial derivatives & gradient (steepest ascent) + multivariate GD formula; mermaid backprop computational graph; linear approximation f(x+h) ≈ f(x)+f'(x)h and central-difference gradient checking; worked backprop through a sigmoid neuron (∂L/∂w = −0.5, verified numerically). Exercises: product rule x³ ln x; 2-D gradient step on x²+4y² (5 → 0.8); derive σ' = σ(1−σ) and explain vanishing gradient (0.25¹⁰). Quiz: d/dx e^{3x}; ∇(x²y) at (1,2); which α diverges.
- **Integrals**: antiderivative table (incl. 1/x → ln x, e^{kx}); Riemann sums by hand (left 1.75 / right 3.75 / mid 2.625 vs 8/3); sums ↔ integrals bounds, H_n bracket ln(n+1) ≤ H_n ≤ 1+ln n, Σk² ≈ n³/3, log n! = Θ(n log n), quicksort / coupon collector; staircase graph 1/⌊x⌋ over 1/x; improper integrals (1/x² converges, 1/x diverges), exponential E[X] = 1/λ. Exercises: right Riemann sum of x² (0.46875); PDF 2x validity / P / E[X] = 2/3; coupon collector n=100 bounds 461.5–560.5 (true 518.7). Quiz: Σ1/k = Θ(log n); ∫1/x; signed area ∫_{-1}^{1} x³ = 0.
- readTime and taglines (derivatives, integrals) updated to match the expanded content. Long display formulas split with `gathered`/`aligned` for mobile.

## (c) Not implemented / suggestions
- No ε-δ definition of limits on purpose (intuition-first); could add as an optional "info" callout.
- Integration by parts / u-substitution omitted (YAGNI for this audience); E[X] = 1/λ for the exponential is stated, not derived.
- Taylor series (eˣ, ln(1+x) ≈ x) would fit naturally after "linear approximation" — a candidate future topic in Area 2.
- Graph `1/floor(x)` and `2^x` rely on function-plot's evaluator supporting `floor`/`^` (math.js-valid); worth a quick visual check in the browser, and the mermaid backprop diagram (dotted edges with labels `-.->|"..."|`).
- Formatting: files were re-serialized by `json.dump(indent=2)`, so small inline objects are now multi-line (larger diff, no content change).
