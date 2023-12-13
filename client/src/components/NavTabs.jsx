import { Link, useLocation } from "react-router-dom";
import Login from "./Login";
import CreatePost from "./CreatePost";
import Auth from "../utils/auth";
import '../App.css'; // Import the App.css file

function NavTabs() {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  const currentPage = useLocation().pathname;

  return (
    <>
      <CreatePost />
      <nav className="navbar navbar-expand-lg ">
        <Login />
        <div className="container-fluid">
          <Link
            to="/" className="nav-link custom-nav navbar-brand">
            <div className="readit-logo">
              <img src="/READIT_LOGO-01.svg" width={50} className="me-3" />
              ReadIt
            </div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars fs-2"></i>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav text-center">
              <li className="nav-item">
                <Link
                  to="/"
                  className={
                    currentPage === "/"
                      ? "nav-link custom-nav active"
                      : "nav-link custom-nav"
                  }
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              {Auth.loggedIn() && ( // dont show the my profile tab unless logged in
                <>
                  <li className="nav-item separator"></li>
                  <hr />
                  <li className="nav-item">
                    <Link
                      to="/my-profile"
                      className={
                        currentPage === "/my-profile"
                          ? "nav-link custom-nav active"
                          : "nav-link custom-nav"
                      }
                    >
                      My Profile
                    </Link>
                  </li>
                  <li className="nav-item separator"></li>
                  <hr />
                </>
              )}
              {Auth.loggedIn() && ( // do not show the create a post tab unless they are logged in
                <li className="nav-item">
                  <Link
                    to="#"
                    className="nav-link custom-nav"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdropCreatePost"
                  >
                    Create A Post
                  </Link>
                </li>
              )}
              <li className="nav-item separator"></li>
              <hr />
              <li className="nav-item">
                <Link
                  to="/search"
                  className={
                    currentPage === "/search"
                      ? "nav-link custom-nav active"
                      : "nav-link custom-nav"
                  }
                >
                  Search
                </Link>
              </li>
              {/* Add the separator between Search and Login/Logout */}
              <li className="nav-item separator"></li>
              <hr />
              <li className="nav-item">
                {Auth.loggedIn() ? (
                  <Link to="/" className="nav-link custom-nav" onClick={logout}>
                    Logout
                  </Link>
                ) : (
                  <Link
                    to="#"
                    className="nav-link custom-nav"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavTabs;
