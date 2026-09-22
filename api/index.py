# FastAPI backend for the probation evaluator
# run from the backend folder:
#   uvicorn main:app --reload --port 8000

import sys
from pathlib import Path

# Ensure the api/ directory is in the path so Vercel can find evaluator.py
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

from evaluator import evaluate_student

app = FastAPI(title="Probation Evaluator API", version="1.0.0")

# the react app runs on another port so CORS has to be allowed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


import json
from pathlib import Path

class CourseIn(BaseModel):
    name: str = Field(min_length=1)
    credits: float = Field(ge=0)
    marks: float = Field(ge=0)
    total: float = Field(gt=0)


class StudentIn(BaseModel):
    name: Optional[str] = Field(default="Student")
    roll: Optional[str] = Field(default="N/A")
    prev_cgpa: float = Field(ge=0, le=4)
    prev_credits: float = Field(ge=0)
    next_credits: Optional[float] = Field(15, ge=0)
    courses: List[CourseIn] = Field(min_length=1)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/courses")
def get_courses():
    json_path = Path(__file__).parent / "coursesData.json"
    if json_path.exists():
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Courses catalog not found.")


@app.post("/api/evaluate")
def evaluate(payload: StudentIn):
    try:
        next_credits_val = payload.next_credits if payload.next_credits is not None else 15.0
        result = evaluate_student(
            payload.model_dump(), next_credits=next_credits_val
        )
        if result is None:
            raise HTTPException(status_code=400, detail="No credits found.")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation error: {str(e)}")
