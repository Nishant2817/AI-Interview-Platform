from typing import List, Optional
from pydantic import BaseModel


class AIInterviewRequest(BaseModel):
    company: str
    interview_type: str
    role: str
    experience_level: str
    difficulty: str
    duration: int
    question_count: int


# ── Submit payload schemas ──────────────────────────────────────────────────

class AIAnswerItem(BaseModel):
    question_id: int           # The AI-assigned id (1, 2, 3…)
    question: str
    type: str                  # "mcq" | "text"
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    answer: str
    correct_answer: Optional[str] = None  # MCQ only


class AIInterviewSubmitRequest(BaseModel):
    company: str
    role: str
    interview_type: str
    experience_level: str
    difficulty: str
    duration: int
    question_count: int
    answers: List[AIAnswerItem]