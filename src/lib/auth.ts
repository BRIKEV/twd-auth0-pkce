import { getSession } from "@/api/auth";
import { fetchNotes } from "@/api/notes";

export async function rootLoader() {
  const session = await getSession();

  if (!session.isAuthenticated) {
    return { user: {}, isAuthenticated: false, notes: [] };
  }

  let notes: Awaited<ReturnType<typeof fetchNotes>> = [];
  try {
    notes = await fetchNotes();
  } catch {
    notes = [];
  }

  return {
    user: session.user,
    isAuthenticated: true,
    notes,
  };
}