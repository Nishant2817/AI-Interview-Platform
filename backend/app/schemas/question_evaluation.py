from pydantic import BaseModel


class QuestionEvaluationRequest(BaseModel):
    question: str
    answer: str


class QuestionEvaluationResponse(BaseModel):
    score: int
    strengths: str
    improvements: str
    ideal_answer: str
    feedback: str