from app.celery_app import celery_app
from app.database import SessionLocal
from app.services.ai_interview_feedback_service import process_ai_interview_feedback


@celery_app.task
def process_ai_feedback_task(session_id):
    """
    Celery task for AI Interview evaluation.
    """
    db = SessionLocal()

    try:
        process_ai_interview_feedback(session_id, db)

    finally:
        db.close()
