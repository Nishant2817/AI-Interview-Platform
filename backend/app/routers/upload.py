from fastapi import APIRouter, UploadFile, File
import cloudinary.uploader
from sqlalchemy.orm import Session
from fastapi import Depends

from app.database import SessionLocal
from app.models.resume import Resume
from app.dependencies.auth import get_current_user
from app.core.cloudinary_config import *

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    result = cloudinary.uploader.upload(
        file.file,
        resource_type="raw"
    )

    existing_resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if existing_resume:

        existing_resume.file_name = file.filename
        existing_resume.file_url = result["secure_url"]

        db.commit()

    else:

        resume = Resume(
            user_id=current_user.id,
            file_name=file.filename,
            file_url=result["secure_url"]
        )

        db.add(resume)
        db.commit()

    return {
        "message": "Active resume updated successfully",
        "resume_url": result["secure_url"]
    }

@router.get("/my-resume")
async def get_my_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        return {
            "message": "No resume found"
        }

    return {
        "id": resume.id,
        "file_name": resume.file_name,
        "file_url": resume.file_url
    }