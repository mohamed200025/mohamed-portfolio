export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="h-10 w-40 animate-pulse rounded-lg bg-white/10" />
          <div className="hidden gap-2 lg:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-32 lg:px-8">
        <div className="mb-8 h-10 w-36 animate-pulse rounded-lg bg-white/10" />
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-full bg-cyan-500/20" />
            <div className="h-14 w-3/4 animate-pulse rounded-xl bg-white/10" />
            <div className="h-6 w-1/2 animate-pulse rounded-lg bg-white/5" />
            <div className="h-24 w-full animate-pulse rounded-xl bg-white/5" />
            <div className="flex gap-3">
              <div className="h-12 w-36 animate-pulse rounded-xl bg-white/10" />
              <div className="h-12 w-32 animate-pulse rounded-xl bg-white/5" />
            </div>
          </div>
          <div className="aspect-[16/10] animate-pulse rounded-2xl bg-white/[0.06]" />
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  );
}
