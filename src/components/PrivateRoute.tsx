import Auth from "@/hooks/useAuth";
import { Navigate } from "react-router";
import Loading from "@/pages/App/Loading";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = Auth.useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
