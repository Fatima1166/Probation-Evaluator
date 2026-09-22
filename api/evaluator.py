# evaluation logic for the probation evaluator
# moved out of the notebook so the API can use it

from itertools import combinations

PASS_CGPA = 2.00
PASS_MARKS = 50
MAX_MARKS = 100


def marks_to_gp(marks, total=100):
    # convert marks into grade points
    if total <= 0:
        return 0.0

    pct = (marks / total) * 100

    if pct >= 85:
        return 4.00
    elif pct >= 80:
        return 3.67
    elif pct >= 75:
        return 3.33
    elif pct >= 70:
        return 3.00
    elif pct >= 65:
        return 2.67
    elif pct >= 60:
        return 2.33
    elif pct >= 55:
        return 2.00
    elif pct >= 50:
        return 1.67
    elif pct >= 45:
        return 1.33
    elif pct >= 40:
        return 1.00
    else:
        return 0.00


def evaluate_student(student, next_credits=15.0):
    # evaluate one student and return everything the report needs
    # (returns None if there are no credits at all)

    sem_credits = 0.0
    sem_points = 0.0
    failed_courses = []
    borderline_courses = []
    course_rows = []

    for c in student["courses"]:
        gp = marks_to_gp(c["marks"], c["total"])
        pct = (c["marks"] / c["total"]) * 100 if c["total"] > 0 else 0.0

        if pct < PASS_MARKS:
            status = "FAIL"
            deficit = PASS_MARKS - pct
            failed_courses.append({
                "name": c["name"],
                "credits": c["credits"],
                "marks": c["marks"],
                "pct": pct,
                "deficit_pct": deficit,
                "deficit_marks": (deficit / 100) * c["total"],
                "total": c["total"],
            })
        elif 45 <= pct < PASS_MARKS:
            status = "BORDER"
            borderline_courses.append({
                "name": c["name"],
                "credits": c["credits"],
                "marks": c["marks"],
                "pct": pct,
                "needed": (PASS_MARKS / 100) * c["total"] - c["marks"],
                "total": c["total"],
            })
        else:
            status = "PASS"

        # row for the course table in the report
        course_rows.append({
            "name": c["name"],
            "credits": c["credits"],
            "marks": c["marks"],
            "total": c["total"],
            "pct": pct,
            "gp": gp,
            "status": status,
        })

        sem_credits += c["credits"]
        sem_points += gp * c["credits"]

    if sem_credits <= 0:
        # nothing to calculate without credits
        return None

    # semester gpa and the new cgpa after adding this semester
    sem_gpa = sem_points / sem_credits
    total_credits = student["prev_credits"] + sem_credits
    total_qp = (student["prev_cgpa"] * student["prev_credits"]) + sem_points
    new_cgpa = total_qp / total_credits

    was_probation = student["prev_cgpa"] < PASS_CGPA
    is_probation = new_cgpa < PASS_CGPA

    grace_analysis = []
    recommendation = None
    required_gpa = None

    if is_probation and (failed_courses or borderline_courses):
        # possibility analysis: can grace marks save this student?
        all_issues = failed_courses + borderline_courses

        for fc in all_issues:
            needed = fc["needed"] if "needed" in fc else fc["deficit_marks"]
            grace_marks = fc["total"] * 0.50 - fc["marks"]
            old_gp = marks_to_gp(fc["marks"], fc["total"])
            new_gp = 1.67
            qp_gain = (new_gp - old_gp) * fc["credits"]
            hypothetical_cgpa = (total_qp + qp_gain) / total_credits

            grace_analysis.append({
                "name": fc["name"],
                "credits": fc["credits"],
                "marks": fc["marks"],
                "total": fc["total"],
                "pct": fc["pct"],
                "needed": needed,
                "grace_marks": grace_marks,
                "old_gp": old_gp,
                "new_gp": new_gp,
                "qp_gain": qp_gain,
                "hypothetical_cgpa": hypothetical_cgpa,
                "can_pass": hypothetical_cgpa >= PASS_CGPA,
            })

        # which course gives the best improvement if grace marks are given
        best_gain = 0.0
        best_course = None
        for fc in all_issues:
            old_gp = marks_to_gp(fc["marks"], fc["total"])
            qp_gain = (1.67 - old_gp) * fc["credits"]
            if qp_gain > best_gain:
                best_gain = qp_gain
                best_course = fc

        if best_course:
            hyp_cgpa = (total_qp + best_gain) / total_credits
            if hyp_cgpa >= PASS_CGPA:
                recommendation = {
                    "type": "GRACE_CLEARS",
                    "best_course": best_course["name"],
                    "expected_cgpa": hyp_cgpa,
                    "message": f"If grace marks are given in "
                               f"{best_course['name']}, the student can "
                               f"clear probation.",
                }
            else:
                # one course is not enough, so look for the smallest group
                # of courses that can clear probation together
                best_combo = None
                best_combo_cgpa = 0.0
                for size in range(2, len(all_issues) + 1):
                    options = []
                    for combo in combinations(all_issues, size):
                        gain = sum(
                            (1.67 - marks_to_gp(fc["marks"], fc["total"]))
                            * fc["credits"]
                            for fc in combo
                        )
                        combo_cgpa = (total_qp + gain) / total_credits
                        if combo_cgpa >= PASS_CGPA:
                            options.append((combo_cgpa, combo))
                    if options:
                        # prefer the group with the highest cgpa
                        best_combo_cgpa, best_combo = max(
                            options, key=lambda o: o[0]
                        )
                        break

                if best_combo:
                    names = [fc["name"] for fc in best_combo]
                    if len(names) == 2:
                        names_text = names[0] + " and " + names[1]
                    else:
                        names_text = ", ".join(names[:-1]) + " and " + names[-1]
                    recommendation = {
                        "type": "COMBO_CLEARS",
                        "courses": names,
                        "expected_cgpa": best_combo_cgpa,
                        "message": "Grace marks in just one course won't "
                                   "be enough. Grace marks in "
                                   f"{names_text} together would clear "
                                   "probation.",
                    }
                else:
                    # even grace marks in every problem course are not enough
                    all_gain = sum(
                        (1.67 - marks_to_gp(fc["marks"], fc["total"]))
                        * fc["credits"]
                        for fc in all_issues
                    )
                    best_achievable = (total_qp + all_gain) / total_credits
                    if len(all_issues) == 1:
                        message = (
                            "Even with grace marks in "
                            f"{all_issues[0]['name']}, the CGPA will only "
                            f"reach {best_achievable:.2f}. The student "
                            "cannot clear probation this semester."
                        )
                    else:
                        message = (
                            "Even with grace marks in all problem "
                            f"courses, the CGPA will only reach "
                            f"{best_achievable:.2f}. The student cannot "
                            "clear probation this semester."
                        )
                    recommendation = {
                        "type": "NO_COMBO",
                        "best_achievable_cgpa": best_achievable,
                        "message": message,
                    }
        else:
            recommendation = {
                "type": "NO_ELIGIBLE",
                "message": "No course eligible for grace marks.",
            }

    elif is_probation:
        # no failed courses but cgpa is still low,
        # so check what gpa the student needs next semester
        required_gpa = (
            PASS_CGPA * (total_credits + next_credits) - total_qp
        ) / next_credits
        recommendation = {
            "type": "REQUIRED_GPA",
            "required_gpa": required_gpa,
            "next_credits": next_credits,
            "message": "No failed courses, but CGPA is low. The student "
                       "needs a better GPA next semester to clear probation.",
        }

    return {
        "student": {
            "name": student["name"],
            "roll": student["roll"],
            "prev_cgpa": student["prev_cgpa"],
            "prev_credits": student["prev_credits"],
        },
        "courses": course_rows,
        "semester": {
            "credits": sem_credits,
            "points": sem_points,
            "gpa": sem_gpa,
        },
        "overall": {
            "total_credits": total_credits,
            "total_qp": total_qp,
            "new_cgpa": new_cgpa,
        },
        "probation": {
            "was_probation": was_probation,
            "is_probation": is_probation,
            "previous_status": "PROBATION" if was_probation else "CLEAR",
            "current_status": (
                "STILL ON PROBATION" if is_probation else "PROBATION CLEARED"
            ),
        },
        "failed_courses": failed_courses,
        "borderline_courses": borderline_courses,
        "grace_analysis": grace_analysis,
        "recommendation": recommendation,
        "final": {
            "name": student["name"],
            "new_cgpa": new_cgpa,
            "status": "PROBATION" if is_probation else "CLEAR",
        },
    }
