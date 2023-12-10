import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import App from "./App.jsx";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Search from "./pages/Search.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import ViewPost from "./pages/ViewPost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "create-post",
        element: <CreatePost />,
      },
      {
        path: "view-post/:postId",
        element: <ViewPost/>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
