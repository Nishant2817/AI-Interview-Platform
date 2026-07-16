from sqlalchemy import (Column,Integer,Text,ForeignKey,DateTime)
from sqlalchemy.sql import func
from app.database import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    ats_score = Column(Integer)

    strengths = Column(Text)

    weaknesses = Column(Text)

    missing_skills = Column(Text)

    suggested_roles = Column(Text)

    overall_feedback = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )