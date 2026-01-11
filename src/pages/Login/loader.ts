import { redirect } from "react-router";
import { getSession } from "@/api/auth";

export async function loaderLogin() {
  const session = await getSession();
  if (session.isAuthenticated) {
    return redirect("/");
  }
  return null;
}
