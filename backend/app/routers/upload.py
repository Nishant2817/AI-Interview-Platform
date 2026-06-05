from fastapi import APIRouter, UploadFile, File
import cloudinary.uploader

from app.core.cloudinary_config import *

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...)
):

    result = cloudinary.uploader.upload(
        file.file,
        resource_type="raw"
    )

    return {
        "resume_url": result["secure_url"]
    }