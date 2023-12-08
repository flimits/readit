export default function loginForm() {
  return (
    <>
      <div className="mx-2">
        <form className="loginForm">
          <div className="mb-5">
            <label htmlFor="lUsername" className="form-label mb-3">
              Username
            </label>
            <input type="text" className="form-control mb-3" id="lUsername" />
            <label htmlFor="lPassword" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control mb-3"
              id="lPassword"
            />
            <button type="button" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
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
            <input
              type="password"
              className="form-control mb-3"
              id="sPassword"
            />
            <button type="button" className="btn btn-primary">
              SignUp
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
