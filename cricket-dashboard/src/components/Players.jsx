import { useEffect, useState } from "react";
import PlayerStatsChart from "./PlayerStatsChart";

function Players() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/players/")
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setPlayers(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      mounted = false;
    };
  }, []);

  const topPlayers = [...players]
    .sort((a, b) => Number(b.runs || 0) - Number(a.runs || 0))
    .slice(0, 4);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-950">Player Leaders</h2>
        <p className="text-sm text-slate-500">Top batting and bowling contributors</p>
      </div>

      {players.length > 0 ? (
        <div className="space-y-4">
          <div className="h-52">
            <PlayerStatsChart players={topPlayers} />
          </div>

          <div className="divide-y divide-slate-100">
            {topPlayers.map((player) => (
              <div key={player.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{player.name}</p>
                  <p className="text-xs text-slate-500">{player.team}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-bold text-slate-950">{player.runs} runs</p>
                  <p className="text-xs text-slate-500">{player.wickets} wickets</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          No player records available.
        </p>
      )}
    </section>
  );
}

export default Players;
