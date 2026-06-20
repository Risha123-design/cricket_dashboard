import { useEffect, useState } from "react";
import TeamChart from "./TeamChart";

function Teams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/teams/")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          setTeams(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Team Performance</h2>
          <p className="text-sm text-slate-500">Wins, losses, and match volume</p>
        </div>
        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          {teams.length} teams
        </span>
      </div>

      {teams.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="h-72 min-w-0">
            <TeamChart teams={teams} />
          </div>

          <div className="divide-y divide-slate-100">
            {teams.map((team) => (
              <div key={team.id} className="py-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{team.name}</h3>
                  <span className="text-sm font-bold text-emerald-700">{team.wins} wins</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <span>Matches: {team.matches_played}</span>
                  <span>Losses: {team.losses}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          No team records available.
        </p>
      )}
    </section>
  );
}

export default Teams;
