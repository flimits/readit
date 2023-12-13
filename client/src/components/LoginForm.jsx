import { Modal } from "bootstrap/dist/js/bootstrap.min.js";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";
import Alert from "./Alert";

const LoginForm = () => {
  const ALERT_TEXT = "Invalid Credentials";
  const [formState, setFormState] = useState({ userName: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      console.log(data);

      if (!data.login) {
        setFormState({
          userName: "",
          password: "",
        });

        const modalDiv = document.querySelector(".alert-modal-login");
        // console.log("modal:", modalDiv);
        const alertModal = modalDiv.querySelector("#alertModal")
        const bootstrapModal = new Modal(alertModal);
        bootstrapModal.show();
        return;
      }

      Auth.login(data.login.token);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }

    setFormState({
      userName: "",
      password: "",
    });
  };

  return (
    <>
      <div className="alert-modal-login" ><Alert alert={ALERT_TEXT} centered={true} /></div>
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
            className="btn btn-primary"
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

