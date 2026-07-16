from datetime import datetime
from sqlalchemy.orm import Session

from app.models.ai_interview_session import AIInterviewSession
from app.models.ai_interview_answer import AIInterviewAnswer
from app.models.ai_interview_feedback import AIInterviewFeedback
from app.models.ai_interview_answer_feedback import AIInterviewAnswerFeedback
from app.services.ai_service import evaluate_interview, parse_feedback


def process_ai_interview_feedback(session_id: int, db: Session):
    """
    Celery-safe service function.
    Reads ai_interview_answers for the session, evaluates each with Groq AI,
    writes per-answer feedback and overall session feedback to DB.
    """

    session = (
        db.query(AIInterviewSession)
        .filter(AIInterviewSession.id == session_id)
        .first()
    )

    if not session:
        return

    answers = (
        db.query(AIInterviewAnswer)
        .filter(AIInterviewAnswer.session_id == session_id)
        .order_by(AIInterviewAnswer.question_number)
        .all()
    )

    total_score = 0
    all_strengths = ""
    all_improvements = ""
    full_feedback_text = ""

    for answer in answers:
        # Treat empty answers gracefully
        candidate_answer = answer.answer_text or "(No answer provided)"

        raw_feedback = evaluate_interview(answer.question_text, candidate_answer)

        parsed = parse_feedback(raw_feedback)

        answer_fb = AIInterviewAnswerFeedback(
            answer_id=answer.id,
            score=parsed["score"],
            strengths=parsed["strengths"],
            improvements=parsed["improvements"],
            ideal_answer=parsed["ideal_answer"],
            feedback=raw_feedback,
        )

        db.add(answer_fb)

        total_score += parsed["score"]
        all_strengths += parsed["strengths"] + "\n\n"
        all_improvements += parsed["improvements"] + "\n\n"
        full_feedback_text += (
            f"\n\nQuestion: {answer.question_text}\n{raw_feedback}\n"
        )

    overall_score = 0
    if answers:
        overall_score = round(total_score / len(answers))

    session_fb = AIInterviewFeedback(
        session_id=session_id,
        overall_score=overall_score,
        strengths=all_strengths.strip(),
        improvements=all_improvements.strip(),
        feedback=full_feedback_text.strip(),
    )

    db.add(session_fb)

    # Mark session as evaluated
    session.status = "evaluated"
    session.completed_at = datetime.utcnow()

    db.commit()
