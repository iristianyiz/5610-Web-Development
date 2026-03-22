import { SudokuCell } from './SudokuCell.jsx'
import { useSudoku } from './SudokuContext.jsx'

function getBoxShape(size) {
  return size === 9 ? { boxR: 3, boxC: 3 } : { boxR: 2, boxC: 3 }
}

export function SudokuGrid() {
  const { state } = useSudoku()
  const { size, board, givens, incorrect, selected, hintCell } = state
  const { boxR, boxC } = getBoxShape(size)

  return (
    <div className="sudoku-grid" style={{ '--size': size }}>
      {board.map((row, r) =>
        row.map((value, c) => (
          <SudokuCell
            key={`${r}-${c}`}
            row={r}
            col={c}
            value={value}
            isGiven={givens?.[r]?.[c] ?? false}
            isIncorrect={incorrect?.[r]?.[c] ?? false}
            isSelected={selected?.row === r && selected?.col === c}
            isHint={hintCell?.row === r && hintCell?.col === c}
            isBoxRight={(c + 1) % boxC === 0 && c < size - 1}
            isBoxBottom={(r + 1) % boxR === 0 && r < size - 1}
          />
        )),
      )}
    </div>
  )
}
