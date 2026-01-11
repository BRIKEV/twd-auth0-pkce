import LoginButton from "@/components/LoginButton";

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="relative isolate mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <div className="absolute -left-10 top-12 h-56 w-56 rounded-full bg-cyan-500/25 blur-3xl" />
          <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="absolute bottom-16 left-12 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>

        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 shadow-inner shadow-white/10">
            TWD Auth0 Playground
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Sign in to continue</h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-200/80">
              Authenticate with Auth0 to access your protected notes. Once signed in, you will be redirected to the app.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
