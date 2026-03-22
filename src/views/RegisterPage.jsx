export function RegisterPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Register</h1>
      <div className="card">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <div className="label">Username</div>
            <input className="input" type="text" name="username" autoComplete="username" />
          </label>
          <label className="field">
            <div className="label">Password</div>
            <input className="input" type="password" name="password" autoComplete="new-password" />
          </label>
          <label className="field">
            <div className="label">Verify password</div>
            <input className="input" type="password" name="verifyPassword" autoComplete="new-password" />
          </label>
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
      </div>
      <p className="muted">Per the assignment requirements, this page is mostly mocked (no real registration yet).</p>
    </div>
  )
}

