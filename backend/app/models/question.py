from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    answer = Column(
        Text,
        nullable=True
    )

    time_complexity = Column(
        String,
        nullable=True
    )

    space_complexity = Column(
        String,
        nullable=True
    )

    interview_tips = Column(
        Text,
        nullable=True
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )

    topic_id = Column(
        Integer,
        ForeignKey("topics.id")
    )

    difficulty_id = Column(
        Integer,
        ForeignKey("difficulty_levels.id")
    )

    question_type_id = Column(
        Integer,
        ForeignKey("question_types.id")
    )

    company = relationship("Company")
    topic = relationship("Topic")
    difficulty = relationship("DifficultyLevel")
    question_type = relationship("QuestionType")
