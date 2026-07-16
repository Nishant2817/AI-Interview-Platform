from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base


class AIInterviewAnswer(Base):
    __tablename__ = "ai_interview_answers"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("ai_interview_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )

    # The AI-generated question number (1, 2, 3…)
    question_number = Column(Integer, nullable=False)

    # Full question text from the AI
    question_text = Column(Text, nullable=False)

    # "mcq" or "text"
    question_type = Column(String, nullable=False)

    topic = Column(String, nullable=True)

    difficulty = Column(String, nullable=True)

    # For MCQ: the selected option; for text: the typed answer
    answer_text = Column(Text, nullable=True, default="")

    # For MCQ only — to display in the report
    correct_answer = Column(Text, nullable=True)
