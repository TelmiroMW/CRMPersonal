export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="h-4 w-28 rounded bg-black/10" />
          <div className="mt-2 h-3 w-20 rounded bg-black/[0.07]" />
        </div>
        <div className="h-9 w-9 rounded-full bg-black/10" />
      </div>
      <div className="mb-1 h-3 w-32 rounded bg-black/[0.07]" />
      <div className="mb-5 h-10 w-48 rounded bg-black/10" />
      <div className="flex flex-col gap-2.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass rounded-card p-4 shadow-glass">
            <div className="h-4 w-2/3 rounded bg-black/10" />
            <div className="mt-2 h-3 w-1/3 rounded bg-black/[0.07]" />
            <div className="mt-4 h-[3.5px] w-full rounded bg-black/[0.06]" />
          </div>
        ))}
      </div>
    </div>
  );
}
