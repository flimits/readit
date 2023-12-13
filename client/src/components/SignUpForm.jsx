import { Modal } from "bootstrap";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";
import Alert from "./Alert";

const SignUpForm = () => {
  const ALERT_TEXT = "Make sure all feilds are filled out properly";

  const [formState, setFormState] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

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
      const { data } = await addUser({
        variables: { ...formState },
      });

      console.log(data);

      if (!data.addUser) {
        setFormState({
          userName: "",
          email: "",
          password: "",
        });

        const modalDiv = document.querySelector(".alert-modal-signup");
        const alertModal = modalDiv.querySelector("#alertModal")
        const bootstrapModal = new Modal(alertModal);
        bootstrapModal.show();
        return;
      }

      Auth.login(data.addUser.token);

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    setFormState({
      userName: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      <form className="signUpForm" onSubmit={handleFormSubmit}>
        <div className="alert-modal-signup" ><Alert alert={ALERT_TEXT} centered={true} /></div>
        <div className="mb-3">
          <label htmlFor="sUsername" className="form-label mb-3">
            Username
          </label>
          <input
            id="sUsername"
            className="form-control mb-3"
            required
            name="userName"
            type="text"
            value={formState.userName}
            onChange={handleChange}
          />

          <label htmlFor="sEmail" className="form-label">
            Email address
          </label>
          <input
            id="sEmail"
            className="form-control mb-3"
            required
            name="email"
            placeholder="name@example.com"
            type="email"
            value={formState.email}
            onChange={handleChange}
          />
          <label htmlFor="sPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control mb-3"
            required
            name="password"
            id="sPassword"
            value={formState.password}
            onChange={handleChange}
          />
          <button
            id="sbtn"
            type="submit"
            className="btn btn-primary"
            style={{ cursor: "pointer" }}
          >

            SignUp
          </button>
        </div>
      </form>
      {error && (
        <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
      )}
    </>
  );
};

export default SignUpForm;
