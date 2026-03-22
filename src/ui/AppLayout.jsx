import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar.jsx'

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 Sudoku Master. All rights reserved.</p>
      </footer>
    </div>
  )
}

