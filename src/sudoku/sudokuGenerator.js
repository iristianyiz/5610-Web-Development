// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function make2d(rows, cols, value = null) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => value))
}

function cloneBoard(board) {
  return board.map((row) => [...row])
}

function subgridShape(size) {
  if (size === 9) return { r: 3, c: 3 }
  if (size === 6) return { r: 2, c: 3 }
  throw new Error(`Unsupported size: ${size}`)
}

// ── Placement validator ───────────────────────────────────────────────────────

function isValidPlacement(board, row, col, value, size) {
  for (let c = 0; c < size; c += 1) {
    if (c !== col && board[row][c] === value) return false
  }
  for (let r = 0; r < size; r += 1) {
    if (r !== row && board[r][col] === value) return false
  }
  const { r: boxR, c: boxC } = subgridShape(size)
  const startR = Math.floor(row / boxR) * boxR
  const startC = Math.floor(col / boxC) * boxC
  for (let rr = startR; rr < startR + boxR; rr += 1) {
    for (let cc = startC; cc < startC + boxC; cc += 1) {
      if ((rr !== row || cc !== col) && board[rr][cc] === value) return false
    }
  }
  return true
}

function findNextEmpty(board, size) {
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (board[r][c] == null) return { r, c }
    }
  }
  return null
}

// ── Phase 1: Fill a complete valid board with backtracking ────────────────────
//
// Picks a random shuffled candidate for each empty cell, places it, and
// recurses. If no candidate leads to a valid completion, the cell is cleared
// and the algorithm backtracks to the previous choice.

function fillBoard(board, size) {
  const empty = findNextEmpty(board, size)
  if (!empty) return true // every cell is filled → valid solution found

  const { r, c } = empty
  const candidates = shuffle(Array.from({ length: size }, (_, i) => i + 1))
  for (const v of candidates) {
    board[r][c] = v
    if (isValidPlacement(board, r, c, v, size) && fillBoard(board, size)) return true
    board[r][c] = null // backtrack
  }
  return false
}

// ── Phase 2: Count solutions up to `limit` using backtracking ─────────────────
//
// Used to verify that a partially-filled puzzle has exactly one solution.
// Stops as soon as `limit` solutions are found (early exit), so calling with
// limit = 2 efficiently distinguishes "unique" from "ambiguous" without
// enumerating all solutions.

function countSolutions(board, size, limit = 2) {
  const empty = findNextEmpty(board, size)
  if (!empty) return 1 // fully filled → this path is one valid solution

  const { r, c } = empty
  let count = 0
  for (let v = 1; v <= size; v += 1) {
    if (isValidPlacement(board, r, c, v, size)) {
      board[r][c] = v
      count += countSolutions(board, size, limit)
      board[r][c] = null
      if (count >= limit) return count // early exit — already ambiguous
    }
  }
  return count
}

// ── Phase 3: Remove cells while preserving a unique solution ─────────────────
//
// Attempts to remove cells one at a time in a random order. After each
// tentative removal, countSolutions is called with limit = 2. If exactly one
// solution still exists the removal is kept; otherwise the cell is restored.
// This guarantees the final puzzle has a unique solution.

function removeCellsToGivens(solution, size, givensCount) {
  const puzzle = cloneBoard(solution)
  const coords = shuffle(
    Array.from({ length: size * size }, (_, idx) => ({
      r: Math.floor(idx / size),
      c: idx % size,
    })),
  )

  let currentGivens = size * size

  for (const { r, c } of coords) {
    if (currentGivens <= givensCount) break

    const saved = puzzle[r][c]
    puzzle[r][c] = null

    // Clone before passing to the solver so it can mutate freely
    const solutions = countSolutions(cloneBoard(puzzle), size, 2)

    if (solutions === 1) {
      currentGivens -= 1 // safe to remove — puzzle is still uniquely solvable
    } else {
      puzzle[r][c] = saved // restore — removing this cell creates ambiguity
    }
  }

  return puzzle
}

function toGivenMask(puzzle) {
  return puzzle.map((row) => row.map((v) => v != null))
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateSudoku({ mode }) {
  const size = mode === 'easy' ? 6 : 9
  const givensCount =
    mode === 'easy'
      ? 18
      : 28 + Math.floor(Math.random() * 3) // 28–30

  const solution = make2d(size, size, null)
  const ok = fillBoard(solution, size)
  if (!ok) throw new Error('Failed to generate a solved board')

  const puzzle = removeCellsToGivens(solution, size, givensCount)
  const givens = toGivenMask(puzzle)
  return { mode, size, solution, puzzle, givens }
}
