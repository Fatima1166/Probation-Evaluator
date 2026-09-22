import { TrashIcon, PlusIcon } from "./icons.jsx";

export default function NextSemesterSection({
  currentSemester,
  nextCourses = [],
  onToggleCourse,
  onRemoveCourse,
  onAddCourse,
}) {
  const nextSemesterNum = Number(currentSemester) + 1;
  const isLastSemester = Number(currentSemester) >= 8;

  const totalNextCredits = nextCourses
    .filter((c) => c.enabled !== false)
    .reduce((sum, c) => sum + (Number(c.credits) || 0), 0);

  const activeCount = nextCourses.filter((c) => c.enabled !== false).length;

  if (isLastSemester) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold text-slate-200">
            Next Semester Courses (Graduation)
          </span>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
            Final Semester
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Semester 8 is the final internship semester. No subsequent regular semester
          curriculum is scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-500/20 text-[11px] font-bold text-violet-400 ring-1 ring-violet-500/30">
              {nextSemesterNum}
            </span>
            <h4 className="font-display text-sm font-bold text-white">
              Upcoming Semester {nextSemesterNum} Courses
            </h4>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Courses planned for next semester. Remove or toggle courses to adjust credit hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-300">
            {totalNextCredits} Credit Hours ({activeCount} courses)
          </span>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-2">
        {nextCourses.length === 0 ? (
          <p className="text-center py-4 text-xs text-slate-500">
            No courses listed for this semester. Click below to add courses.
          </p>
        ) : (
          nextCourses.map((course, idx) => {
            const isEnabled = course.enabled !== false;
            return (
              <div
                key={course.id || idx}
                className={`flex items-center justify-between rounded-lg border p-2.5 transition ${
                  isEnabled
                    ? "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                    : "border-slate-800/40 bg-slate-950/30 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => onToggleCourse?.(idx)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    title={isEnabled ? "Disable course" : "Enable course"}
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-medium truncate ${
                        isEnabled ? "text-slate-200" : "text-slate-500 line-through"
                      }`}
                    >
                      <span className="font-semibold text-indigo-400">
                        {course.code || "Course"}
                      </span>{" "}
                      &middot; {course.name}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                      <span>{course.status || "Regular"}</span>
                      {course.prereq && course.prereq !== "None" ? (
                        <>
                          <span>&bull;</span>
                          <span className="text-amber-400/80">
                            Pre-req: {course.prereq}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ${
                      isEnabled
                        ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30"
                        : "bg-slate-800 text-slate-600"
                    }`}
                  >
                    {course.credits} Cr
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveCourse?.(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                    title="Remove from next semester plan"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <span className="text-[11px] text-slate-400">
          Total next semester load used for probation target:
        </span>
        <span className="font-display text-xs font-extrabold text-indigo-300">
          {totalNextCredits} Credits
        </span>
      </div>
    </div>
  );
}
