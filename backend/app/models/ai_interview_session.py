from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base


class AIInterviewSession(Base):
    __tablename__ = "ai_interview_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    company = Column(String, nullable=False)

    role = Column(String, nullable=False)

    interview_type = Column(String, nullable=False)

    experience_level = Column(String, nullable=False)

    difficulty = Column(String, nullable=False)

    duration = Column(Integer, nullable=False)

    question_count = Column(Integer, nullable=False)

    status = Column(String, default="completed")

    created_at = Column(DateTime, default=datetime.utcnow)

    completed_at = Column(DateTime, nullable=True)
