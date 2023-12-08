import { Link, useLocation } from "react-router-dom";
import Login from "../pages/Login";

function NavTabs() {
  const currentPage = useLocation().pathname;

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <Login />
        <div className="container-fluid">
          <Link
            to="/"
            className={
              currentPage === "/"
                ? "nav-link custom-nav navbar-brand active"
                : "nav-link custom-nav navbar-brand"
            }
          >
            ReadIt
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
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
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
              <li className="nav-item">
                <Link
                  to="/my-posts"
                  className={
                    currentPage === "/my-posts"
                      ? "nav-link custom-nav active"
                      : "nav-link custom-nav"
                  }
                >
                  My Posts
                </Link>
              </li>
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
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavTabs;
