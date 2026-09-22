import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getPreviousCoursesList } from "../formData.js";
import { CheckCircleIcon } from "./icons.jsx";

export default function PreviousCoursesModal({
  isOpen,
  onClose,
  departmentId,
  currentSemester,
  disabledCourses = [],
  onUpdateDisabledCourses,
}) {
  const [localDisabled, setLocalDisabled] = useState(disabledCourses);

  useEffect(() => {
    setLocalDisabled(disabledCourses);
  }, [disabledCourses, isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const previousSemesters = getPreviousCoursesList(departmentId, currentSemester);

  // Calculate stats
  let totalCurriculumCredits = 0;
  let activeCredits = 0;
  let totalCourseCount = 0;
  let activeCourseCount = 0;

  for (const sem of previousSemesters) {
    for (const c of sem.courses) {
      totalCurriculumCredits += c.credits;
      totalCourseCount++;
      if (!localDisabled.includes(c.id)) {
        activeCredits += c.credits;
        activeCourseCount++;
      }
    }
  }

  function handleToggleCourse(courseId) {
    setLocalDisabled((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  }

  function handleSelectAll() {
    setLocalDisabled([]);
  }

  function handleDeselectAll() {
    const allIds = [];
    for (const sem of previousSemesters) {
      for (const c of sem.courses) {
        allIds.push(c.id);
      }
    }
    setLocalDisabled(allIds);
  }

  function handleApply() {
    onUpdateDisabledCourses(localDisabled);
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-3 sm:p-6 pt-12 sm:pt-16 pb-12 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl my-auto flex flex-col rounded-2xl border border-slate-700/90 bg-slate-900 shadow-2xl shadow-black/90 overflow-hidden max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Prominent, distinctly styled, never covered */}
        <div className="sticky top-0 z-20 flex items-start justify-between border-b border-slate-800/90 px-6 py-4 sm:py-5 bg-slate-950 shadow-md">
          <div className="pr-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/40">
                ✓
              </span>
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                Passed Courses Checklist
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Curriculum courses prior to Semester {currentSemester}.
              Uncheck any course you failed or dropped to adjust previous credits.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-slate-300 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition"
            title="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/70 px-6 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Active:</span>
            <span className="font-display font-bold text-indigo-400">
              {activeCourseCount} of {totalCourseCount} courses
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-semibold text-emerald-400">
              {activeCredits} of {totalCurriculumCredits} Credit Hours
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-slate-500 hover:text-white transition"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:border-slate-500 hover:text-rose-300 transition"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Scrollable Course List Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-900/80">
          {previousSemesters.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-300">
                You are currently in Semester 1.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                No previous semesters exist. Previous credit hours are 0 for the first semester.
              </p>
            </div>
          ) : (
            previousSemesters.map((sem) => {
              const semActiveCredits = sem.courses
                .filter((c) => !localDisabled.includes(c.id))
                .reduce((sum, c) => sum + c.credits, 0);

              const semTotalCredits = sem.courses.reduce(
                (s, c) => s + c.credits,
                0
              );

              return (
                <div
                  key={sem.semester}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="mb-3 flex items-center justify-between border-b border-slate-800/70 pb-2.5">
                    <span className="font-display text-sm font-bold text-slate-200">
                      {sem.name}
                    </span>
                    <span className="rounded-full bg-slate-800/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                      {semActiveCredits} / {semTotalCredits} Credits
                    </span>
                  </div>

                  <div className="space-y-2">
                    {sem.courses.map((course) => {
                      const isEnabled = !localDisabled.includes(course.id);
                      return (
                        <label
                          key={course.id}
                          className={`flex items-center justify-between rounded-lg border p-2.5 transition cursor-pointer ${
                            isEnabled
                              ? "border-slate-800 bg-slate-900/80 hover:border-slate-700"
                              : "border-slate-800/40 bg-slate-950/30 opacity-55 hover:opacity-80"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() => handleToggleCourse(course.id)}
                              className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <p
                                className={`text-xs font-medium truncate ${
                                  isEnabled
                                    ? "text-slate-200"
                                    : "text-slate-500 line-through"
                                }`}
                              >
                                <span className="font-semibold text-indigo-400">
                                  {course.code}
                                </span>{" "}
                                &middot; {course.name}
                              </p>
                              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                                <span>{course.status}</span>
                                <span>&bull;</span>
                                <span>{course.type}</span>
                                {course.prereq !== "None" ? (
                                  <>
                                    <span>&bull;</span>
                                    <span>Pre-req: {course.prereq}</span>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ${
                              isEnabled
                                ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30"
                                : "bg-slate-800 text-slate-600"
                            }`}
                          >
                            {course.credits} Cr
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-slate-800 p-4 sm:p-5 bg-slate-950 shadow-lg">
          <div>
            <span className="text-xs text-slate-400">Adjusted Previous Credits:</span>
            <p className="font-display text-xl font-bold text-emerald-400">
              {activeCredits}{" "}
              <span className="text-xs font-normal text-slate-500">
                Credit Hours
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-900/40 hover:brightness-110 active:scale-[0.99] transition cursor-pointer"
            >
              <CheckCircleIcon className="h-4 w-4" /> Apply {activeCredits} Credits
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
