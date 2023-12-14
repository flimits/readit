import Alert from "./Alert";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function Login() {
  const ALERT_TEXT_LOGIN = "Invalid Credentials";
  const ALERT_TEXT_SIGNUP = "Make sure all fields are filled out properly";
  return (
    <>
    <div className="alert-modal-login" style={{zIndex: 9999}}><Alert alert={ALERT_TEXT_LOGIN} centered={true} /></div>
    <div className="alert-modal-signup" style={{zIndex: 9999}}><Alert alert={ALERT_TEXT_SIGNUP} centered={true} /></div>
      <div
      // Use bootstrap modal to present the login and log out
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        {/* Create two sections to the login and signup in bootstrap modal mode */}
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Login/SignUp
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="mx-2 d-flex flex-column">
              <button
                className="btn btn-secondary my-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#loginCollapse"
                aria-expanded="false"
                aria-controls="loginCollapse"
              >
                Click Here To Login
              </button>
              <div className="collapse" id="loginCollapse">
                <LoginForm />
              </div>
              <button
                className="btn btn-secondary mb-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#signUpCollapse"
                aria-expanded="false"
                aria-controls="signUpCollapse"
              >
                Click Here To SignUp
              </button>
              <div className="collapse" id="signUpCollapse">
                <SignUpForm />
              </div>
            </div>
            {/* You bootstrap to close if you don't want to do anything */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
