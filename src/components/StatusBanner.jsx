import { AlertIcon, ArrowRightIcon, CheckCircleIcon } from "./icons.jsx";

export default function StatusBanner({ result }) {
  const { student, overall, probation } = result;
  const onProbation = probation.is_probation;

  return (
    <section
      className={`animate-fade-up relative overflow-hidden rounded-2xl border p-6 sm:p-7 ${
        onProbation
          ? "border-rose-500/30 bg-gradient-to-br from-rose-500/15 via-slate-900/70 to-slate-900/70"
          : "border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-slate-900/70 to-slate-900/70"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ${
              onProbation
                ? "bg-rose-500/15 text-rose-400 ring-rose-500/30"
                : "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
            }`}
          >
            {onProbation ? (
              <AlertIcon className="h-7 w-7" />
            ) : (
              <CheckCircleIcon className="h-7 w-7" />
            )}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Probation Status
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              {student.name && student.name !== "Student" ? student.name : "Student Case"}
            </h2>
            {student.roll && student.roll !== "N/A" ? (
              <p className="mt-0.5 text-sm text-slate-400">
                Roll No {student.roll}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
              <span className="badge rounded-full border border-slate-600/60 bg-slate-800/60 px-2.5 py-1 text-slate-300">
                {probation.previous_status}
              </span>
              <ArrowRightIcon className="h-3.5 w-3.5 text-slate-500" />
              <span
                className={`badge rounded-full border px-2.5 py-1 ${
                  onProbation
                    ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
                    : "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                }`}
              >
                {probation.current_status}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 lg:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            New CGPA
          </p>
          <p
            className={`font-display text-5xl font-extrabold tracking-tight ${
              onProbation ? "text-rose-300" : "text-emerald-300"
            }`}
          >
            {overall.new_cgpa.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Previous: {student.prev_cgpa.toFixed(2)} &middot; Pass &ge; 2.00
          </p>
        </div>
      </div>
    </section>
  );
}
