from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True
    )

    target_company = Column(String, nullable=True)

    preferred_interview_type = Column(
        String,
        nullable=True
    )

    resume_url = Column(String, nullable=True)