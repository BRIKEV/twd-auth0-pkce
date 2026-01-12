import { useEffect, useState } from 'react';
import Auth from '@/hooks/useAuth';
import LogoutButton from '../../components/LogoutButton';
import Profile from '../../components/Profile';
import { NotesPanel } from '../../components/Notes';
import { fetchNotes, createNote, type Note } from '@/api/notes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

function App() {
  const { user, getAccessTokenSilently } = Auth.useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const refreshNotes = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await fetchNotes(token);
        setNotes(data);
      } catch (error) {
        console.error(error);
      }
    };
    refreshNotes();
  }, [getAccessTokenSilently]);

  const handleCreateNote = async (title: string, content: string) => {
    const token = await getAccessTokenSilently();
    await createNote(token, { title, content });
    try {
      const token = await getAccessTokenSilently();
      const data = await fetchNotes(token);
      setNotes(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
          <div className="absolute -left-8 top-10 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute right-6 top-32 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100 shadow-inner shadow-white/10">
            TWD Auth0 Playground
          </div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Authenticated area</h1>
          <p className="mx-auto max-w-2xl text-base text-slate-200/80">
            You are signed in with Auth0. Manage your profile and jot down quick notes below.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-white/15 bg-white/5 text-white shadow-lg shadow-slate-950/40 backdrop-blur">
            <CardHeader className="gap-2">
              <CardTitle className="flex items-center justify-between text-lg font-semibold">
                Profile
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100/80">Auth0</span>
              </CardTitle>
              <CardDescription className="text-slate-200/80">
                Signed in successfully. Your session is handled by Auth0 PKCE.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50">
                <span className="grid size-9 place-items-center rounded-full border border-emerald-300/50 bg-emerald-500/20 text-lg">✅</span>
                You are authenticated
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-white/5">
                <div className="text-sm text-slate-200/70">Your profile</div>
                <Profile name={user.name} email={user.email} picture={user.picture} />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <LogoutButton />
              <p className="w-full text-center text-xs text-slate-200/70">Safe to close once you are done testing.</p>
            </CardFooter>
          </Card>

          <NotesPanel notes={notes} onCreateNote={handleCreateNote} />
        </div>
      </div>
    </div>
  );
}

export default App;