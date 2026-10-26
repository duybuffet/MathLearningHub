# Content review: Area 6 (Graph Theory)

Files: `src/content/area6/graph-basics.json`, `graph-traversal.json`, `trees.json`.
Validation: `node scripts/validate-content.mjs area6` passes.
Checked with python3: every BFS/DFS order, every distance, Dijkstra and Bellman-Ford traces, BST insert shapes and traversal orders, and the MST total.
All existing flashcard, exercise and quiz ids are unchanged.

## (a) Errors found and fixed

### Rendering errors (affected all three files)
- Code fences (```) are not supported by the renderer. Pseudocode and adjacency lists were showing raw backticks and collapsing into one line. Replaced them with Markdown lists and numbered steps that use inline `code`.
- Worked-example steps, exercise steps, hints, answers and flashcards only render inline Markdown. Lists and a pipe table inside these fields showed up as raw `- ` and `|` characters. Affected: the graph-basics worked examples, ex-graph-apply-1 (matrix table), ex-trees-apply-1, ex-trees-challenge-1 and the traversal trace. Rewrote them as single-line text.

### graph-basics
- ex-graph-challenge-1: the density was given as "E/V² = 0.01%", but the same step said "99.98% of cells are 0". These don't match. A symmetric matrix has 2E ones, so the density is 0.02%. Fixed.
- ex-graph-challenge-1: "adjacency list is about 1000× smaller" was wrong. 2×10⁸ IDs × 4 B is about 0.8 GB, against 125 GB for the matrix, so it is about 150×.
- Worked example 1 used "O(4+4) = O(8)" (a constant inside Big-O). Rewrote it as V + 2E = 12 stored entries, explaining that each undirected edge is stored twice.
- Worked example 1: `isCommonMistake` was on an unremarkable step and the explicit `false` flags were noise. Moved the flag to the step about edges being stored twice.
- The directed diagram caption said D "cannot reach A directly". In fact no path exists at all. Fixed, and noted that the graph is a DAG.
- The max-edges formula only covered undirected graphs, and its symbols mixed V with K_V. Split it into separate formulas: n(n−1)/2 for undirected vs n(n−1) for directed, and the handshake lemma including Σin = Σout = |E|.
- q-graph-2 had the option "Cả hai đều O(1)" ("both are O(1)"), where it was unclear which two were meant. Reworded it.
- Flashcard fc-graph-max-edges covered only the undirected case. Added the directed case.

### graph-traversal
- The applications section said "DFS meets a visited vertex (back edge) → cycle". This is wrong for directed graphs and contradicts the topic's own challenge exercise. Rewrote it with the 3-colour (white/gray/black) rule and added a section explaining it.
- A key takeaway said "mark visited on enqueue / start, not on pop". This contradicted the iterative DFS shown in the topic, which marks on pop. Fixed.
- Iterative DFS: the text didn't say that pushing neighbours in order gives a different visit order from recursive DFS (S,B,E,D,F,A,C vs S,A,C,F,D,B,E). It also didn't say the stack can grow to O(E). Added both points and the tip to push neighbours in reverse order.
- The analogy claimed "`git log --graph` uses DFS to trace history". This is dubious. Replaced it with accurate examples: crawler/BFS, mark-and-sweep GC, and build dependency DFS.
- The complexity symbol said "each edge is examined exactly once". Undirected edges are examined twice. Also added that the cost is O(V²) with an adjacency matrix, and that a full multi-component traversal is still O(V+E).
- The BFS warning callout said that marking on dequeue "may loop forever". It only causes duplicate enqueues (the queue grows to O(E)). An infinite loop happens only if the visited check is dropped entirely. Made this precise.
- BFS trace: the step where F is enqueued didn't add F to visited. Fixed.
- q-traversal-1 asked which vertex BFS finds "before DFS", which is ill-posed. Rewrote it: BFS guarantees vertices come out of the queue in non-decreasing distance.
- q-traversal-3 used "O(6+8) = O(14)", a constant inside Big-O. Replaced it with a well-posed question: counting components with shared visited is O(V+E).
- ex-traversal-challenge-1: added the C→D black-vertex step that shows why "already visited ≠ cycle". The isCommonMistake flag now sits on that step.

### trees
- q-trees-2: the insert sequence {3,1,4,1,5,9,2,6} contained a duplicate 1. A standard BST rejects duplicates, so the marked answer "1,1,2,…" was ill-defined. Changed the sequence to 3,1,4,8,5,9,2,6, giving the answer 1,2,3,4,5,6,8,9.
- The BST diagram caption stated the property as "left child < parent < right child". The property actually applies to whole subtrees. Fixed, and added a "Validate BST" warning callout and an exercise on it.
- The definition of a complete tree left out "last level filled from the left". Full and perfect were not defined at all. Added all three with a counter-example diagram and a terminology warning (some textbooks use "complete" to mean "perfect").
- Key takeaway "h = floor(log₂ n) → BST and heap are O(log n)": this only holds for a balanced BST. Fixed and added the bounds ⌊log₂n⌋ ≤ h ≤ n−1.
- The level formula reading said "cây nhị phân đầy đủ cao h has at most 2^(h+1)−1 nodes", which is ambiguous wording. Changed it to "any binary tree; exactly when perfect".
- File-system diagram: unquoted `/` labels risked mermaid parse errors and it had 9 nodes. It is now quoted and has 8 nodes. The caption claimed "symlink loops are impossible" and that "leaves are files". Corrected: symlinks and hard links break the tree structure, and empty directories are leaves too.
- ex-trees-challenge-1(b): "list files alphabetically" with sorted-children DFS gives path order, not order by file name. Clarified the prompt and added the global-sort variant. The rule "pre-order or in-order both work" was misleading because in-order is undefined for n-ary trees.
- ex-trees-challenge-1 linked to fc-tree-inorder, but the exercise is about post-order deletion. Repointed it to the new fc-tree-traversal-orders.
- ex-trees-warmup-1 linked to the log-height flashcard. Repointed it to the new fc-tree-perfect-count.
- BST search example: "max steps = height" was off by one (it is h+1 comparisons). Fixed here and in fc-tree-height-log.

### Quiz index balance
- Before, almost every `correct` was 1. Now:
  - graph-basics: [1,0,3,0,2,2,1]
  - traversal: [0,1,3,2,1,0,3]
  - trees: [1,0,2,3,0,1,2,3]

## (b) Additions

| Topic | Flashcards | Exercises (w/a/c) | Quiz |
|---|---|---|---|
| graph-basics | 5 → 10 | 3 → 6 (2/2/2) | 3 → 7 |
| graph-traversal | 5 → 10 | 3 → 6 (2/2/2) | 3 → 7 |
| trees | 5 → 12 | 3 → 6 (2/2/2) | 3 → 8 |

- **graph-basics:**
  - Sections added: simple graph and weighted graphs; terms (path, cycle, connected, component, DAG, strongly connected); a component diagram; max edges for directed vs undirected; the directed handshake lemma.
  - Comparison table for list vs matrix, sparse vs dense, and edge lists.
  - New exercises: 10 microservices (45 vs 90 edges, why n² is wrong); network components (4 components, needs k−1 = 3 cables, the redundant cycle edge); a dense flight graph where the matrix wins (125 KB vs 3.2 MB).
  - New quiz questions: directed max edges, the odd-degree impossibility, BFS on a matrix being O(V²), and 10 vertices with 6 edges must be disconnected.
- **graph-traversal:**
  - Sections added: 3-colour cycle detection; topological sort (Kahn + DFS reverse post-order) with a DAG diagram and a worked Kahn example.
  - **Dijkstra:** intuition (greedy + min-heap, why it's correct), relaxation formula, O((V+E) log V), a weighted diagram, and a full trace showing "fewest edges ≠ lightest".
  - Negative-edge callout covering Bellman-Ford O(VE), negative cycles, and the "add a constant" trap.
  - An algorithm-choice table, plus tips on `deque` and recursion limits.
  - New exercises: Kahn on course prerequisites (exactly 2 valid orders); a Dijkstra trace (A..E, answer 8); a negative-edge counter-example (Dijkstra gives A = 2, true A = 1; adding +4 changes the path).
  - New quiz questions: Dijkstra complexity, negative edge → Bellman-Ford, Kahn output short → cycle, Number of Islands O(R×C).
- **trees:**
  - Sections added: equivalent definitions (unique path, n−1 edges, forest n−k); full/complete/perfect plus L = I+1 with a diagram; height bounds formula; heap array indexing (2i+1, 2i+2, ⌊(i−1)/2⌋).
  - BST-property callout; level-order traversal added to the explanation and the trace.
  - Spanning tree / MST (Kruskal, Prim) with a diagram, noting that an MST is not a shortest-path tree.
  - New exercises: tree/forest edge counts and "n−1 edges is not enough"; classifying 4 trees as full/complete/perfect; Validate BST (10/5/12 trap, bounds or in-order fix).
  - New quiz questions: perfect-tree node count, height range for n = 15, heap indices, MST weight 7, post-order for freeing memory.

## (c) Suggestions not implemented
- The renderer could support multi-line blocks (lists or tables) in worked-example and solution steps, and fenced code blocks for pseudocode. For now the content avoids both.
- Formula `symbols[].sym` values are not validated by `validate-content.mjs` (it skips `sym`). Consider KaTeX-checking them too.
- Area 6 could later get its own topics on Union-Find, a strongly-connected-components overview, and grid/implicit-graph BFS patterns. Here they are only mentioned briefly.
- All three topics share the `graph` icon. A distinct icon for trees would help.
