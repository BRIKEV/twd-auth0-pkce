import Auth from "@/hooks/useAuth";
import { Button } from "./ui/button";

const LoginButton = () => {
  const { loginWithRedirect } = Auth.useAuth();
  return (
    <Button 
      size="lg"
      className="w-full border border-white/15 bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:bg-cyan-400"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </Button>
  );
};

export default LoginButton;
