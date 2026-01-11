import { api } from "./client";

export type Note = {
  id: number;
  userId: string;
  title: string;
  content: string;
  createdAt: number | null;
};

export async function fetchNotes() {
  const { data } = await api.get<{ notes: Note[] }>("/api/notes");
  return data.notes;
}

export async function createNote(payload: { title: string; content?: string }) {
  const { data } = await api.post<{ note: Note }>("/api/notes", payload);
  return data.note;
}
