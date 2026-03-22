# Iris-Zhang-Faith-Zhang-Project2 (CS5610 Interactive Sudoku)

Interactive single-player Sudoku web app for CS5610 Project 2.

This file focuses on **planned workflow, tasks, and changes** based on the official requirements PDF (`Project 2 - Sudoku.pdf`) and best practices.

## Current codebase snapshot (baseline)

- **Architecture**: Static multi-page HTML/CSS site (separate folders like `easy/`, `hard/`, `rules/`, etc.)
- **Navigation**: `<a href="...">` links + repeated `<nav>` markup in each page
- **Game pages**: `easy/index.html` and `hard/index.html` currently render a **hardcoded grid** and **non-functional** timer value (no state management / generation / validation yet)

This is a good visual prototype, but the PDF requires **React + React Router + Context-based state management** and real Sudoku gameplay logic.

## Requirements (from the PDF) — implementation targets

### Views & routes (must match)

- **Home**: `/` title + art
- **Selection**: `/games` mocked list of games + authors; links to easy/normal
- **Easy game**: `/games/easy` generates a new 6×6 puzzle on entry
- **Normal game**: `/games/normal` generates a new 9×9 puzzle on entry
- **Rules**: `/rules` rules + credits section with links (email/GitHub/LinkedIn ok to fake)
- **High scores**: `/scores` mocked data only
- **Login**: `/login` username/password inputs + submit (little/no interactivity)
- **Register**: `/register` username/password/verify + submit (little/no interactivity)

### Core Sudoku functionality (must implement)

- **Board sizes**:
  - Easy: **6×6**, starts with **~half** filled
  - Normal: **9×9**, starts with **28–30** filled
- **Given cells**: pre-filled cells are **not editable**
- **Editable cells**:
  - Values can be **changed later**
  - Values can be **deleted**
  - Inputs must ignore out-of-range values (easy: 1–6, normal: 1–9)
- **Rule violations**: illegal placement highlights the cell **red**
- **Controls**:
  - **New Game**: generate a new puzzle
  - **Reset**: revert to original generated puzzle state
- **Timer**: displayed at the top of the game page
- **Win condition**:
  - When all squares are validly complete, **lock the board**
  - Display a **congratulations** message

### React principles & state management (must demonstrate)

- Use **Context API** as the primary store (component state hooks are fine, but most app/game state should live in Context)
- At least **4 React components**
- At least **one component receives props** from a parent
- **Nested components**
- Some data must flow **child → parent** via Context (not by passing a callback function)

### Styling & UX (must demonstrate)

- Consistent style across pages
- Responsive (mobile + desktop)
- Board cell states:
  - Unselected / Selected / Incorrect / Hover variants
- Usable navigation (navbar or equivalent)

### Bonus (optional)

- **Local storage** persistence (Context is the only place allowed to touch `localStorage`)
- **Backtracking** generation ensuring unique solution
- **Hint system** (find a square with only one valid input)

## Planned workflow (best-practice implementation path)

### Phase 0 — Repo + deployment readiness

- Convert from static multi-page HTML into a **single React SPA**.
- Choose a build tool (recommended: **Vite + React**) and deploy to Render (or another host).
- Add/verify:
  - `README` sections required for submission (links, run steps, writeup pointers)
  - Consistent routing for all required URLs

### Phase 1 — App skeleton (React + Router)

- Create app layout with a reusable `Navbar` and shared styling.
- Implement React Router routes exactly as required:
  - `/`, `/games`, `/games/easy`, `/games/normal`, `/rules`, `/scores`, `/login`, `/register`
- Keep non-game pages mocked but polished (consistent layout + responsive CSS).

### Phase 2 — Data model + Context store

Create a `GameContext` (or `SudokuContext`) that owns:

- **Current mode**: `"easy"` or `"normal"`
- **Board state**:
  - `givenBoard` (immutable givens)
  - `board` (current user-editable values)
  - `locked` / `isComplete`
  - `incorrectCells` (set of coordinates)
- **Timer state**:
  - `startTime`, `elapsedMs`, `isRunning`
