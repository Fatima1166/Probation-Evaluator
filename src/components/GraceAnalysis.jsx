import { CheckCircleIcon, InfoIcon } from "./icons.jsx";

export default function GraceAnalysis({ items }) {
  return (
    <section className="animate-fade-up rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <h3 className="font-display text-base font-bold text-white">
          Grace Mark Analysis
        </h3>
        <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-2 py-0.5 text-[11px] font-semibold text-violet-300">
          Possibility Check
        </span>
      </div>
      <p className="mb-4 flex items-start gap-1.5 text-xs text-slate-500">
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Checking whether awarding grace marks to lift a course to the 50% pass
        mark (GP 1.67) can clear the student's probation.
      </p>

      <div className="grid gap-4 xl:grid-cols-2">
        {items.map((g, i) => (
          <div
            key={i}
            className={`rounded-xl border p-4 ${
              g.can_pass
                ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                : "border-rose-500/25 bg-rose-500/[0.05]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-slate-100">{g.name}</h4>
              <span
                className={`badge flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  g.can_pass
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-400"
                }`}
              >
                {g.can_pass ? <CheckCircleIcon className="h-3 w-3" /> : null}
                {g.can_pass ? "Can Pass" : "Still on Probation"}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {g.marks}/{g.total} &middot; {g.pct.toFixed(1)}% &middot;{" "}
              {g.credits} credits
            </p>

            <dl className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Needed to pass (50%)</dt>
                <dd className="font-medium tabular-nums text-slate-200">
                  {g.needed.toFixed(2)} marks
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Grace marks required</dt>
                <dd className="font-medium tabular-nums text-amber-300">
                  {g.grace_marks.toFixed(2)} marks
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Grade point change</dt>
                <dd className="font-medium tabular-nums text-slate-200">
                  {g.old_gp.toFixed(2)}{" "}
                  <span className="text-slate-500">→</span>{" "}
                  <span className="text-emerald-400">
                    {g.new_gp.toFixed(2)}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Expected CGPA if granted</dt>
                <dd
                  className={`font-bold tabular-nums ${
                    g.can_pass ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {g.hypothetical_cgpa.toFixed(2)}
                  <span className="ml-1 font-normal text-slate-500">
                    (need 2.00)
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
