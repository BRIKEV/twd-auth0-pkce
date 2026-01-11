import { Button } from "./ui/button";

const LogoutButton = () => {
  return (
    <form action="/auth/logout" method="post">
      <Button
        variant="outline"
        size="lg"
        className="w-full border-white/30 bg-white/5 text-white hover:bg-white/10"
        type="submit"
      >
        Log Out
      </Button>
    </form>
  );
};

export default LogoutButton;