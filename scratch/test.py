import sys
from pathlib import Path
sys.path.insert(0, str(Path("api").resolve()))

from evaluator import evaluate_student

payload = {
    "name": "Student",
    "roll": "N/A",
    "prev_cgpa": 1.75,
    "prev_credits": 0,
    "next_credits": 18,
    "courses": [
        {
            "name": "Course 1",
            "credits": 2,
            "marks": 45,
            "total": 100
        }
    ]
}

result = evaluate_student(payload, next_credits=18.0)
print(result)
