import { useEffect, useState } from "react";

function TeamStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    let mounted = true;

    fetch("/api/team-stats/")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          setStats(data || {});
        }
      })
      .catch((error) => console.error(error));

    return () => {
      mounted = false;
    };
  }, []);

  const items = [
    { label: "Total Matches", value: stats.total_matches ?? 0 },
    { label: "Total Runs", value: stats.total_runs ?? 0 },
    { label: "Live Matches", value: stats.live_matches ?? 0 },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-950">Competition Totals</h2>
        <p className="text-sm text-slate-500">Aggregate figures from stored matches</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TeamStats;
