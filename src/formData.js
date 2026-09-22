import coursesData from "./data/coursesData.json";

export { coursesData };

export const DEPARTMENTS = coursesData.departments;

export function getDepartment(deptId) {
  return DEPARTMENTS.find((d) => d.id === deptId) || DEPARTMENTS[0];
}

export function getSemester(deptId, semesterNum) {
  const dept = getDepartment(deptId);
  return dept.semesters.find((s) => s.semester === Number(semesterNum)) || null;
}

export function getSemesterCourses(deptId, semesterNum) {
  const sem = getSemester(deptId, semesterNum);
  return sem ? sem.courses : [];
}

// Get all courses from previous semesters (1 through currentSemester - 1)
export function getPreviousCoursesList(deptId, currentSemesterNum) {
  const dept = getDepartment(deptId);
  const currentNum = Number(currentSemesterNum);
  const previousSemesters = dept.semesters.filter((s) => s.semester < currentNum);
  
  return previousSemesters.map((s) => ({
    semester: s.semester,
    name: s.name,
    courses: s.courses.map((c) => ({ ...c })),
  }));
}

// Compute total previous credits from disabled IDs set/array
export function calculatePreviousCredits(deptId, currentSemesterNum, disabledIds = []) {
  const disabledSet = new Set(disabledIds);
  const prevSems = getPreviousCoursesList(deptId, currentSemesterNum);
  let total = 0;
  for (const sem of prevSems) {
    for (const course of sem.courses) {
      if (!disabledSet.has(course.id)) {
        total += course.credits;
      }
    }
  }
  return total;
}

// Compute the FULL previous credits (no filtering) — used to preserve quality points
export function calculateFullPreviousCredits(deptId, currentSemesterNum) {
  const prevSems = getPreviousCoursesList(deptId, currentSemesterNum);
  let total = 0;
  for (const sem of prevSems) {
    for (const course of sem.courses) {
      total += course.credits;
    }
  }
  return total;
}

export const emptyCourse = (name = "", credits = "", marks = "", code = "", id = "") => ({
  id: id || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  code: code || "",
  name: name || "",
  credits: credits !== "" ? String(credits) : "",
  marks: marks !== "" ? String(marks) : "",
  total: 100, // Hardcoded to 100 marks
});

export function coursesToForm(coursesList) {
  return coursesList.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    credits: String(c.credits),
    marks: "",
    total: 100, // Hardcoded 100 marks
    status: c.status,
    prereq: c.prereq,
  }));
}

export const emptyForm = (deptId = "iet-regular", semNum = 1) => {
  const currentCourses = getSemesterCourses(deptId, semNum);
  const semObj = getSemester(deptId, semNum);

  return {
    department: deptId,
    currentSemester: semNum,
    name: "",
    roll: "",
    prev_cgpa: "",
    prev_credits: String(calculatePreviousCredits(deptId, semNum, [])),
    disabledPreviousCourses: [],
    courses: coursesToForm(currentCourses),
    next_credits: semObj?.totalCredits || 15,
  };
};

export const sampleForm = () => {
  const deptId = "iet-regular";
  const semNum = 3;
  const currentCourses = getSemesterCourses(deptId, semNum);
  const semObj = getSemester(deptId, semNum);

  // Sample marks for semester 3 courses
  const sampleMarks = [42, 68, 55, 74, 82, 60, 71, 48, 80];

  const courses = currentCourses.map((c, i) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    credits: String(c.credits),
    marks: String(sampleMarks[i] ?? 65),
    total: 100,
    status: c.status,
    prereq: c.prereq,
  }));

  return {
    department: deptId,
    currentSemester: semNum,
    name: "Ali Khan",
    roll: "IET-2024-042",
    prev_cgpa: "1.75",
    prev_credits: String(calculatePreviousCredits(deptId, semNum, [])),
    disabledPreviousCourses: [],
    courses,
    next_credits: semObj?.totalCredits || 15,
  };
};

export function toPayload(form) {
  const prevCredits = Number(form.prev_credits);
  const prevCgpa = Number(form.prev_cgpa);

  // If some previous courses are disabled (marked failed/dropped), we need to
  // adjust prev_cgpa so that the original quality points are preserved.
  // Original QP = prev_cgpa × fullPrevCredits
  // Adjusted CGPA for reduced credits = originalQP / reducedCredits
  // This prevents the bug where reducing credits AND keeping same CGPA
  // would artificially lower quality points.
  let adjustedPrevCgpa = prevCgpa;
  if (form.disabledPreviousCourses && form.disabledPreviousCourses.length > 0 && prevCredits > 0) {
    const fullCredits = calculateFullPreviousCredits(form.department, form.currentSemester);
    if (fullCredits > 0) {
      const originalQP = prevCgpa * fullCredits;
      adjustedPrevCgpa = originalQP / prevCredits;
    }
  }

  return {
    name: form.name?.trim() || "Student",
    roll: form.roll?.trim() || "N/A",
    prev_cgpa: adjustedPrevCgpa,
    prev_credits: prevCredits,
    next_credits: Number(form.next_credits) || 15,
    courses: form.courses.map((c) => ({
      name: c.code ? `${c.code} - ${c.name}` : c.name.trim(),
      credits: Number(c.credits),
      marks: Number(c.marks),
      total: 100, // Always 100
    })),
  };
}

export function validateForm(form) {
  // Name and roll are optional now

  const cgpa = Number(form.prev_cgpa);
  if (form.prev_cgpa === "" || Number.isNaN(cgpa))
    return "Please enter the previous CGPA.";
  if (cgpa < 0 || cgpa > 4) return "Previous CGPA must be between 0.00 and 4.00.";

  const credits = Number(form.prev_credits);
  if (form.prev_credits === "" || Number.isNaN(credits) || credits < 0)
    return "Please enter valid previous total credits (0 or more).";

  if (form.courses.length === 0)
    return "Add at least one course for the current semester.";

  for (let i = 0; i < form.courses.length; i++) {
    const c = form.courses[i];
    const courseTitle = c.code ? `${c.code}: ${c.name}` : c.name || `Course ${i + 1}`;
    if (!c.name.trim()) return `Course ${i + 1}: Name is required.`;
    
    const cr = Number(c.credits);
    if (c.credits === "" || Number.isNaN(cr) || cr < 0)
      return `${courseTitle}: Credit hours must be 0 or greater.`;
    
    if (c.marks === "" || Number.isNaN(Number(c.marks)))
      return `${courseTitle}: Please enter the obtained marks.`;

    const marks = Number(c.marks);
    if (marks < 0 || marks > 100)
      return `${courseTitle}: Obtained marks must be between 0 and 100.`;
  }

  return null;
}
