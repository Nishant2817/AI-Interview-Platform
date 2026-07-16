from pydantic import BaseModel

class InterviewStartRequest(BaseModel):
    company_id: int
    question_type_id: int
    duration_minutes: int
    question_count: int