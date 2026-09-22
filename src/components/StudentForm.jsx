import { useState } from "react";
import {
  DEPARTMENTS,
  emptyCourse,
  emptyForm,
  sampleForm,
  getSemester,
  getSemesterCourses,
  coursesToForm,
  calculatePreviousCredits,
} from "../formData.js";
import {
  AlertIcon,
  PlusIcon,
  SparkIcon,
  SpinnerIcon,
  TrashIcon,
} from "./icons.jsx";
import PreviousCoursesModal from "./PreviousCoursesModal.jsx";

const inputClass =
  "w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3.5 py-2.5 text-sm " +
  "text-slate-100 placeholder-slate-600 outline-none transition " +
  "focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/25";

const selectClass =
  "w-full rounded-xl border border-slate-700/70 bg-slate-950/80 px-3.5 py-2.5 text-sm " +
  "text-slate-100 outline-none transition " +
  "focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/25 cursor-pointer";

function Field({ label, hint, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-400">
        {label}
        {hint ? <span className="font-normal text-slate-600">{hint}</span> : null}
      </span>
      <input className={inputClass} {...props} />
    </label>
  );
}

function SectionTitle({ step, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/30">
        {step}
      </span>
      <div>
        <h2 className="font-display text-sm font-bold text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function StudentForm({ onEvaluate, loading, error }) {
  const [form, setForm] = useState(emptyForm("iet-regular", 1));
  const [isModalOpen, setIsModalOpen] = useState(false);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Handle department change
  function handleDepartmentChange(deptId) {
    const semNum = form.currentSemester;
    const currentCourses = getSemesterCourses(deptId, semNum);
    const prevCredits = calculatePreviousCredits(
      deptId,
      semNum,
      form.disabledPreviousCourses
    );

    setForm((f) => ({
      ...f,
      department: deptId,
      courses: coursesToForm(currentCourses),
      prev_credits: String(prevCredits),
    }));
  }

  // Handle semester change
  function handleSemesterChange(semNum) {
    const sem = Number(semNum);
    const deptId = form.department;
    const currentCourses = getSemesterCourses(deptId, sem);
    const semObj = getSemester(deptId, sem);
    const prevCredits = calculatePreviousCredits(
      deptId,
      sem,
      form.disabledPreviousCourses
    );

    setForm((f) => ({
      ...f,
      currentSemester: sem,
      courses: coursesToForm(currentCourses),
      prev_credits: String(prevCredits),
      next_credits: semObj?.totalCredits || 15,
    }));
  }

  // Handle modal disabled courses update
  function handleUpdateDisabledCourses(disabledIds) {
    const prevCredits = calculatePreviousCredits(
      form.department,
      form.currentSemester,
      disabledIds
    );

    setForm((f) => ({
      ...f,
      disabledPreviousCourses: disabledIds,
      prev_credits: String(prevCredits),
    }));
  }

  // Current semester course modification
  function setCourse(index, field, value) {
    setForm((f) => ({
      ...f,
      courses: f.courses.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  }

  function addCourse() {
    setForm((f) => ({ ...f, courses: [...f.courses, emptyCourse()] }));
  }

  function removeCourse(index) {
    setForm((f) => ({
      ...f,
      courses: f.courses.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onEvaluate(form);
  }

  const currentSemCreditsSum = form.courses.reduce(
    (acc, c) => acc + (Number(c.credits) || 0),
    0
  );

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-6"
      >
        {/* Card Header */}
        <div className="mb-5 border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_2px_rgba(244,63,94,0.7)]" />
              <h2 className="font-display text-2xl sm:text-[23px] font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Case Evaluation
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/15 px-3 py-1 text-[11px] font-bold tracking-wide text-rose-300 shadow-sm shadow-rose-950 ring-1 ring-rose-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
              Probation Tool
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Select student department and semester to evaluate academic standing.
          </p>
        </div>

        {/* Section 1: Department & Academic Semester */}
        <SectionTitle
          step="1"
          title="Program & Semester"
          subtitle="Department curriculum and current enrollment stage"
        />

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Department
            </label>
            <div className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 shadow-inner flex items-center h-[38px] cursor-not-allowed">
              {DEPARTMENTS.find((d) => d.id === form.department)?.name || "Information Engineering Technology"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Current Semester</span>
              <span className="text-[11px] text-indigo-400 font-semibold">
                Sem {form.currentSemester} of 8
              </span>
            </label>
            <select
              id="semester-select"
              value={form.currentSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              className={selectClass}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem} className="bg-slate-900 text-white">
                  Semester {sem} {sem === 7 || sem === 8 ? "(Internship)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="my-6 border-t border-slate-800" />

        {/* Section 2: Student Information */}
        <SectionTitle
          step="2"
          title="Student Information"
          subtitle="Previous academic performance and cumulative credits"
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Field
              id="student-name-input"
              label="Student name (optional)"
              placeholder="e.g. Ali Khan (or leave blank)"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="col-span-2">
            <Field
              id="student-roll-input"
              label="Roll number (optional)"
              placeholder="e.g. IET-2024-042 (or leave blank)"
              value={form.roll}
              onChange={(e) => setField("roll", e.target.value)}
              autoComplete="off"
            />
          </div>
          <Field
            id="prev-cgpa-input"
            label="Previous CGPA"
            placeholder="0.00 – 4.00"
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={form.prev_cgpa}
            onChange={(e) => setField("prev_cgpa", e.target.value)}
          />

          <div>
            <Field
              id="prev-credits-input"
              label="Previous credits"
              hint="Auto-calculated"
              placeholder="e.g. 33"
              type="number"
              step="0.5"
              min="0"
              value={form.prev_credits}
              onChange={(e) => setField("prev_credits", e.target.value)}
            />
          </div>

          {/* Pop-up Card Trigger Button for Passed Courses */}
          <div className="col-span-2">
            <button
              id="open-passed-courses-modal"
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2.5 text-xs text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/60 transition group cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-[10px] font-bold text-indigo-300">
                  ⚙
                </span>
                <span className="font-semibold text-slate-200">
                  Customize Passed Courses
                </span>
                {form.disabledPreviousCourses.length > 0 ? (
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.2 text-[10px] font-bold text-rose-300 ring-1 ring-rose-500/30">
                    {form.disabledPreviousCourses.length} excluded
                  </span>
                ) : null}
              </span>
              <span className="text-[11px] font-medium text-indigo-400 group-hover:translate-x-0.5 transition">
                Pop-up Card &rarr;
              </span>
            </button>
          </div>
        </div>

        <div className="my-6 border-t border-slate-800" />

        {/* Section 3: Current Semester Courses */}
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle
            step="3"
            title={`Semester ${form.currentSemester} Courses`}
            subtitle="Enter obtained marks (out of 100)"
          />
          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
            {form.courses.length} courses &middot; {currentSemCreditsSum} Cr
          </span>
        </div>

        <div className="space-y-3">
          {form.courses.map((course, i) => (
            <div
              key={course.id || i}
              className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 transition hover:border-slate-700/80"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-400 ring-1 ring-indigo-500/30">
                    {course.code || `C-${i + 1}`}
                  </span>
                  {course.status ? (
                    <span className="text-[10px] text-slate-500 font-medium truncate">
                      {course.status}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeCourse(i)}
                  disabled={form.courses.length === 1}
                  className="rounded-md p-1 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-30"
                  title="Remove course"
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="space-y-2.5">
                <input
                  className={inputClass}
                  placeholder="Course title"
                  value={course.name}
                  onChange={(e) => setCourse(i, "name", e.target.value)}
                  autoComplete="off"
                />

                <div className="grid grid-cols-12 gap-2 items-center">
                  {/* Credit Hours Input */}
                  <div className="col-span-4">
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">
                      Credits
                    </label>
                    <input
                      className={inputClass}
                      placeholder="Credits"
                      type="number"
                      step="0.5"
                      min="0"
                      value={course.credits}
                      onChange={(e) => setCourse(i, "credits", e.target.value)}
                      title="Credit hours"
                    />
                  </div>

                  {/* Obtained Marks Input */}
                  <div className="col-span-5">
                    <label className="block text-[10px] font-semibold text-indigo-300 mb-1">
                      Obtained Marks
                    </label>
                    <input
                      className={`${inputClass} border-indigo-500/40 bg-indigo-950/20 text-white font-semibold focus:border-indigo-400`}
                      placeholder="e.g. 65"
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={course.marks}
                      onChange={(e) => setCourse(i, "marks", e.target.value)}
                      title="Obtained marks"
                    />
                  </div>

                  {/* Hardcoded 100 Total Marks */}
                  <div className="col-span-3">
                    <label className="block text-[10px] font-medium text-slate-500 mb-1">
                      Total
                    </label>
                    <div className="flex h-[42px] items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-bold text-slate-400">
                      / 100
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCourse}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 py-2.5 text-xs font-medium text-slate-400 transition hover:border-indigo-500/60 hover:text-indigo-300"
        >
          <PlusIcon /> Add Backlog or Custom Course
        </button>

        {error ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-3 text-xs leading-relaxed text-rose-300">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Submit & Reset Buttons */}
        <button
          id="evaluate-button"
          type="submit"
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <SpinnerIcon /> Evaluating...
            </>
          ) : (
            <>
              <SparkIcon /> Evaluate Student
            </>
          )}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setForm(sampleForm())}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50 cursor-pointer"
          >
            Load Sample Case
          </button>
          <button
            type="button"
            onClick={() => setForm(emptyForm(form.department, form.currentSemester))}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50 cursor-pointer"
          >
            Reset Semester
          </button>
        </div>
      </form>

      {/* Pop-up Card Modal */}
      <PreviousCoursesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        departmentId={form.department}
        currentSemester={form.currentSemester}
        disabledCourses={form.disabledPreviousCourses}
        onUpdateDisabledCourses={handleUpdateDisabledCourses}
      />
    </>
  );
}
