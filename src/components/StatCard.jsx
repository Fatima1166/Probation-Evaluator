export default function StatCard({ label, value, sub, primary = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        primary
          ? "border-indigo-500/40 bg-indigo-500/10 shadow-lg shadow-indigo-950/40"
          : "border-slate-800 bg-slate-900/60"
      }`}
    >
      <p
        className={`text-[11px] font-semibold uppercase tracking-wider ${
          primary ? "text-indigo-300" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p className="mt-1.5 font-display text-2xl font-bold text-white">
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
    </div>
  );
}
