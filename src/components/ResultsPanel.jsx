import StatusBanner from "./StatusBanner.jsx";
import StatCard from "./StatCard.jsx";
import CourseTable from "./CourseTable.jsx";
import GraceAnalysis from "./GraceAnalysis.jsx";
import Recommendation from "./Recommendation.jsx";
import EmptyState from "./EmptyState.jsx";
import { PrintIcon, RefreshIcon, SpinnerIcon } from "./icons.jsx";

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-44 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60" />
      <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-400">
        <SpinnerIcon className="h-4 w-4" /> Generating probation report...
      </div>
    </div>
  );
}

function FinalSummary({ result, onNewEvaluation }) {
  const { student, overall, probation } = result;
  const onProbation = probation.is_probation;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
      <h3 className="font-display text-base font-bold text-white">
        Final Summary
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Student
          </p>
          <p className="mt-1 font-medium text-slate-200">
            {student.name || "Student"}{" "}
            {student.roll && student.roll !== "N/A" ? (
              <span className="text-slate-500">({student.roll})</span>
            ) : null}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            New CGPA
          </p>
          <p className="mt-1 font-display text-xl font-bold text-white">
            {overall.new_cgpa.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Status
          </p>
          <p className="mt-1">
            <span
              className={`badge inline-block rounded-full border px-3 py-0.5 text-xs font-bold tracking-wide ${
                onProbation
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {result.final.status}
            </span>
          </p>
        </div>
      </div>

      <div className="no-print mt-6 flex flex-wrap gap-3 border-t border-slate-800 pt-5">
        <button
          type="button"
          onClick={onNewEvaluation}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:brightness-110 active:scale-[0.99]"
        >
          <RefreshIcon /> New Evaluation
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          <PrintIcon /> Print Report
        </button>
      </div>
    </section>
  );
}

export default function ResultsPanel({
  result,
  loading,
  recalculating,
  onNewEvaluation,
  onNextCreditsChange,
}) {
  if (loading && !result) {
    return <LoadingSkeleton />;
  }

  if (!result) {
    return <EmptyState />;
  }

  const { student, semester, overall, probation, courses, grace_analysis, recommendation } =
    result;

  return (
    <div className="animate-fade-up space-y-6">
      <StatusBanner result={result} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Semester GPA"
          value={semester.gpa.toFixed(2)}
          sub={`${semester.credits} credit hours`}
        />
        <StatCard
          label="Quality Points"
          value={semester.points.toFixed(2)}
          sub="earned this semester"
        />
        <StatCard
          label="Total Credits"
          value={overall.total_credits}
          sub={`incl. previous ${student.prev_credits}`}
        />
        <StatCard
          label="New CGPA"
          value={overall.new_cgpa.toFixed(2)}
          sub={`was ${student.prev_cgpa.toFixed(2)}`}
          primary
        />
      </div>

      <CourseTable courses={courses} semester={semester} />

      {grace_analysis.length > 0 ? (
        <GraceAnalysis items={grace_analysis} />
      ) : null}

      <Recommendation
        recommendation={recommendation}
        isProbation={probation.is_probation}
        recalculating={recalculating}
        onNextCreditsChange={onNextCreditsChange}
      />

      <FinalSummary result={result} onNewEvaluation={onNewEvaluation} />
    </div>
  );
}
