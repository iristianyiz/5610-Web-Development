/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { generateSudoku } from './sudokuGenerator.js'

const SudokuContext = createContext(null)

// ── localStorage helpers (the ONLY place in the app that touches localStorage) ─

const STORAGE_KEY = 'sudoku_game_state'

function saveToStorage(state) {
  try {
    const now = Date.now()
    const payload = {
      mode: state.mode,
      size: state.size,
      givenBoard: state.givenBoard,
      board: state.board,
      givens: state.givens,
      locked: state.locked,
      isComplete: state.isComplete,
      timerActive: state.timerActive,
      // Store elapsed ms plus a timestamp so we can account for
      // time that passed between the last save and a page reload.
      timerElapsed: state.timerStart ? Math.max(0, now - state.timerStart) : 0,
      savedAt: now,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Silently ignore storage errors (e.g. private mode quota)
  }
}

function clearStorage() {
  window.localStorage.removeItem(STORAGE_KEY)
}

function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (!saved.mode || !saved.board || !saved.size) return null

    const incorrect = computeIncorrect(saved.board, saved.size)

    const baseElapsed = saved.timerElapsed ?? 0
    const extra =
      saved.timerActive && saved.savedAt
        ? Math.max(0, Date.now() - saved.savedAt)
        : 0
    const effectiveElapsed = baseElapsed + extra

    return {
      mode: saved.mode,
      size: saved.size,
      givenBoard: saved.givenBoard,
      board: saved.board,
      givens: saved.givens,
      incorrect,
      locked: saved.locked ?? false,
      isComplete: saved.isComplete ?? false,
      selected: null,
      // Restore the start timestamp so elapsed time carries over
      timerStart: Date.now() - effectiveElapsed,
      timerActive: saved.timerActive ?? false,
    }
  } catch {
    return null
  }
}

// ── Sudoku logic ──────────────────────────────────────────────────────────────

function getBoxShape(size) {
  return size === 9 ? { boxR: 3, boxC: 3 } : { boxR: 2, boxC: 3 }
}

function getCandidates(board, row, col, size) {
  if (board[row][col] != null) return []

  const used = new Set()

  for (let c = 0; c < size; c++) {
    const v = board[row][c]
    if (v != null) used.add(v)
  }
  for (let r = 0; r < size; r++) {
    const v = board[r][col]
    if (v != null) used.add(v)
  }

  const { boxR, boxC } = getBoxShape(size)
  const startR = Math.floor(row / boxR) * boxR
  const startC = Math.floor(col / boxC) * boxC
  for (let r = startR; r < startR + boxR; r++) {
    for (let c = startC; c < startC + boxC; c++) {
      const v = board[r][c]
      if (v != null) used.add(v)
    }
  }

  const candidates = []
  for (let v = 1; v <= size; v++) {
    if (!used.has(v)) candidates.push(v)
  }
  return candidates
}

function computeIncorrect(board, size) {
  const incorrect = Array.from({ length: size }, () => Array(size).fill(false))
  const { boxR, boxC } = getBoxShape(size)

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = board[r][c]
      if (v == null) continue

      for (let cc = 0; cc < size; cc++) {
        if (cc !== c && board[r][cc] === v) { incorrect[r][c] = true; break }
      }
      if (incorrect[r][c]) continue

      for (let rr = 0; rr < size; rr++) {
        if (rr !== r && board[rr][c] === v) { incorrect[r][c] = true; break }
      }
      if (incorrect[r][c]) continue

      const startR = Math.floor(r / boxR) * boxR
      const startC = Math.floor(c / boxC) * boxC
      outer: for (let rr = startR; rr < startR + boxR; rr++) {
        for (let cc = startC; cc < startC + boxC; cc++) {
          if ((rr !== r || cc !== c) && board[rr][cc] === v) {
            incorrect[r][c] = true
            break outer
          }
        }
      }
    }
  }
  return incorrect
}

function checkComplete(board, incorrect, size) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] == null) return false
      if (incorrect[r][c]) return false
    }
  }
  return true
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function emptyState() {
  return {
    mode: null,
    size: null,
    givenBoard: null,
    board: null,
    givens: null,
    incorrect: null,
    locked: false,
    isComplete: false,
    selected: null,
    hintCell: null, // { row, col, value } or null
    hintStatus: 'idle', // 'idle' | 'shown' | 'not-found'
    timerStart: null,
    timerActive: false,
  }
}

