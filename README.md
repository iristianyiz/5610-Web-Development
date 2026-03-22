# Project 2: Interactive Sudoku
**By Faith Zhang & Iris Zhang**

A single-player Sudoku web app built with React, React Router, and the Context API for CS5610. It supports two modes — Easy (6×6) and Normal (9×9) — with real-time validation, a live timer, localStorage persistence, and puzzles guaranteed to have a unique solution via backtracking.

---

## Live Links

- **GitHub:** https://github.khoury.northeastern.edu/iriszhang/iris-zhang-faith-zhang-project2/
- **Deployed (Render):** https://render.com/

---

## How to Run Locally

```bash
npm install
npm run dev
```
Then open http://localhost:5173 in your browser.

---

## Writeup

### Challenges

One of the main challenges was handling subgrid borders on a dynamically-sized CSS grid. Because the board switches between 6×6 and 9×9, CSS `nth-child` selectors are fragile and break when the column count changes. We solved this by computing `isBoxRight` and `isBoxBottom` boolean props directly inside `SudokuGrid` based on each cell's position relative to its box dimensions, then applying thicker-border CSS classes to individual cells. Another challenge was managing the timer correctly across all game events. The timer needed to freeze at the final elapsed time when the puzzle was solved, resume accurately after a browser refresh (via localStorage), and restart cleanly on both Reset and New Game. We stored `timerStart` as an absolute timestamp and `timerActive` as a boolean in the Context reducer; on save, we compute `timerElapsed = Date.now() - timerStart` so the clock picks up from the right place after a reload. Input handling on controlled React inputs also required careful thought — a controlled input can accumulate multiple digits (e.g. showing "37" when only one digit is intended), so we strip non-digit characters from the raw change value and always take the last typed character, while Backspace and Delete are caught via `onKeyDown` with `preventDefault` to cleanly clear the cell.

### Given More Time

Given more time, we would improve mobile usability by replacing the standard text input with a custom number-pad overlay that appears when a cell is tapped, since native numeric keyboards on mobile can behave inconsistently with controlled inputs. On the design side, we would add smooth animations for the win state, difficulty-specific color themes to visually distinguish Easy from Normal mode, and a persistent high-score board backed by a real database rather than mocked hardcoded data. Finally, we would expand the puzzle generator to support additional board sizes and difficulty levels beyond the two required by the assignment.

### Assumptions

We assumed the timer should start immediately when a New Game is generated or when Reset is pressed, rather than waiting for the first keystroke, so it reflects the player's total time on the puzzle including initial thinking time. For board density, Easy mode always starts with exactly 18 givens (half of the 36 cells), while Normal mode uses between 28 and 30 givens chosen randomly each generation, matching the PDF requirement. We assumed out-of-range input should be silently ignored rather than shown as an error — typing `0` or `7`–`9` in Easy mode simply does nothing, and the cell keeps its previous value. Given cells (pre-filled at puzzle start) are never highlighted red, since the backtracking generator guarantees they form a valid partial solution and will never conflict with one another; the red incorrect border is therefore only applied to user-editable cells. Finally, we assumed that pressing Reset should also restart the timer, since reverting to the original puzzle state is equivalent to starting it over from scratch.

### Time Spent on this Assignment
We spent around three weeks on this assignment, including initial planning like breaking it into smaller tasks and milestones, to implementing the details, and finally adding bonus point features. We also spent some time on deploying the app on render. Now it's fully functional and working correctly.

### Bonus Points We Incorporated (all of them)

**Local Storage (3 pts)**
Game state is persisted to `window.localStorage` after every action so a mid-game browser refresh restores the board exactly where the player left off, including the elapsed timer. All localStorage access is isolated to three private helper functions inside [`SudokuContext.jsx`](https://github.khoury.northeastern.edu/iriszhang/iris-zhang-faith-zhang-project2/blob/main/src/sudoku/SudokuContext.jsx#L11-L56): `saveToStorage` serialises the board, givens, mode, lock state, and elapsed milliseconds; `loadFromStorage` reads and validates that data on app startup (called once inside `initState`, the initialiser passed to `useReducer`); and `clearStorage` removes the entry. A `useEffect` in the provider fires after every state change and either saves the new state or clears storage when the game is won. A wrapped dispatch clears storage immediately when the player hits Reset, satisfying the requirement to clear on both win and reset.

**Backtracking Unique-Solution Generator (4 pts)**
Puzzle generation runs in two phases, both implemented with backtracking in [`sudokuGenerator.js`](https://github.khoury.northeastern.edu/iriszhang/iris-zhang-faith-zhang-project2/blob/main/src/sudoku/sudokuGenerator.js). First, [`fillBoard`](https://github.khoury.northeastern.edu/iriszhang/iris-zhang-faith-zhang-project2/blob/main/src/sudoku/sudokuGenerator.js#L61-L71) builds a complete valid solution: it picks the next empty cell, tries each digit in a randomly shuffled order, places it if it passes the row/column/subgrid validity check, and recurses — backtracking (resetting the cell to null) whenever no candidate leads to a valid completion. Second, [`removeCellsToGivens`](https://github.khoury.northeastern.edu/iriszhang/iris-zhang-faith-zhang-project2/blob/main/src/sudoku/sudokuGenerator.js#L106-L130) removes cells one at a time in a random order. After each tentative removal it calls [`countSolutions`](https://github.khoury.northeastern.edu/iriszhang/iris-zhang-faith-zhang-project2/blob/main/src/sudoku/sudokuGenerator.js#L82-L95) — a second backtracking solver that counts completions up to a limit of 2 and exits early the moment a second solution is found. If `countSolutions` returns exactly 1 the removal is kept; otherwise the cell is restored. This guarantees every generated puzzle has a unique solution.

**Hint System (5 pts)**

We added a **Hint** button on each game page ([`GamePage.jsx`](src/views/GamePage.jsx)). When the player clicks it, the app dispatches a `HINT` action into the Sudoku Context ([`SudokuContext.jsx`](src/sudoku/SudokuContext.jsx)).

**How we detect a valid single-candidate cell**

For every cell that is **not** a given and is currently **empty**, we compute the set of digits that could legally go there **given the current board** (not the final solution). The helper [`getCandidates`](src/sudoku/SudokuContext.jsx) builds this set by collecting digits already used in that cell’s row, column, and sub-grid (2×3 for 6×6, 3×3 for 9×9), then returning the digits from `1` to `size` that are not used. Per the assignment, a hint is only valid if there is **exactly one** such digit. We collect every empty cell with `candidates.length === 1`. If there are none, we set `hintStatus` to `'not-found'` and show a short message under the controls. If there are several, we **pick one at random** (`Math.floor(Math.random() * candidates.length)`) so only a single square is highlighted, as required.

**Highlighting and state cleanup**

The chosen cell is stored as `hintCell: { row, col, value }` in Context. [`SudokuGrid.jsx`](src/sudoku/SudokuGrid.jsx) passes `isHint` into each [`SudokuCell.jsx`](src/sudoku/SudokuCell.jsx), which adds the `hint` CSS class for a yellow highlight ([`.cell.hint`](src/index.css) in [`index.css`](src/index.css)). The hint is cleared on the next cell edit, New Game, or Reset so it never stays stale after the board changes. Hints are disabled when the puzzle is complete (`locked` / `isComplete`), matching normal play.

**Early Submission (2 pts)**
We submitted this project 48 hours before the deadline. 
