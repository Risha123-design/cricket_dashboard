import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function RunRateChart({ events = [], matches = [] }) {
  const eventData = buildEventData(events);
  const fallbackData =
    matches.length > 0
      ? matches.map((match, index) => ({
          label: String(match.overs ?? index + 1),
          runs: Number(match.team1_score || 0) + Number(match.team2_score || 0),
          wickets: Number(match.team1_wickets || 0) + Number(match.team2_wickets || 0),
        }))
      : [
          { label: "1", runs: 8, wickets: 0 },
          { label: "2", runs: 15, wickets: 0 },
          { label: "3", runs: 28, wickets: 1 },
          { label: "4", runs: 35, wickets: 1 },
          { label: "5", runs: 47, wickets: 1 },
          { label: "6", runs: 55, wickets: 2 },
        ];

  const data = eventData.length > 0 ? eventData : fallbackData;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-950">Run Progression</h2>
        <p className="text-sm text-slate-500">Runs and wickets from the latest live events</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="runs" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="stepAfter" dataKey="wickets" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function buildEventData(events) {
  const chronological = [...events].reverse();
  let runs = 0;
  let wickets = 0;

  return chronological.map((event) => {
    runs += Number(event.runs || 0) + Number(event.extras || 0);
    wickets += event.wicket ? 1 : 0;
    return {
      label: event.ball_label || `${event.over}.${event.ball}`,
      runs,
      wickets,
    };
  });
}

export default RunRateChart;
