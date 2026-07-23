from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.bookmark import Bookmark
from app.models.question import Question
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/bookmarks",
    tags=["Bookmarks"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/{question_id}")
def add_bookmark(
    question_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    question = db.query(Question).filter(
        Question.id == question_id
    ).first()

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    existing_bookmark = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.question_id == question_id
    ).first()

    if existing_bookmark:
        return {
            "message": "Question already bookmarked"
        }

    bookmark = Bookmark(
        user_id=current_user.id,
        question_id=question_id
    )

    db.add(bookmark)
    db.commit()

    return {
        "message": "Question bookmarked successfully"
    }
@router.get("")
def get_bookmarks(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    bookmarks = db.query(
        Bookmark
    ).filter(
        Bookmark.user_id == current_user.id
    ).all()

    return bookmarks 

@router.delete("/{question_id}")
def remove_bookmark(
    question_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    bookmark = db.query(
        Bookmark
    ).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.question_id == question_id
    ).first()

    if not bookmark:
        raise HTTPException(
            status_code=404,
            detail="Bookmark not found"
        )

    db.delete(bookmark)
    db.commit()

    return {
        "message": "Bookmark removed successfully"
    } 