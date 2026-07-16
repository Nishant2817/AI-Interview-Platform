from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.dependencies import get_db
from app.models.company import Company
from app.models.question import Question
from app.models.topic import Topic
from app.models.difficulty_level import DifficultyLevel
from typing import Optional


router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


@router.get("/{company_id}")
def get_company(
    company_id: int,
    db: Session = Depends(get_db)
):

    company = (
        db.query(Company)
        .filter(Company.id == company_id)
        .first()
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    return company

@router.get("/{company_id}/questions")
def get_company_questions(
    company_id: int,
    question_type_id: Optional[int] = None,
    db: Session = Depends(get_db)
):

    query = (
        db.query(Question)
        .options(joinedload(Question.topic), joinedload(Question.difficulty))
        .filter(Question.company_id == company_id)
    )

    if question_type_id:
        query = query.filter(
            Question.question_type_id == question_type_id
        )

    questions = query.all()

    return [
        {
            "id": q.id,
            "title": q.title,
            "description": q.description,
            "answer": q.answer,
            "time_complexity": q.time_complexity,
            "space_complexity": q.space_complexity,
            "interview_tips": q.interview_tips,
            "topic_name": q.topic.name if q.topic else None,
            "difficulty_name": q.difficulty.name if q.difficulty else None,
            "company_id": q.company_id,
            "topic_id": q.topic_id,
            "difficulty_id": q.difficulty_id,
            "question_type_id": q.question_type_id,
        }
        for q in questions
    ]

@router.get("/")
def get_companies(
    db: Session = Depends(get_db)
):

    companies = (
        db.query(
            Company,
            func.count(Question.id).label("question_count")
        )
        .outerjoin(
            Question,
            Company.id == Question.company_id
        )
        .group_by(Company.id)
        .all()
    )

    return [
        {
            "id": company.id,
            "name": company.name,
            "logo": company.logo,
            "category": company.category,
            "company_type": company.company_type,
            "headquarters": company.headquarters,
            "founded": company.founded,
            "employees": company.employees,
            "website": company.website,
            "description": company.description,
            "question_count": question_count,
        }
        for company, question_count in companies
    ]