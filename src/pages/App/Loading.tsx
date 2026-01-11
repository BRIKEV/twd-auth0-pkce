function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="flex h-full min-h-screen items-center justify-center px-6">
        <div className="flex items-center gap-3 text-lg font-medium">
          <span className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/5">
            <span className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </span>
          Loading your session...
        </div>
      </div>
    </div>
  );
}

export default Loading;