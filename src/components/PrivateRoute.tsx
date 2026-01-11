import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router";
import Loading from "@/pages/App/Loading";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
