import { Modal } from "bootstrap/dist/js/bootstrap.min.js";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const LoginForm = () => {
  const [formState, setFormState] = useState({ userName: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);
// usestate to handing updates in the login form below
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };
// This section is to handing submitting the form and authenticating the user
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // Using a mutation for login and assigning the data to data.
      const { data } = await login({
        variables: { ...formState },
      });

// Checking if data is falsey on login and will reset the username and password if so
      if (!data.login) {
        setFormState({
          userName: "",
          password: "",
        });

        const modalDiv = document.querySelector(".alert-modal-login");
        const alertModal = modalDiv.querySelector("#alertModal")
        const bootstrapModal = new Modal(alertModal);
        bootstrapModal.show();
        return;
      }
// Attempt to verify login with token
      Auth.login(data.login.token);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
// reset form
    setFormState({
      userName: "",
      password: "",
    });
  };

  return (
    <>
    {/* useState for handleChange to update username and password when typing it in */}
      <form className="loginForm" onSubmit={handleFormSubmit}>
        <div className="mb-5">
          <label htmlFor="lUsername" className="form-label mb-3">
            Username
          </label>
          <input
            id="lUsername"
            className="form-control mb-3"
            required
            type="text"
            name="userName"
            value={formState.userName}
            onChange={handleChange}
          />
          <label htmlFor="lPassword" className="form-label">
            Password
          </label>
          <input
            id="lPassword"
            className="form-control mb-3"
            required
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
          />
          <button
            id="lbtn"
            type="submit"
            className="btn btn-primary button-submit"
            style={{ cursor: "pointer" }}
          >
            Login
          </button>
        </div>
      </form>
      {error && (
        <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
      )}
    </>
  );
};

export default LoginForm;

