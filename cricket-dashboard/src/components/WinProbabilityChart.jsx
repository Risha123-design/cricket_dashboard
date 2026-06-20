import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function WinProbabilityChart({ prediction, match }) {
  const data = [
    { name: match?.team1 || "Team 1", value: prediction?.team1_probability ?? 50 },
    { name: match?.team2 || "Team 2", value: prediction?.team2_probability ?? 50 },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-950">Win Probability</h2>
        <p className="text-sm text-slate-500">{prediction?.reason || "Waiting for prediction data"}</p>
      </div>

      <div className="grid items-center gap-4 md:grid-cols-[190px_minmax(0,1fr)]">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76}>
                <Cell fill="#059669" />
                <Cell fill="#2563eb" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name}>
              <div className="mb-1 flex justify-between text-sm font-semibold text-slate-700">
                <span>{item.name}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full ${index === 0 ? "bg-emerald-600" : "bg-blue-600"}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Confidence: {prediction?.confidence || "low"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default WinProbabilityChart;
