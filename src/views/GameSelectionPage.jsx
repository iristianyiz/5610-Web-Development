import { Link } from 'react-router-dom'

const MOCK_GAMES = [
  { id: '1', name: 'Sudoku (Easy)', author: 'Morgan Vale', href: '/games/easy' },
  { id: '2', name: 'Sudoku (Normal)', author: 'Priya K. Okonkwo', href: '/games/normal' },
  { id: '3', name: 'Gridlock Classic', author: 'Theo Marquez', href: '/games/easy' },
  { id: '4', name: 'Number Garden', author: 'Sloane Whitaker', href: '/games/normal' },
  { id: '5', name: 'Cipher Squares', author: 'J. R. Holloway', href: '/games/easy' },
  { id: '6', name: 'Metro Puzzles', author: 'Elena Frost & Kai Dubois', href: '/games/normal' },
]

export function GameSelectionPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Select a Game</h1>
      <div className="card">
        <ul className="list">
          {MOCK_GAMES.map((g) => (
            <li key={g.id} className="list-item">
              <div className="list-item-main">
                <div className="list-item-title">
                  <Link to={g.href}>{g.name}</Link>
                </div>
                <div className="list-item-subtitle">By {g.author}</div>
              </div>
              <Link className="btn btn-small" to={g.href}>
                Play
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="muted">
        This page uses mocked, hardcoded data per the PDF.
      </p>
    </div>
  )
}

