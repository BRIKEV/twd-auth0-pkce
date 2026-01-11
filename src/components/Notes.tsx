import { useFetcher } from "react-router";
import type { Note } from "@/api/notes";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface NotesProps {
  notes: Note[];
  disabled?: boolean;
}

export function NotesPanel({ notes, disabled }: NotesProps) {
  const fetcher = useFetcher();

  const isSaving = fetcher.state === "submitting" || fetcher.state === "loading";
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetcher.submit(event.currentTarget);
  };

  return (
    <Card className="border-white/15 bg-white/5 text-white shadow-xl shadow-slate-950/40 backdrop-blur">
      <CardHeader className="gap-2">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          Notes
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100/80">Protected</span>
        </CardTitle>
        <CardDescription className="text-slate-200/80">
          Add quick notes tied to your Auth0 user.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <fetcher.Form method="post" className="space-y-3" onSubmit={onSubmit}>
          <input type="hidden" name="_action" value="create-note" />
          <input
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-300/60 focus:border-cyan-300/60 focus:outline-none"
            placeholder="Note title"
            name="title"
            disabled={disabled || isSaving}
            required
          />
          <textarea
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-300/60 focus:border-cyan-300/60 focus:outline-none"
            rows={3}
            placeholder="Optional content"
            name="content"
            disabled={disabled || isSaving}
          />
          <Button
            size="lg"
            type="submit"
            className="w-full border border-white/15 bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:bg-cyan-400 disabled:opacity-60"
            disabled={disabled || isSaving}
          >
            {isSaving ? "Saving..." : "Add note"}
          </Button>
        </fetcher.Form>

        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200/80">
              No notes yet. Add your first one.
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100/90 shadow-inner shadow-white/5"
              >
                <div className="font-semibold text-white">{note.title}</div>
                {note.content ? (
                  <div className="mt-1 whitespace-pre-wrap text-slate-200/80">{note.content}</div>
                ) : null}
                {note.createdAt ? (
                  <div className="mt-2 text-xs text-slate-300/60">
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter className="text-xs text-slate-200/70">
        Notes are served from the BFF and only available when authenticated.
      </CardFooter>
    </Card>
  );
}
