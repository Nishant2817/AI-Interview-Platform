from pydantic import BaseModel

class ProfileCreate(BaseModel):
    target_company: str | None = None
    preferred_interview_type: str | None = None
    resume_url: str | None = None


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    target_company: str | None = None
    preferred_interview_type: str | None = None
    resume_url: str | None = None

    class Config:
        from_attributes = True