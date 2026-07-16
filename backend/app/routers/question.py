from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import SessionLocal
from app.models.question import Question
from app.dependencies.admin import get_current_admin
from app.schemas.question import (QuestionCreate, QuestionResponse)
from app.models.audit_log import AuditLog
from app.schemas.question_evaluation import (
    QuestionEvaluationRequest,
    QuestionEvaluationResponse
)

from app.services.ai_service import (
    evaluate_interview,
    parse_feedback
)

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/",
    response_model=QuestionResponse
)
def create_question(
    question: QuestionCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    new_question = Question(
        title=question.title,
        description=question.description,
        answer=question.answer,

        company_id=question.company_id,
        topic_id=question.topic_id,
        difficulty_id=question.difficulty_id,
        question_type_id=question.question_type_id
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return new_question

@router.get(
    "/",
    response_model=list[QuestionResponse]
)
def get_questions(
    company_id: Optional[int] = None,
    topic_id: Optional[int] = None,
    difficulty_id: Optional[int] = None,
    question_type_id: Optional[int] = None,
    db: Session = Depends(get_db)
):

    query = db.query(Question)

    if company_id:
        query = query.filter(
            Question.company_id == company_id
        )

    if topic_id:
        query = query.filter(
            Question.topic_id == topic_id
        )

    if difficulty_id:
        query = query.filter(
            Question.difficulty_id == difficulty_id
        )

    if question_type_id:
        query = query.filter(
            Question.question_type_id == question_type_id
        )

    return query.all()

@router.get("/search/")
def search_questions(
    keyword: str,
    db: Session = Depends(get_db)
):

    questions = db.query(
        Question
    ).filter(
        Question.title.ilike(f"%{keyword}%")
    ).all()

    return questions

@router.get(
    "/{question_id}",
    response_model=QuestionResponse
)
def get_question(
    question_id: int,
    db: Session = Depends(get_db)
):

    question = db.query(
        Question
    ).filter(
        Question.id == question_id
    ).first()

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return question

@router.put(
    "/{question_id}",
    response_model=QuestionResponse
)
def update_question(
    question_id: int,
    updated_question: QuestionCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    question = db.query(
        Question
    ).filter(
        Question.id == question_id
    ).first()

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    question.title = updated_question.title
    question.description = updated_question.description
    question.answer = updated_question.answer

    question.company_id = updated_question.company_id
    question.topic_id = updated_question.topic_id
    question.difficulty_id = updated_question.difficulty_id
    question.question_type_id = updated_question.question_type_id

    db.commit()
    db.refresh(question)
    log = AuditLog(
        admin_id=current_admin.id,
        action=f"Updated question: {question.title}"
    )

    db.add(log)
    db.commit()

    return question

@router.delete("/{question_id}")
def delete_question(
    question_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    question = db.query(
        Question
    ).filter(
        Question.id == question_id
    ).first()

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    log = AuditLog(
        admin_id=current_admin.id,
        action=f"Deleted question: {question.title}"
    )

    db.add(log)
    db.commit()

    db.delete(question)
    db.commit()

    return {
        "message": "Question deleted successfully"
    }

@router.post(
    "/evaluate",
    response_model=QuestionEvaluationResponse
)
def evaluate_question(
    data: QuestionEvaluationRequest
):
    """
    Evaluate a single Question Bank answer using AI.
    """

    ai_response = evaluate_interview(
        data.question,
        data.answer
    )

    parsed = parse_feedback(ai_response)

    return {
        "score": parsed["score"],
        "strengths": parsed["strengths"],
        "improvements": parsed["improvements"],
        "ideal_answer": parsed["ideal_answer"],
        "feedback": ai_response
    }



    