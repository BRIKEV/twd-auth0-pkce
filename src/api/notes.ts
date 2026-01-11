import { api } from "./client";

export type Note = {
  id: number;
  userId: string;
  title: string;
  content: string;
  createdAt: number | null;
};

export async function fetchNotes(token: string) {
  const { data } = await api.get<{ notes: Note[] }>("/api/notes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.notes;
}

export async function createNote(token: string, payload: { title: string; content?: string }) {
  const { data } = await api.post<{ note: Note }>("/api/notes", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.note;
}
