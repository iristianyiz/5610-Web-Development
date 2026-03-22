export function LoginPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Login</h1>
      <div className="card">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <div className="label">Username</div>
            <input className="input" type="text" name="username" autoComplete="username" />
          </label>
          <label className="field">
            <div className="label">Password</div>
            <input className="input" type="password" name="password" autoComplete="current-password" />
          </label>
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
      </div>
      <p className="muted">Per the assignment requirements, this page is mostly mocked (no real auth yet).</p>
    </div>
  )
}

