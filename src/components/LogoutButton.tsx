import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full border-white/30 bg-white/5 text-white hover:bg-white/10"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;