- **Actions**:
  - `newGame(mode)`
  - `resetGame()`
  - `setCellValue(row, col, value|null)`
  - `selectCell(row, col)` (UI state)
  - `tick()` or timer start/stop actions

Goal: the board UI becomes a “dumb” view that renders state and dispatches actions to Context.

### Phase 3 — Sudoku generation (easy + normal)

- Implement a generator that produces:
  - Easy 6×6: valid puzzle + “about half” filled
  - Normal 9×9: valid puzzle + 28–30 givens
- Ensure each generated board respects:
  - row/column uniqueness
  - subgrid uniqueness (2×3 for 6×6, 3×3 for 9×9)

If time permits (bonus): implement backtracking + uniqueness checks.

### Phase 4 — Input handling + validation rules

- Inputs should accept only integer digits in the allowed range; ignore everything else.
- Compute validity:
  - On each change, recompute whether the cell violates row/col/subgrid rules
  - Mark invalid cells `Incorrect` (red border)
- Enforce:
  - Given cells cannot be edited
  - When `locked === true`, ignore further edits

### Phase 5 — Timer + win/lock behavior

- Start timer when a new game is generated (or on first user action; pick one and document the assumption).
- Stop timer on win.
- When win condition met:
  - Set `locked = true`
  - Display congratulations message
  - Optionally clear local storage (if bonus implemented)

### Phase 6 — Game controls

- Add **New Game** and **Reset** buttons to game pages.
- Reset should restore `board` to the original `givenBoard` + empty editable cells (original generated state).

### Phase 7 — Styling polish + responsiveness

- Replace static-page duplicated styles with a consistent design system:
  - Button variants, hover states, focus styles
  - Grid sizing that works on mobile and desktop
  - Clear selected cell highlight + incorrect border

### Phase 8 — Submission deliverables

- Add links in README:
  - GitHub repo
  - Render deployment
  - Video walkthrough
- Writeup (3–5 sentences each):
  - challenges
  - future improvements
  - assumptions
  - time spent
  - bonus points (with code links)

## Task breakdown (what we will change/add)

### 1) Convert to React SPA

- Add React app scaffolding (Vite)
- Move existing visual design into React components + CSS modules or organized global CSS
- Remove `<base href="...">` dependency and use Router-based navigation

### 2) Implement required pages as components

- `HomePage`
- `GameSelectionPage` (mocked list)
- `GamePage` (shared) + mode-based config
- `RulesPage` (rules + credits links)
- `ScoresPage` (mock)
- `LoginPage` (mock form)
- `RegisterPage` (mock form)

### 3) Implement Sudoku core gameplay

- Generator for 6×6 and 9×9
- Cell edit rules (givens locked, deletions allowed)
- Range filtering (ignore invalid values)
- Validation + incorrect highlighting
- Win detection + lock + message
- New Game + Reset
- Timer

### 4) React principles checklist (explicitly satisfied)

- 4+ components: e.g. `AppLayout`, `Navbar`, `GamePage`, `SudokuGrid`, `SudokuCell`, `Timer`, `Controls`
- Props: e.g. `SudokuCell` receives `row`, `col`, `value`, `isGiven`, `isIncorrect`, `isSelected`
- Nested components: `GamePage` → `SudokuGrid` → `SudokuCell`
- Child → parent data via Context: `SudokuCell` updates board through Context actions (not via callback passed down)

### 5) Optional bonus tasks (if attempted)

- **Local storage**:
  - Persist `board`, `givenBoard`, `mode`, `elapsedMs`, and `locked`
  - Read on app start; write after each action
  - Only Context touches `localStorage`
  - Clear on reset/win
- **Hint**:
  - Find a cell with exactly one legal value and highlight it
- **Backtracking uniqueness**:
  - Generate puzzles with unique solutions; link code in writeup

## Assumptions to document in the writeup (planned)

- When the timer starts (on new game vs first move)
- Exact “half filled” definition for 6×6 (e.g., 18 givens out of 36)
- How strict the “ignore invalid input” behavior is for multi-digit entries (e.g., treat as last typed digit only)

