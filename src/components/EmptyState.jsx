import { CheckCircleIcon, ClipboardIcon } from "./icons.jsx";

const features = [
  "Semester GPA & new CGPA calculation",
  "Probation status transition (previous → current)",
  "Grace mark possibility analysis per course",
  "Department recommendation & required GPA",
];

export default function EmptyState() {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/30 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-xl shadow-indigo-950/50">
        <ClipboardIcon className="h-8 w-8 text-white" />
      </div>
      <h3 className="mt-5 font-display text-lg font-bold text-white">
        No evaluation yet
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
        Fill in the student form and press{" "}
        <span className="font-semibold text-indigo-300">Evaluate Student</span>{" "}
        to generate the full probation case report.
      </p>
      <ul className="mt-6 space-y-2 text-left">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-xs text-slate-400">
            <CheckCircleIcon className="h-4 w-4 shrink-0 text-indigo-400" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
