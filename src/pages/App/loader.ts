import { redirect } from "react-router";
import { getSession } from "@/api/auth";
import { fetchNotes } from "@/api/notes";

export const loaderApp = async () => {
  const session = await getSession();

  if (!session.isAuthenticated) {
    return redirect("/login");
  }
  const notes = await fetchNotes();

  return {
    user: session.user,
    isAuthenticated: true,
    notes,
  };
};