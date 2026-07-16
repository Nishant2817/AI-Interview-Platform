from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class AIInterviewAnswerFeedback(Base):
    __tablename__ = "ai_interview_answer_feedbacks"

    id = Column(Integer, primary_key=True, index=True)

    answer_id = Column(
        Integer,
        ForeignKey("ai_interview_answers.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    score = Column(Integer, default=0)

    strengths = Column(Text, nullable=True)

    improvements = Column(Text, nullable=True)

    ideal_answer = Column(Text, nullable=True)

    feedback = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
