import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="container page">
      <section className="hero">
        <h1>Sudoku Master</h1>
        <p>Challenge your mind with the classic number puzzle game.</p>
        <div className="cta-row">
          <Link className="btn" to="/games">
            Start Playing
          </Link>
          <Link className="btn btn-secondary" to="/rules">
            Learn the Rules
          </Link>
        </div>
        <div className="home-art" aria-hidden="true">
          <img className="home-art-img" src="/chessboard.svg" alt="" />
        </div>
      </section>
    </div>
  )
}

