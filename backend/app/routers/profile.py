from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.profile import Profile
from app.schemas.profile import (
    ProfileCreate,
    ProfileResponse
)

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("", response_model=ProfileResponse)
def create_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db)
):

    new_profile = Profile(
        user_id=1,  # temporary
        target_company=profile.target_company,
        preferred_interview_type=profile.preferred_interview_type,
        resume_url=profile.resume_url
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@router.get("/{user_id}",
            response_model=ProfileResponse)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    profile = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    return profile

    