function LiveScoreboard({ match }) {
  if (!match) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-card">
        <h2 className="text-lg font-bold text-slate-900">No match selected</h2>
        <p className="mt-1 text-sm text-slate-500">Live score data will appear when the backend has a match.</p>
      </section>
    );
  }

  const teams = [
    {
      name: match.team1,
      score: match.team1_score,
      wickets: match.team1_wickets,
      active: match.batting_team === match.team1,
    },
    {
      name: match.team2,
      score: match.team2_score,
      wickets: match.team2_wickets,
      active: match.batting_team === match.team2,
    },
  ];

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-card">
      <div className="border-b border-white/10 bg-white/5 px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-bold uppercase tracking-wide">
                {match.status || "live"}
              </span>
              <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold">
                {match.match_format}
              </span>
              {match.venue ? (
                <span className="text-xs font-medium text-slate-300">{match.venue}</span>
              ) : null}
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight">
              {match.team1} vs {match.team2}
            </h1>
          </div>

          <div className="rounded-lg bg-emerald-400 px-4 py-2 text-right text-slate-950">
            <p className="text-xs font-bold uppercase tracking-wide">Last ball</p>
            <p className="text-2xl font-black">{match.last_ball || "-"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        {teams.map((team) => (
          <div
            key={team.name}
            className={`p-5 ${team.active ? "bg-emerald-500 text-slate-950" : "bg-slate-900"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-lg font-bold">{team.name}</p>
                <p className={`mt-1 text-xs font-semibold ${team.active ? "text-emerald-950" : "text-slate-400"}`}>
                  {team.active ? "Batting now" : "Fielding"}
                </p>
              </div>
              <p className="text-4xl font-black">
                {team.score}/{team.wickets}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 border-t border-white/10 bg-white/5 p-5 sm:grid-cols-4">
        <Stat label="Overs" value={match.overs || "0.0"} />
        <Stat label="CRR" value={match.current_run_rate || 0} />
        <Stat label="RRR" value={match.required_run_rate || 0} />
        <Stat label="Target" value={match.target || "-"} />
      </div>

      <div className="grid gap-3 border-t border-white/10 p-5 md:grid-cols-3">
        <Player label="Striker" value={match.current_batter || "Not set"} />
        <Player label="Non-striker" value={match.non_striker || "Not set"} />
        <Player label="Bowler" value={match.current_bowler || "Not set"} />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-white/10 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function Player({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
    </div>
  );
}

export default LiveScoreboard;
