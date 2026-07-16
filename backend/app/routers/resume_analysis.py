from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.resume_ai_services import (extract_resume_text,analyze_resume,parse_resume_feedback,)
from app.models.resume_analysis import ResumeAnalysis
from app.database import SessionLocal
from app.dependencies.auth import get_current_user


from app.models.resume import Resume

router = APIRouter(
    prefix="/resume",
    tags=["Resume Analysis"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/analyze")
def analyze_resume_route(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    resume = (
        db.query(Resume)
        .filter(
            Resume.user_id == current_user.id
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )
    
    resume_text = extract_resume_text(resume.file_url)
    ai_response = analyze_resume(resume_text)
    parsed_feedback = parse_resume_feedback(ai_response)

    existing_analysis = (
    db.query(ResumeAnalysis)
    .filter(
        ResumeAnalysis.resume_id == resume.id
    )
    .first()
)

    if existing_analysis:
        existing_analysis.ats_score = parsed_feedback["ats_score"]
        existing_analysis.strengths = parsed_feedback["strengths"]
        existing_analysis.weaknesses = parsed_feedback["weaknesses"]
        existing_analysis.missing_skills = parsed_feedback["missing_skills"]
        existing_analysis.suggested_roles = parsed_feedback["suggested_roles"]
        existing_analysis.overall_feedback = parsed_feedback["overall_feedback"]
    else:
        analysis = ResumeAnalysis(
            resume_id=resume.id,
            user_id=current_user.id,
            ats_score=parsed_feedback["ats_score"],
            strengths=parsed_feedback["strengths"],
            weaknesses=parsed_feedback["weaknesses"],
            missing_skills=parsed_feedback["missing_skills"],
            suggested_roles=parsed_feedback["suggested_roles"],
            overall_feedback=parsed_feedback["overall_feedback"],
        )
        db.add(analysis)

    db.commit()

    return {
        "message": "Resume analyzed successfully",
        "analysis": parsed_feedback
    }