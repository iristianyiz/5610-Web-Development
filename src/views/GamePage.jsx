import { useEffect } from 'react'
import { useSudoku } from '../sudoku/SudokuContext.jsx'
import { SudokuGrid } from '../sudoku/SudokuGrid.jsx'
import { Timer } from '../ui/Timer.jsx'

export function GamePage({ mode }) {
  const { state, actions } = useSudoku()

  useEffect(() => {
    // In dev, React StrictMode intentionally re-runs effects on mount.
    // Guard so we don't generate a new board twice (causes visible "blinking").
    if (state.mode !== mode) actions.newGame(mode)
  }, [actions, mode, state.mode])

  const title = mode === 'easy' ? 'Easy Game (6×6)' : 'Normal Game (9×9)'

  return (
    <div className={`container page game-page ${mode === 'easy' ? 'game--easy' : 'game--normal'}`}>
      <div className="game-top">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="card game-layout">
        {!state.board ? (
          <p className="muted">Generating puzzle…</p>
        ) : (
          <>
            <section className="game-board" aria-label="Sudoku board">
              {state.isComplete && (
                <div className="congrats">Congratulations! You solved the puzzle!</div>
              )}
              <SudokuGrid />
            </section>

            <aside className="game-panel" aria-label="Game controls">
              <div className="panel-block">
                <Timer />
              </div>
              <div className="panel-block">
                <div className="game-controls">
                  <button
                    className="btn btn-secondary"
                    onClick={() => actions.hint()}
                    disabled={state.isComplete}
                  >
                    Hint
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => actions.resetGame()}
                    disabled={state.isComplete}
                  >
                    Reset
                  </button>
                  <button className="btn" onClick={() => actions.newGame(mode)}>
                    New Game
                  </button>
                </div>
                {state.hintStatus === 'not-found' && (
                  <p className="muted panel-note">No single-candidate hint available right now.</p>
                )}
              </div>
              <div className="panel-block panel-help">
                <div className="panel-help-title">Quick tips</div>
                <ul className="panel-help-list">
                  <li>Use numbers {mode === 'easy' ? '1–6' : '1–9'}.</li>
                  <li>Red cells break a Sudoku rule.</li>
                  <li>Reset returns to the original puzzle.</li>
                </ul>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  )
}
