from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class AIInterviewFeedback(Base):
    __tablename__ = "ai_interview_feedbacks"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("ai_interview_sessions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    overall_score = Column(Integer, default=0)

    strengths = Column(Text, nullable=True)

    improvements = Column(Text, nullable=True)

    feedback = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
