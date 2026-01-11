import { createBrowserRouter } from "react-router";
import App from "./pages/App/App";
import LoginPage from "./pages/Login/Login";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  }
]);

export { router };