// Called once by useReducer on mount — checks localStorage first
function initState() {
  return loadFromStorage() ?? emptyState()
}

function reducer(state, action) {
  switch (action.type) {
    case 'NEW_GAME': {
      const g = generateSudoku({ mode: action.mode })
      const board = g.puzzle.map((row) => [...row])
      const incorrect = computeIncorrect(board, g.size)
      return {
        ...state,
        mode: g.mode,
        size: g.size,
        givenBoard: g.puzzle,
        board,
        givens: g.givens,
        incorrect,
        locked: false,
        isComplete: false,
        selected: null,
        hintCell: null,
        hintStatus: 'idle',
        timerStart: Date.now(),
        timerActive: true,
      }
    }
    case 'RESET_GAME': {
      if (!state.givenBoard) return state
      const board = state.givenBoard.map((row) => [...row])
      const incorrect = computeIncorrect(board, state.size)
      return {
        ...state,
        board,
        incorrect,
        locked: false,
        isComplete: false,
        selected: null,
        hintCell: null,
        hintStatus: 'idle',
        timerStart: Date.now(),
        timerActive: true,
      }
    }
    case 'SET_CELL': {
      const { row, col, value } = action
      if (!state.board || !state.givens) return state
      if (state.givens[row][col]) return state
      if (state.locked) return state

      const next = state.board.map((r) => [...r])
      next[row][col] = value
      const incorrect = computeIncorrect(next, state.size)
      const isComplete = checkComplete(next, incorrect, state.size)
      return {
        ...state,
        board: next,
        incorrect,
        isComplete,
        locked: isComplete,
        hintCell: null,
        hintStatus: 'idle',
        timerActive: isComplete ? false : state.timerActive,
      }
    }
    case 'HINT': {
      if (!state.board || !state.givens || state.locked) return state

      const candidates = []
      for (let r = 0; r < state.size; r++) {
        for (let c = 0; c < state.size; c++) {
          if (state.givens[r][c]) continue
          if (state.board[r][c] != null) continue
          const opts = getCandidates(state.board, r, c, state.size)
          if (opts.length === 1) {
            candidates.push({ row: r, col: c, value: opts[0] })
          }
        }
      }

      if (candidates.length === 0) {
        return { ...state, hintCell: null, hintStatus: 'not-found' }
      }

      const pick = candidates[Math.floor(Math.random() * candidates.length)]
      return { ...state, hintCell: pick, hintStatus: 'shown' }
    }
    case 'SELECT_CELL': {
      return { ...state, selected: action.selected }
    }
    default:
      return state
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function SudokuProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState)

  // Sync state → localStorage after every action.
  // SELECT_CELL is UI-only and doesn't need to be persisted, but saving it is harmless
  // (selected is stripped out of the saved payload anyway).
  useEffect(() => {
    if (!state.mode) return // nothing to save before a game starts

    if (state.isComplete) {
      // Requirement: clear storage when a winner is decided
      clearStorage()
      return
    }

    saveToStorage(state)
  }, [state])

  // Wrap dispatch so RESET_GAME clears storage immediately (before the new
  // state is produced), satisfying the "clear on reset" requirement.
  const wrappedDispatch = useCallback((action) => {
    if (action.type === 'RESET_GAME') clearStorage()
    dispatch(action)
  }, [])

  const newGame = useCallback((mode) => wrappedDispatch({ type: 'NEW_GAME', mode }), [wrappedDispatch])
  const resetGame = useCallback(() => wrappedDispatch({ type: 'RESET_GAME' }), [wrappedDispatch])
  const hint = useCallback(() => wrappedDispatch({ type: 'HINT' }), [wrappedDispatch])
  const setCellValue = useCallback(
    (row, col, value) => wrappedDispatch({ type: 'SET_CELL', row, col, value }),
    [wrappedDispatch],
  )
  const selectCell = useCallback(
    (selected) => wrappedDispatch({ type: 'SELECT_CELL', selected }),
    [wrappedDispatch],
  )

  const value = useMemo(
    () => ({ state, actions: { newGame, resetGame, hint, setCellValue, selectCell } }),
    [state, newGame, resetGame, hint, setCellValue, selectCell],
  )

  return <SudokuContext.Provider value={value}>{children}</SudokuContext.Provider>
}

export function useSudoku() {
  const ctx = useContext(SudokuContext)
  if (!ctx) throw new Error('useSudoku must be used within SudokuProvider')
  return ctx
}
