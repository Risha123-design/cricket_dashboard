function StatsCard({ label, value, detail, accent = "emerald" }) {
  const accentClass =
    accent === "blue"
      ? "text-blue-700"
      : accent === "red"
        ? "text-red-700"
        : "text-emerald-700";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${accentClass}`}>{value}</p>
      {detail ? <p className="mt-1 text-xs text-slate-400">{detail}</p> : null}
    </div>
  );
}

export default StatsCard;
