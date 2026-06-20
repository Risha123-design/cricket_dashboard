import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import AiInsights from "../components/AiInsights";
import LiveScoreboard from "../components/LiveScoreboard";
import MatchTimeline from "../components/MatchTimeline";
import Navbar from "../components/Navbar";
import Players from "../components/Players";
import RunRateChart from "../components/RunRateCharts";
import Teams from "../components/Teams";
import TeamStats from "../components/TeamStats";
import WinProbabilityChart from "../components/WinProbabilityChart";

function Dashboard() {
  const [payload, setPayload] = useState({
    matches: [],
    selected_match: null,
    events: [],
    prediction: null,
    summary: "",
    insights: [],
  });
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [connection, setConnection] = useState("connecting");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const url = selectedMatchId ? `/api/dashboard/?match_id=${selectedMatchId}` : "/api/dashboard/";
        const res = await axios.get(url);
        if (mounted) {
          setPayload(normalizePayload(res.data));
          setError("");
        }
      } catch (err) {
        if (mounted) {
          setError("Unable to load dashboard data from the backend.");
          console.error(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [selectedMatchId]);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/score/");

    socket.onopen = () => setConnection("live");
    socket.onclose = () => setConnection("offline");
    socket.onerror = () => setConnection("offline");
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.payload) {
          setPayload(normalizePayload(message.payload));
          setError("");
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    return () => socket.close();
  }, []);

  const matches = payload.matches;
  const selectedMatch = payload.selected_match || matches[0] || null;

  const totals = useMemo(() => {
    return matches.reduce(
      (summary, match) => ({
        runs: summary.runs + Number(match.team1_score || 0) + Number(match.team2_score || 0),
        live: summary.live + (match.status === "live" ? 1 : 0),
        overs: summary.overs + Number(match.overs || 0),
      }),
      { runs: 0, live: 0, overs: 0 }
    );
  }, [matches]);

  const metrics = [
    { label: "Live Matches", value: totals.live, detail: `${matches.length} total fixtures` },
    { label: "Total Runs", value: totals.runs, detail: "Across tracked matches" },
    { label: "Overs Tracked", value: totals.overs.toFixed(1), detail: "From active scorecards" },
    { label: "Socket", value: connection === "live" ? "Live" : "Offline", detail: "Django Channels feed" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Live cricket command center
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">
                Real-time Cricket Analytics Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Track scores, ball-by-ball events, win probability, AI summaries, and team performance from one live view.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                value={selectedMatchId}
                onChange={(event) => setSelectedMatchId(event.target.value)}
              >
                <option value="">Latest match</option>
                {matches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.team1} vs {match.team2}
                  </option>
                ))}
              </select>

              <div className={connectionBadge(connection)}>
                <span className="h-2.5 w-2.5 rounded-full bg-current" />
                {connection === "live" ? "WebSocket live" : "HTTP fallback"}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
              <p className="text-sm font-medium text-slate-500">{metric.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-950">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-400">{metric.detail}</p>
            </div>
          ))}
        </section>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-6">
            {loading ? (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-card">
                <h2 className="font-bold text-slate-900">Loading live dashboard</h2>
                <p className="mt-1 text-sm text-slate-500">Connecting to Django and Channels.</p>
              </div>
            ) : (
              <LiveScoreboard match={selectedMatch} />
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <RunRateChart events={payload.events} matches={matches} />
              <WinProbabilityChart prediction={payload.prediction} match={selectedMatch} />
            </div>

            <Teams />
          </div>

          <aside className="space-y-6">
            <AiInsights summary={payload.summary} insights={payload.insights} />
            <MatchTimeline events={payload.events} />
            <TeamStats />
            <Players />
          </aside>
        </section>
      </main>
    </div>
  );
}

function normalizePayload(data) {
  return {
    matches: Array.isArray(data?.matches) ? data.matches : [],
    selected_match: data?.selected_match || null,
    events: Array.isArray(data?.events) ? data.events : [],
    prediction: data?.prediction || null,
    summary: data?.summary || "",
    insights: Array.isArray(data?.insights) ? data.insights : [],
  };
}

function connectionBadge(connection) {
  const base = "flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold";
  if (connection === "live") {
    return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
  }
  return `${base} border-amber-200 bg-amber-50 text-amber-700`;
}

export default Dashboard;
