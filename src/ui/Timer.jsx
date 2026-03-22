import { useEffect, useState } from 'react'
import { useSudoku } from '../sudoku/SudokuContext.jsx'

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const secs = (totalSeconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

export function Timer() {
  const { state } = useSudoku()
  const [display, setDisplay] = useState('00:00')

  useEffect(() => {
    if (!state.timerStart) return

    const update = () => setDisplay(formatTime(Date.now() - state.timerStart))
    update()

    if (!state.timerActive) return

    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [state.timerStart, state.timerActive])

  if (!state.timerStart) return null

  return (
    <div className="timer">
      <span className="timer-label">Time Elapsed</span>
      <span className="timer-value">{display}</span>
    </div>
  )
}
