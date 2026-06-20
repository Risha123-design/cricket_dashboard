function AiInsights({ summary, insights = [] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-950">AI Match Summary</h2>
        <p className="text-sm text-slate-500">Rule-based match intelligence from live data</p>
      </div>

      <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {summary || "No summary is available yet."}
      </p>

      <div className="mt-4 space-y-3">
        {insights.map((insight) => (
          <div key={insight.title} className={`rounded-lg border p-3 ${toneClass(insight.tone)}`}>
            <p className="text-sm font-bold">{insight.title}</p>
            <p className="mt-1 text-sm">{insight.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function toneClass(tone) {
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default AiInsights;
