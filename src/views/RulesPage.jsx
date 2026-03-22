export function RulesPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Rules</h1>
      <div className="card prose">
        <h2>Goal</h2>
        <p>
          Fill every empty cell so that each row, each column, and each <strong>sub-grid</strong> contains
          every allowed digit exactly once—with no repeats and no missing numbers when you are done.
        </p>

        <h2>How to play</h2>
        <ul>
          <li>
            <strong>Given cells</strong> (pre-filled when the puzzle starts) are fixed: you cannot change them.
          </li>
          <li>
            <strong>Empty cells</strong> are yours to fill. You may change a value you entered, or clear a cell
            (delete the number) and try again.
          </li>
          <li>
            Only digits in the valid range for your mode count. Anything outside that range is ignored.
          </li>
        </ul>

        <h2>Easy mode (6×6)</h2>
        <ul>
          <li>The board is <strong>6 rows × 6 columns</strong>.</li>
          <li>Use digits <strong>1 through 6</strong> only.</li>
          <li>
            The board is divided into six <strong>2×3</strong> blocks (sub-grids). Each block must contain 1–6
            exactly once, just like every row and column.
          </li>
        </ul>

        <h2>Normal mode (9×9)</h2>
        <ul>
          <li>The board is <strong>9 rows × 9 columns</strong>.</li>
          <li>Use digits <strong>1 through 9</strong> only.</li>
          <li>
            The board is divided into nine <strong>3×3</strong> blocks. Each block must contain 1–9 exactly
            once, along with every row and column.
          </li>
        </ul>

        <h2>Valid vs invalid moves</h2>
        <ul>
          <li>
            A placement breaks the rules if the same digit already appears in that <strong>row</strong>,{' '}
            <strong>column</strong>, or <strong>sub-grid</strong>. In this app, those cells are highlighted so
            you can spot conflicts.
          </li>
          <li>Fix a conflict by changing or removing one of the clashing values.</li>
        </ul>

        <h2>Winning</h2>
        <p>
          You win when every cell is filled, every digit follows the rules above, and there are no conflicts.
          The board then locks and a congratulations message appears.
        </p>

        <h2>Timer &amp; controls</h2>
        <ul>
          <li>
            <strong>Time elapsed</strong> is shown while you play (your progress may be saved in the browser
            if you refresh mid-game).
          </li>
          <li>
            <strong>New Game</strong> starts a brand-new puzzle for the current mode.
          </li>
          <li>
            <strong>Reset</strong> restores the puzzle to how it looked when it was first generated (given
            numbers plus empty cells), without starting a different puzzle.
          </li>
          <li>
            <strong>Hint</strong> (if available) highlights one empty cell that has only one legal digit left,
            based on the current board.
          </li>
        </ul>

        <h2>Credits</h2>
        <p>
          <strong>Made by</strong> Iris Zhang &amp; Faith Zhang.
        </p>
        <p className="muted" style={{ marginTop: '0.5rem' }}>
          Contact Us Here:
        </p>
        <ul>
          <li>
            Email:{' '}
            <a href="mailto:sudoku.master.demo@example.com">sudoku.master.demo@example.com</a>
          </li>
          <li>
            GitHub:{' '}
            <a href="https://github.com/example-sudoku-team" target="_blank" rel="noreferrer">
              github.com/example-sudoku-team
            </a>
          </li>
          <li>
            LinkedIn:{' '}
            <a href="https://www.linkedin.com/in/example-profile" target="_blank" rel="noreferrer">
              linkedin.com/in/example-profile
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
