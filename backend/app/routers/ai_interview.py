from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.config.interview_roles import INTERVIEW_ROLES
from app.schemas.ai_interview import AIInterviewRequest, AIInterviewSubmitRequest
from app.services.ai_question_service import generate_questions
from app.dependencies import get_db
from app.dependencies.auth import get_current_user
from app.models.ai_interview_session import AIInterviewSession
from app.models.ai_interview_answer import AIInterviewAnswer
from app.models.ai_interview_feedback import AIInterviewFeedback
from app.models.ai_interview_answer_feedback import AIInterviewAnswerFeedback
from app.tasks.ai_tasks import process_ai_feedback_task
from celery.result import AsyncResult
from app.celery_app import celery_app

router = APIRouter(
    prefix="/ai-interview",
    tags=["AI Interview"]
)

# ── Existing generation endpoints ──────────────────────────────────────────

@router.get("/test")
def test_ai_interview():
    return {"message": "AI Interview Router Working"}


@router.get("/interview-types")
def get_interview_types():
    return ["technical", "hr", "behavioral", "non_technical"]


@router.get("/roles/{interview_type}")
def get_roles(interview_type: str):
    roles = INTERVIEW_ROLES.get(interview_type.lower())
    if not roles:
        return {"roles": []}
    return {"roles": roles}


@router.post("/generate")
def generate_ai_interview(request: AIInterviewRequest):
    return generate_questions(request)


# ── New: Submit AI Interview ────────────────────────────────────────────────

@router.post("/submit")
def submit_ai_interview(
    data: AIInterviewSubmitRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Called when the user submits their AI interview answers.
    Persists session + answers to DB, dispatches evaluation task.
    Returns session_id + task_id for the frontend to poll.
    """

    # 1. Create session record
    session = AIInterviewSession(
        user_id=current_user.id,
        company=data.company,
        role=data.role,
        interview_type=data.interview_type,
        experience_level=data.experience_level,
        difficulty=data.difficulty,
        duration=data.duration,
        question_count=data.question_count,
        status="submitted",
        created_at=datetime.utcnow(),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # 2. Persist each answer
    for item in data.answers:
        answer = AIInterviewAnswer(
            session_id=session.id,
            question_number=item.question_id,
            question_text=item.question,
            question_type=item.type,
            topic=item.topic,
            difficulty=item.difficulty,
            answer_text=item.answer or "",
            correct_answer=item.correct_answer,
        )
        db.add(answer)

    db.commit()

    # 3. Dispatch Background task
    task = process_ai_feedback_task.delay(session.id)

    return {
        "message": "AI interview submitted successfully",
        "session_id": session.id,
        "task_id": str(task.id),  # Use session_id as task_id for polling
    }


# ── New: Poll task status ────────────────────────────────────────────

@router.get("/task-status/{task_id}")
def get_ai_task_status(task_id: str):
    """
    Returns Celery task status for frontend polling.
    """

    task = AsyncResult(task_id, app=celery_app)

    if task.state == "PENDING":
        return {
            "status": "processing"
        }

    elif task.state == "STARTED":
        return {
            "status": "processing"
        }

    elif task.state == "SUCCESS":
        return {
            "status": "completed"
        }

    elif task.state == "FAILURE":
        return {
            "status": "failed"
        }

    return {
        "status": task.state
    }

# ── New: Fetch full report ──────────────────────────────────────────────────

@router.get("/report/{session_id}")
def get_ai_interview_report(
    session_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns the full AI interview report including per-question scores,
    strengths, improvements, and ideal answers.
    """

    session = (
        db.query(AIInterviewSession)
        .filter(
            AIInterviewSession.id == session_id,
            AIInterviewSession.user_id == current_user.id,
        )
        .first()
    )

    if not session:
        raise HTTPException(status_code=404, detail="AI Interview session not found")

    feedback = (
        db.query(AIInterviewFeedback)
        .filter(AIInterviewFeedback.session_id == session_id)
        .first()
    )

    if not feedback:
        raise HTTPException(
            status_code=404,
            detail="Interview report is not ready yet. Please wait for evaluation to complete.",
        )

    answers = (
        db.query(AIInterviewAnswer)
        .filter(AIInterviewAnswer.session_id == session_id)
        .order_by(AIInterviewAnswer.question_number)
        .all()
    )

    answer_list = []
    for answer in answers:
        answer_fb = (
            db.query(AIInterviewAnswerFeedback)
            .filter(AIInterviewAnswerFeedback.answer_id == answer.id)
            .first()
        )

        answer_list.append(
            {
                "question_number": answer.question_number,
                "question": answer.question_text,
                "type": answer.question_type,
                "topic": answer.topic,
                "difficulty": answer.difficulty,
                "your_answer": answer.answer_text or "(No answer provided)",
                "correct_answer": answer.correct_answer,
                "score": answer_fb.score if answer_fb else None,
                "strengths": answer_fb.strengths if answer_fb else "",
                "improvements": answer_fb.improvements if answer_fb else "",
                "ideal_answer": answer_fb.ideal_answer if answer_fb else "",
                "feedback": answer_fb.feedback if answer_fb else "",
            }
        )

    return {
        "session_id": session.id,
        "company": session.company,
        "role": session.role,
        "interview_type": session.interview_type,
        "experience_level": session.experience_level,
        "difficulty": session.difficulty,
        "duration": session.duration,
        "status": session.status,
        "created_at": session.created_at,
        "completed_at": session.completed_at,
        "overall_score": feedback.overall_score,
        "strengths": feedback.strengths,
        "improvements": feedback.improvements,
        "feedback": feedback.feedback,
        "answers": answer_list,
    }


# ── New: Fallback polling endpoint ──────────────────────────────────────────

@router.get("/feedback-ready/{session_id}")
def check_feedback_ready(
    session_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fallback: frontend can poll this if Redis task-status is unreliable.
    Returns 200 with score when ready, 404 if still processing.
    """
    feedback = (
        db.query(AIInterviewFeedback)
        .filter(AIInterviewFeedback.session_id == session_id)
        .first()
    )

    if not feedback:
        raise HTTPException(status_code=404, detail="Not ready yet")

    return {"score": feedback.overall_score, "status": "ready"}


# ── New: Fetch Interview History ────────────────────────────────────────────

@router.get("/history")
def get_ai_interview_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(AIInterviewSession)
        .filter(AIInterviewSession.user_id == current_user.id)
        .order_by(AIInterviewSession.id.desc())
        .all()
    )

    history = []
    for session in sessions:
        history.append({
            "id": session.id,
            "company_name": session.company,
            "status": session.status,
            "started_at": session.created_at,
            "completed_at": session.completed_at
        })

    return history