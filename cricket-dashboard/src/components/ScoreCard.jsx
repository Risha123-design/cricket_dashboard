function ScoreCard({ match }) {
  const team1Score = Number(match.team1_score || 0);
  const team2Score = Number(match.team2_score || 0);
  const leader =
    team1Score === team2Score
      ? "Level"
      : team1Score > team2Score
        ? match.team1
        : match.team2;

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-950">
            {match.team1} vs {match.team2}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">Overs: {match.overs ?? "0.0"}</p>
        </div>
        <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
          LIVE
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white p-3">
          <p className="truncate text-xs font-semibold text-slate-500">{match.team1}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {team1Score}/{match.team1_wickets || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-3">
          <p className="truncate text-xs font-semibold text-slate-500">{match.team2}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {team2Score}/{match.team2_wickets || 0}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
        <span className="text-slate-500">Current edge</span>
        <span className="font-semibold text-slate-900">{leader}</span>
      </div>
    </article>
  );
}

export default ScoreCard;
