const statusStyles = {
  PASS: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  FAIL: "border-rose-500/40 bg-rose-500/10 text-rose-400",
  BORDER: "border-amber-500/40 bg-amber-500/10 text-amber-400",
};

const barColors = {
  PASS: "bg-emerald-500",
  FAIL: "bg-rose-500",
  BORDER: "bg-amber-400",
};

export default function CourseTable({ courses, semester }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Current Semester Courses
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Grade points on a 4.00 scale · Pass mark: 50%
          </p>
        </div>
        <span className="rounded-full border border-slate-700/70 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-300">
          {courses.length} course{courses.length === 1 ? "" : "s"} ·{" "}
          {semester.credits} credits
        </span>
      </div>

      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="pb-2.5 pr-4 font-semibold">Course</th>
              <th className="pb-2.5 pr-4 text-center font-semibold">Credits</th>
              <th className="pb-2.5 pr-4 text-center font-semibold">Marks</th>
              <th className="pb-2.5 pr-4 font-semibold">Percentage</th>
              <th className="pb-2.5 pr-4 text-center font-semibold">GP</th>
              <th className="pb-2.5 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr
                key={i}
                className={`border-b border-slate-800/60 last:border-0 ${
                  c.status === "FAIL" ? "bg-rose-500/[0.04]" : ""
                }`}
              >
                <td className="py-3 pr-4 font-medium text-slate-200">
                  {c.name}
                </td>
                <td className="py-3 pr-4 text-center text-slate-400">
                  {c.credits}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-center text-slate-400">
                  {c.marks}/{c.total}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${
                          barColors[c.status] || "bg-slate-500"
                        }`}
                        style={{ width: `${Math.min(Math.max(c.pct, 0), 100)}%` }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-slate-400">
                      {c.pct.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-center font-semibold tabular-nums text-slate-200">
                  {c.gp.toFixed(2)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`badge inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${
                      statusStyles[c.status] || statusStyles.BORDER
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
