from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.dependencies.auth import get_current_user

from app.models.ai_interview_session import AIInterviewSession
from app.models.ai_interview_feedback import AIInterviewFeedback
from app.models.resume import Resume

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/stats")
def get_dashboard_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    total_interviews = (
        db.query(AIInterviewSession)
        .filter(
            AIInterviewSession.user_id == current_user.id
        )
        .count()
    )

    completed_interviews = (
        db.query(AIInterviewSession)
        .filter(
            AIInterviewSession.user_id == current_user.id,
            AIInterviewSession.status == "evaluated"
        )
        .count()
    )

    resume_uploaded = (
        db.query(Resume)
        .filter(
            Resume.user_id == current_user.id
        )
        .first()
        is not None
    )

    scores = (
        db.query(AIInterviewFeedback.overall_score)
        .join(
            AIInterviewSession,
            AIInterviewFeedback.session_id == AIInterviewSession.id
        )
        .filter(
            AIInterviewSession.user_id == current_user.id
        )
        .all()
    )

    score_list = [score[0] for score in scores]

    average_score = (
        round(sum(score_list) / len(score_list))
        if score_list else 0
    )

    best_score = (
        max(score_list)
        if score_list else 0
    )

    return {
        "total_interviews": total_interviews,
        "completed_interviews": completed_interviews,
        "average_score": average_score,
        "best_score": best_score,
        "resume_uploaded": resume_uploaded
    }


@router.get("/recent-ai-interviews")
def get_recent_interviews(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    interviews = (
        db.query(
            AIInterviewSession,
            AIInterviewFeedback
        )
        .join(
            AIInterviewFeedback,
            AIInterviewSession.id == AIInterviewFeedback.session_id
        )
        .filter(
            AIInterviewSession.user_id == current_user.id
        )
        .order_by(AIInterviewSession.created_at.desc())
        .limit(5)
        .all()
    )

    result = []

    for session, feedback in interviews:

        result.append({
            "session_id": session.id,
            "company": session.company,
            "score": feedback.overall_score,
            "status": session.status,
            "date": session.created_at.strftime("%d %b %Y")
        })

    return result
@router.get("/score-distribution")
def get_score_distribution(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    scores = (
        db.query(AIInterviewFeedback.overall_score)
        .join(
            AIInterviewSession,
            AIInterviewFeedback.session_id == AIInterviewSession.id
        )
        .filter(
            AIInterviewSession.user_id == current_user.id
        )
        .all()
    )

    excellent = 0
    average = 0
    needs_improvement = 0

    for score in scores:

        score = score[0]

        if score >= 8:
            excellent += 1

        elif score >= 5:
            average += 1

        else:
            needs_improvement += 1

    return {
        "excellent": excellent,
        "average": average,
        "needs_improvement": needs_improvement
    }
@router.get("/achievements")
def get_achievements(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    total = (
        db.query(AIInterviewSession)
        .filter(
            AIInterviewSession.user_id == current_user.id,
            AIInterviewSession.status == "evaluated"
        )
        .count()
    )

    scores = (
        db.query(AIInterviewFeedback.overall_score)
        .join(
            AIInterviewSession,
            AIInterviewFeedback.session_id == AIInterviewSession.id
        )
        .filter(
            AIInterviewSession.user_id == current_user.id
        )
        .all()
    )

    best_score = max([s[0] for s in scores]) if scores else 0

    resume_uploaded = (
        db.query(Resume)
        .filter(
            Resume.user_id == current_user.id
        )
        .first()
        is not None
    )

    return {

        "first_interview": total >= 1,

        "practice_starter": total >= 5,

        "consistent_candidate": total >= 10,

        "high_performer": best_score >= 8,

        "interview_master": best_score == 10,

        "resume_ready": resume_uploaded
    }