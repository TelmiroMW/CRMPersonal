// The app's "signature object": phases rendered as connected segments,
// not a generic ring or bar. Completed segments are solid ink, the
// current one fills with the accent color, upcoming ones stay hollow.
export function PhaseTrack({ total, done }: { total: number; done: number }) {
  if (total === 0) return null;

  return (
    <div className="my-2.5 flex gap-[3px]">
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < done;
        const isNow = i === done && done < total;
        return (
          <div
            key={i}
            className="h-[3.5px] flex-1 overflow-hidden rounded-sm"
            style={{ background: isDone ? "rgba(10,10,10,.55)" : "rgba(10,10,10,.08)" }}
          >
            {isNow && <div className="h-full w-full rounded-sm bg-accent" />}
          </div>
        );
      })}
    </div>
  );
}
