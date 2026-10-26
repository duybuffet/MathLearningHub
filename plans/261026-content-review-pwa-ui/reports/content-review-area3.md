# Content review — Area 3 (Đại số tuyến tính / Linear Algebra)

Scope: `src/content/area3/*.json` (vectors, matrices-operations, matrix-multiplication, determinant-inverse, linear-systems).
Validation: `node scripts/validate-content.mjs area3` → ✓ all content valid. All values re-computed with Python (fractions).
All existing flashcard/exercise/quiz ids kept; new ids follow existing patterns.

## (a) Errors found and fixed

| File | Was | Now |
|---|---|---|
| linear-systems | Worked Ex. 2 least squares: $w_0 \approx 0.33$, line $y = 1.5x + 0.33$ | $w_0 = 4/6 = 2/3 \approx 0.67$; full Cramer computation + check that the line passes through the mean point $(2, 11/3)$ and the residuals sum to 0 |
| matrix-multiplication | Intro: "apply A then B ≡ multiply AB" | Apply A then B = **BA** ($B(A\mathbf{x}) = (BA)\mathbf{x}$) |
| matrix-multiplication | Analogy: "3 môn thi" with W 3×2 | 2 subjects (W has 2 columns) |
| matrix-multiplication | ex-matmul-apply-1: `relatedFlashcard` → fc-matmul-nn (neural net) for a rotation exercise; mistake step claimed "pR gives 1×2" muddled | Points to new fc-matmul-rotation; mistake explains column-vector pR is undefined, and row-vector pR = (1,−3) = rotation in the opposite direction |
| matrix-multiplication | Intro: PageRank = "powers of the adjacency matrix" | Repeated multiplication by the transition matrix (power iteration) |
| matrices-operations | Analogy: "A[1][2] = 3 (row 1, col 2)" — wrong, $a_{12}=2$ | $a_{12}=2$, $a_{13}=3$ = `A[0, 2]` in NumPy |
| matrices-operations | Diagram: "Lật ảnh ngang (Transpose…)" — transpose is not a horizontal flip | Transpose = reflection across the diagonal; horizontal mirror = reversing column order (separate node) |
| matrices-operations | ex-mat-challenge-1: "$X^TX$ is the covariance matrix" | Gram matrix; only $\frac{1}{n-1}X^TX$ of **mean-centered** X is the covariance matrix (now the flagged common mistake) |
| matrices-operations | Explanation: broken 5-column pipe table for A+B (rendered as garbage) | Display-math matrices |
| matrices-operations | ex-mat-apply-1 mistake step "divide by 256/254" (not a real slip) | Real slip: uint8 overflow (200+100 → 44), fix with astype + clip |
| vectors | Diagram: cos(king, apple) ≈ 0.24 | 0.18/0.82 ≈ 0.22 (cos(king, queen) ≈ 0.998) |
| determinant-inverse | Graph "det = area of parallelogram" plotted two unrelated lines (y=2x, y=0.5x+1) | Plots an actual parallelogram: columns (3,1), (1,2), four boundary lines, area = det = 5 |
| determinant-inverse | Callout: "computing $A^{-1}$ costs O(n³)" (implies solve is cheaper in order) / flashcard fc-inv-solve: "LU vs Gauss-Jordan" | Both are O(n³); solve ≈ ⅔n³ vs inverse ≈ 2n³ (about 3×) and more accurate |
| determinant-inverse | ex-det-challenge-1 (Ridge): mislabeled "common mistake" (a philosophy remark); relatedFlashcard → fc-inv-solve | Proper eigenvalue argument ($\mathbf{v}^TX^TX\mathbf{v} = \|X\mathbf{v}\|^2 \ge 0$); real mistake = "any λ≠0 works" (λ<0 can re-create singularity); link → fc-eigen-def |
| linear-systems | ex-linsys-challenge-1: mistake step was nonsense ("using det=0 as an example"); prompt called X "augmented [X\|y]" | Rank argument for why there is no exact solution; real mistake (computing $X\mathbf{y}$ / forgetting the transpose); line passes through mean point check |
| linear-systems | Three-cases diagram/flashcard based only on det (only valid for square systems) | Rank criterion (Rouché–Capelli) added; diagram labeled "square system" |
| linear-systems | Least-squares symbol: "$(X^TX)^{-1}X^T$ is the pseudoinverse" without condition | Only when X has full column rank; normal equations added |
| linear-systems | Intro: "foundation of **every** optimization problem", "tìm điểm giao thông" | Tempered claims; graphics/simulation/Markov-chain examples |
| linear-systems | q-linsys-1 option "Hai nghiệm" (ambiguous) | "Đúng hai nghiệm"; explanation adds "never exactly 2 solutions" |
| matrix-multiplication | ex-matmul-challenge-1 (c) had no numbers | Concrete cost: 6 vs 20 multiplications per input (+24 once) |
| several | Steps with `isCommonMistake: false`, steps without `rule`, exercises with no flagged mistake (ex-mat-warmup-1, ex-matmul-warmup-1) | Every exercise has exactly one real flagged mistake and a `rule` on every step |
| vectors | Stray `A*` in prose would italicize | Wrapped in code |

