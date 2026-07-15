function SkeletonLoader() {
  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <div className="rounded-3xl bg-[#1C2541] p-6 shadow-lg shadow-black/30">
        <div className="space-y-5">
          <div className="h-12 w-3/4 rounded-2xl bg-slate-700/70 animate-pulse" />
          <div className="h-10 w-1/2 rounded-2xl bg-slate-700/70 animate-pulse" />
          <div className="space-y-4">
            <div className="h-24 rounded-3xl bg-slate-700/70 animate-pulse" />
            <div className="h-24 rounded-3xl bg-slate-700/70 animate-pulse" />
          </div>
          <div className="h-16 rounded-3xl bg-slate-700/70 animate-pulse" />
        </div>
      </div>

      <div className="rounded-3xl bg-[#1C2541] p-6 shadow-lg shadow-black/30">
        <div className="h-5 w-1/4 rounded-full bg-slate-700/70 animate-pulse" />
        <div className="mt-6 h-[340px] rounded-3xl bg-slate-700/70 animate-pulse" />
      </div>
    </div>
  );
}

export default SkeletonLoader;
