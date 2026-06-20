import ScoreCard from "./ScoreCard";

function MatchList({ matches = [] }) {
  if (matches.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-card">
        <h2 className="text-lg font-bold text-slate-900">No matches available</h2>
        <p className="mt-1 text-sm text-slate-500">Match data will appear here once the backend is connected.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-950">All Matches</h2>
        <p className="text-sm text-slate-500">{matches.length} fixture(s) tracked</p>
      </div>
      <div className="space-y-3">
        {matches.map((match) => (
          <ScoreCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}

export default MatchList;
