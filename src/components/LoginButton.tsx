import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button 
      size="lg"
      className="w-full border border-white/15 bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:bg-cyan-400"
      asChild
      onClick={() => loginWithRedirect()}
    >
      Log In
    </Button>
  );
};

export default LoginButton;
