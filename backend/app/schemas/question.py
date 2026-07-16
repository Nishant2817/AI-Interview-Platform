# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional


class QuestionCreate(BaseModel):
    title: str
    description: str
    answer: Optional[str] = None

    company_id: int
    topic_id: int
    difficulty_id: int
    question_type_id: int


class QuestionResponse(BaseModel):
    id: int
    title: str
    description: str
    answer: Optional[str]

    time_complexity: Optional[str] = None
    space_complexity: Optional[str] = None
    interview_tips: Optional[str] = None

    topic_name: Optional[str] = None
    difficulty_name: Optional[str] = None

    company_id: int
    topic_id: int
    difficulty_id: int
    question_type_id: int

    class Config:
        from_attributes = True