Quiz `correct` indices rebalanced (options swapped, explanations unchanged): now [012302], [023102], [032102], [021302], [130223].

## (b) Additions per topic (counts: flashcards / exercises / quiz)

- **vectors** (9 / 6 / 6): L1/L2/L∞ norm formula; distance, unit vector, L1 vs L2 regularization; cosine similarity formula (range, cosine distance); angle in Ex. 1; **projection** formula + intuition (least squares, Gram–Schmidt, game slide, PCA) + worked example; vector search callout (normalize → dot product; $\|a-b\|^2 = 2-2\cos\theta$). New ex: norms/unit vector, game wall-slide projection, proof of the L2↔cosine ranking equivalence.
- **matrices-operations** (9 / 6 / 6): Hadamard vs matmul; transpose properties; special matrices (identity, diagonal, symmetric, sparse/CSR); **row-major vs column-major memory layout + cache**; accurate broadcasting callout. New ex: indexing $a_{ij}$ ↔ NumPy, byte offsets row/col-major + loop order, mean-centering/broadcasting with keepdims.
- **matrix-multiplication** (10 / 6 / 6): distributivity, identity; **column view and matrix as a linear transform, composition order**; worked example SR ≠ RS; **cost m·p·n / O(n³), i-k-j loop order, BLAS tiling, matrix-chain order, Strassen**; adjacency matrix powers count paths. New ex: shape validity of AB/BA/BC/CA/ABC, scale-then-rotate sprite, matrix-chain cost (7500 vs 75000).
- **determinant-inverse** (10 / 6 / 6): orientation/negative det, 3D volume; 3×3 cofactor formula; properties det(AB), det(Aᵀ), det(A⁻¹), det(kA)=kⁿdet, (AB)⁻¹=B⁻¹A⁻¹; ill-conditioning note; **eigenvectors/eigenvalues section** (intuition, det(A−λI)=0, trace/det, PageRank power iteration, PCA, exploding/vanishing in RNNs) + worked example. New ex: 2×2 inverse with check, 3×3 det + det(2A) volume, eigen-decomposition + power iteration.
- **linear-systems** (8 / 6 / 6): proper cases display; partial pivoting; complexity callout (⅔n³, LU reuse, iterative solvers); **rank section + Rouché–Capelli formula**, free variables, "never exactly 2 solutions", multicollinearity, low-rank recommender; normal equations; condition-number note on lstsq. New ex: parallel lines (0 = −1), 3×3 Gaussian elimination, rank-2 system with parameter c (∞ vs 0 solutions).

## (c) Suggestions not implemented

- Linear-systems Worked Ex. 1 still uses `bmatrix` with a `|` column for the augmented matrix; new content uses `\left[\begin{array}{cc|c}…\end{array}\right]` (proper vertical bar). Harmless; could be unified.
- A small interactive/graph showing a vector and its projection would help (function-plot only draws functions; would need a vector/arrow section type — renderer change, owned by lead).
- SVD / orthogonal matrices / change of basis are not covered in area 3; worth a future topic ("SVD & PCA") if the curriculum grows.
- `readTime` values bumped (~16–22 min) to reflect the added content; the lead may want to check that against curriculum-level estimates.
