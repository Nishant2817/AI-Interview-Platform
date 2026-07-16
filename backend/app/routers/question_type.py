from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.question_type import QuestionType

router = APIRouter(
    prefix="/question-types",
    tags=["Question Types"]
)

@router.get("/")
def get_question_types(
    db: Session = Depends(get_db)
):
    return db.query(
        QuestionType
    ).all()