import { createBrowserRouter } from "react-router";
import App from "./pages/App/App";
import Loading from "./pages/App/Loading";
import { loaderApp } from "./pages/App/loader";
import { actionApp } from "./pages/App/actions";
import LoginPage from "./pages/Login/Login";
import { loaderLogin } from "./pages/Login/loader";

const router = createBrowserRouter([
  {
    path: "/",
    HydrateFallback: Loading,
    loader: loaderApp,
    action: actionApp,
    element: <App />,
  },
  {
    path: "/login",
    HydrateFallback: Loading,
    element: <LoginPage />,
    loader: loaderLogin,
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  }
]);

export { router };