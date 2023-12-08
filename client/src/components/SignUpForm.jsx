export default function signUpForm() {
    return (
      <form className="signUpForm">
        <div className="mb-3">
          <label htmlFor="sUsername" className="form-label mb-3">
            Username
          </label>
          <input type="email" className="form-control mb-3" id="sUsername" />
          <label htmlFor="sEmail" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control mb-3"
            id="sEmail"
            placeholder="name@example.com"
          />
          <label htmlFor="sPassword" className="form-label">
            Password
          </label>
          <input type="password" className="form-control mb-3" id="sPassword" />
          <button type="submit" className="btn btn-primary">
            SignUp
          </button>
        </div>
      </form>
    );
  }