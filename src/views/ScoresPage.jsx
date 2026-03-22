const MOCK_SCORES = [
  { username: 'sudokuFan', completed: 12 },
  { username: 'gridMaster', completed: 9 },
  { username: 'numberNinja', completed: 7 },
  { username: 'rookieSolver', completed: 3 },
]

export function ScoresPage() {
  return (
    <div className="container page">
      <h1 className="page-title">High Scores</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Sudokus Completed</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SCORES.map((row) => (
              <tr key={row.username}>
                <td>{row.username}</td>
                <td>{row.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted">This page uses mocked, hardcoded data per the PDF.</p>
    </div>
  )
}

