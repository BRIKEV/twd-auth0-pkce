import { type ActionFunctionArgs } from "react-router";
import { createNote } from "@/api/notes";

export async function actionApp({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("_action");

  if (intent !== "create-note") {
    return null;
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");

  if (!title) {
    return { ok: false, error: "Title is required" };
  }

  const note = await createNote({ title, content });
  return { ok: true, note };
}