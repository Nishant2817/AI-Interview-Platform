from pydantic import BaseModel

class SessionAnswerCreate(BaseModel):
    session_id: int
    question_id: int
    answer_text: str
    time_taken: int