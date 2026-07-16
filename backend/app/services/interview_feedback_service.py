from datetime import datetime
from sqlalchemy.orm import Session

from app.models.interview_session import InterviewSession
from app.models.session_answer import SessionAnswer
from app.models.question import Question
from app.models.interview_feedback import InterviewFeedback
from app.models.interview_answer_feedback import InterviewAnswerFeedback

from app.services.ai_service import (
    evaluate_interview,
    parse_feedback
)


def process_interview_feedback(
    session_id: int,
    db: Session
):

    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id)
        .first()
    )

    if not session:
        return

    answers = (
        db.query(SessionAnswer)
        .filter(SessionAnswer.session_id == session_id)
        .all()
    )

    feedback_text = ""

    total_score = 0

    all_strengths = ""

    all_improvements = ""

    all_ideal_answers = ""

    for answer in answers:

        question = (
            db.query(Question)
            .filter(
                Question.id == answer.question_id
            )
            .first()
        )

        ai_feedback = evaluate_interview(
            question.title,
            answer.answer_text
        )

        parsed = parse_feedback(
            ai_feedback
        )

        answer_feedback = InterviewAnswerFeedback(
            answer_id=answer.id,
            score=parsed["score"],
            strengths=parsed["strengths"],
            improvements=parsed["improvements"],
            ideal_answer=parsed["ideal_answer"],
            feedback=ai_feedback
        )

        db.add(answer_feedback)

        total_score += parsed["score"]

        all_strengths += parsed["strengths"] + "\n\n"

        all_improvements += parsed["improvements"] + "\n\n"

        all_ideal_answers += parsed["ideal_answer"] + "\n\n"

        feedback_text += (
            f"\n\nQuestion: {question.title}\n"
            f"{ai_feedback}\n"
        )

    average_score = 0

    if len(answers) > 0:
        average_score = round(total_score / len(answers))

    interview_feedback = InterviewFeedback(
        session_id=session_id,
        score=average_score,
        strengths=all_strengths,
        improvements=all_improvements,
        ideal_answer=all_ideal_answers,
        feedback=feedback_text
    )

    db.add(interview_feedback)

    db.commit()
    