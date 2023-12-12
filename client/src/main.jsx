import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import App from "./App.jsx";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Search from "./pages/Search.jsx";
import ViewPost from "./pages/ViewPost.jsx";
import EditPost from "./pages/EditPost.jsx";
import MyProfile from "./components/MyProfile.jsx";

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
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "my-profile/view-post/:postId", // this enables the authenticated user to view a single post
        element: <ViewPost />,
      },
      {
        path: "view-post/:postId",
        element: <ViewPost />,
      },
      {
        path: "view-post/:postId",
        element: <ViewPost />
      },
      {
        path: "search/view-post/:postId",
        element: <ViewPost />,
      },
      {
        path: "/edit-post/:postId",
        element: <EditPost />,
      },
      {
        path: "view-post/:postId/edit-post/:postId", //TODO check if we can avoid view-post/:postId prefix !!
        element: <EditPost />,
      },
      {
        path: "/search/view-post/:postId/edit-post/:postId", //TODO check if we can avoid view-post/:postId prefix !!
        element: <EditPost />,
      },
      {
        path: "/search/edit-post/:postId", //TODO check if we can avoid view-post/:postId prefix !!
        element: <EditPost />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
