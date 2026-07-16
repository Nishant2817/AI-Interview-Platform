from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import pandas as pd

from app.database import SessionLocal
from app.models.question import Question
from app.dependencies.admin import get_current_admin
from app.models.user import User
from app.models.bookmark import Bookmark
from app.models.audit_log import AuditLog

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/questions/import")
async def import_questions(
    file: UploadFile = File(...),
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    df = pd.read_csv(file.file)

    for _, row in df.iterrows():

        question = Question(
            title=row["title"],
            description=row["description"],
            answer=row["answer"],
            company_id=row["company_id"],
            topic_id=row["topic_id"],
            difficulty_id=row["difficulty_id"],
            question_type_id=row["question_type_id"]
        )

        db.add(question)

    db.commit()

    log = AuditLog(
        admin_id=current_admin.id,
        action="Imported questions via CSV"
    )

    db.add(log)
    db.commit()

    return {
        "message": f"{len(df)} questions imported successfully"
    }

@router.get("/stats")
def get_stats(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()

    total_questions = db.query(
        Question
    ).count()

    total_bookmarks = db.query(
        Bookmark
    ).count()

    return {
        "total_users": total_users,
        "total_questions": total_questions,
        "total_bookmarks": total_bookmarks
    } 

@router.get("/recent-questions")
def recent_questions(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    questions = (
        db.query(Question)
        .order_by(Question.id.desc())
        .limit(5)
        .all()
    )

    return questions
