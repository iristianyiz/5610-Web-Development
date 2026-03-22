import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function NavItem({ to, children, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      onClick={onNavigate}
    >
      {children}
    </NavLink>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  return (
    <header className="app-header">
      <nav className="nav container">
        <NavLink to="/" className="nav-title" end onClick={close}>
          Sudoku Master
        </NavLink>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>

        <div className={isOpen ? 'nav-links open' : 'nav-links'}>
          <NavItem to="/" end onNavigate={close}>
            Home
          </NavItem>
          <NavItem to="/games" end onNavigate={close}>
            Select Game
          </NavItem>
          <NavItem to="/games/easy" end onNavigate={close}>
            Easy
          </NavItem>
          <NavItem to="/games/normal" end onNavigate={close}>
            Normal
          </NavItem>
          <NavItem to="/rules" onNavigate={close}>
            Rules
          </NavItem>
          <NavItem to="/scores" onNavigate={close}>
            High Scores
          </NavItem>
          <NavItem to="/login" onNavigate={close}>
            Login
          </NavItem>
          <NavItem to="/register" onNavigate={close}>
            Register
          </NavItem>
        </div>
      </nav>
    </header>
  )
}

