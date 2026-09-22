import { useEffect, useState } from "react";
import { BulbIcon, CheckCircleIcon, SpinnerIcon } from "./icons.jsx";

const typeConfig = {
  GRACE_CLEARS: {
    ring: "from-emerald-500/50 via-teal-500/40 to-emerald-500/50",
    icon: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  },
  COMBO_CLEARS: {
    ring: "from-teal-500/50 via-cyan-500/40 to-teal-500/50",
    icon: "bg-teal-500/15 text-teal-400 ring-teal-500/30",
  },
  NO_COMBO: {
    ring: "from-rose-500/50 via-red-500/40 to-rose-500/50",
    icon: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
  },
  REQUIRED_GPA: {
    ring: "from-indigo-500/50 via-violet-500/40 to-fuchsia-500/50",
    icon: "bg-indigo-500/15 text-indigo-400 ring-indigo-500/30",
  },
  NO_ELIGIBLE: {
    ring: "from-slate-600/50 via-slate-500/40 to-slate-600/50",
    icon: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
  },
};

export default function Recommendation({
  recommendation,
  isProbation,
  onNextCreditsChange,
  recalculating = false,
}) {
  const [credits, setCredits] = useState(
    String(recommendation?.next_credits ?? 15)
  );

  // update the input when the backend sends a new value
  useEffect(() => {
    if (recommendation?.next_credits != null) {
      setCredits(String(recommendation.next_credits));
    }
  }, [recommendation?.next_credits]);

  function submitCredits() {
    const value = Number(credits);
    if (!value || Number.isNaN(value) || value <= 0) return;
    onNextCreditsChange?.(value);
  }

  // no probation case, so nothing to recommend
  if (!recommendation) {
    if (!isProbation) {
      return (
        <section className="animate-fade-up rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Department Recommendation
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                No probation case. The student is in good standing and no
                department action is required this semester.
              </p>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  const config = typeConfig[recommendation.type] || typeConfig.NO_ELIGIBLE;

  return (
    <section
      className={`animate-fade-up rounded-2xl bg-gradient-to-r p-px shadow-xl shadow-black/20 ${config.ring}`}
    >
      <div className="rounded-[15px] bg-slate-900/95 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${config.icon}`}
          >
            <BulbIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold text-white">
              Department Recommendation
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">
              {recommendation.message}
            </p>

            {recommendation.type === "GRACE_CLEARS" ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-700/70 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Best course:{" "}
                  <strong className="font-semibold text-white">
                    {recommendation.best_course}
                  </strong>
                </span>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Expected CGPA: {recommendation.expected_cgpa.toFixed(2)}
                </span>
              </div>
            ) : null}

            {recommendation.type === "COMBO_CLEARS" ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-700/70 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Grace in:{" "}
                  <strong className="font-semibold text-white">
                    {recommendation.courses.join(" + ")}
                  </strong>
                </span>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Expected CGPA: {recommendation.expected_cgpa.toFixed(2)}
                </span>
              </div>
            ) : null}

            {recommendation.type === "NO_COMBO" ? (
              <div className="mt-3">
                <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
                  Best achievable CGPA:{" "}
                  {recommendation.best_achievable_cgpa.toFixed(2)} (need 2.00)
                </span>
              </div>
            ) : null}

            {recommendation.type === "REQUIRED_GPA" ? (
              <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/[0.08] px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                      Required GPA next semester
                    </p>
                    <p className="font-display text-3xl font-extrabold text-white">
                      {recommendation.required_gpa.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400">
                      Credits planned next semester
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitCredits()}
                        className="w-24 rounded-lg border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/25"
                      />
                      <button
                        type="button"
                        onClick={submitCredits}
                        disabled={recalculating || !(Number(credits) > 0)}
                        className="flex items-center gap-1.5 rounded-lg bg-indigo-500/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {recalculating ? (
                          <SpinnerIcon className="h-3.5 w-3.5" />
                        ) : null}
                        Recalculate
                      </button>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                      GPA needed to reach CGPA 2.00 assuming this many credits
                      next semester.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
