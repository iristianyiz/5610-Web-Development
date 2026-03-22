import { useSudoku } from './SudokuContext.jsx'

export function SudokuCell({
  row,
  col,
  value,
  isGiven,
  isIncorrect,
  isSelected,
  isHint,
  isBoxRight,
  isBoxBottom,
}) {
  const { state, actions } = useSudoku()
  const maxVal = state.size || 9

  const handleChange = (e) => {
    const raw = e.target.value
    if (raw === '') {
      actions.setCellValue(row, col, null)
      return
    }
    // Extract only digit characters, take the last one typed
    const digits = raw.replace(/\D/g, '')
    if (!digits) return
    const n = parseInt(digits.slice(-1), 10)
    if (n >= 1 && n <= maxVal) {
      actions.setCellValue(row, col, n)
    }
    // Out-of-range: controlled input restores the old value automatically
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      actions.setCellValue(row, col, null)
    }
  }

  const handleFocus = () => {
    if (!isGiven && !state.locked) {
      actions.selectCell({ row, col })
    }
  }

  const handleBlur = () => {
    actions.selectCell(null)
  }

  let cellClass = 'cell'
  if (isGiven) cellClass += ' given'
  if (isIncorrect && !isGiven) cellClass += ' incorrect'
  if (isSelected) cellClass += ' selected'
  if (isHint && !isGiven && !state.locked) cellClass += ' hint'
  if (isBoxRight) cellClass += ' box-right'
  if (isBoxBottom) cellClass += ' box-bottom'

  return (
    <div className={cellClass}>
      <input
        className="cell-input"
        type="text"
        inputMode="numeric"
        value={value ?? ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={isGiven || state.locked}
        aria-label={`Row ${row + 1} Column ${col + 1}`}
      />
    </div>
  )
}
