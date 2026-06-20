function MatchTimeline({ events = [] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-950">Ball-by-ball Feed</h2>
        <p className="text-sm text-slate-500">Latest events pushed from the live match stream</p>
      </div>

      {events.length > 0 ? (
        <div className="max-h-[430px] space-y-3 overflow-auto pr-1">
          {events.map((event) => (
            <div key={event.id} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className={badgeClass(event.event_type, event.wicket)}>
                {event.wicket ? "W" : event.runs + event.extras}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">{event.ball_label}</p>
                  <p className="text-xs font-medium uppercase text-slate-400">{event.event_type}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {event.commentary || `${event.batter || "Batter"} scored ${event.runs} run(s).`}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {event.batter || "Unknown batter"} vs {event.bowler || "Unknown bowler"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          No ball-by-ball events have been recorded yet.
        </p>
      )}
    </section>
  );
}

function badgeClass(type, wicket) {
  const base = "grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-black";
  if (wicket) return `${base} bg-red-100 text-red-700`;
  if (type === "six") return `${base} bg-purple-100 text-purple-700`;
  if (type === "four") return `${base} bg-blue-100 text-blue-700`;
  return `${base} bg-emerald-100 text-emerald-700`;
}

export default MatchTimeline;
