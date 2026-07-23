from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.schemas.auth import ForgotPasswordRequest, ResetPasswordRequest, LoginRequest
from app.core.jwt import create_reset_token, verify_reset_token, create_access_token, create_refresh_token
from app.services.email import send_reset_email
import os

from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import hash_password, verify_password
from app.dependencies import get_db
from app.dependencies.auth import get_current_user
from app.core.oauth import oauth


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": existing_user.email
        }
    )

    refresh_token = create_refresh_token(
        data={
            "sub": existing_user.email
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": existing_user.role
    }

@router.get("/profile")
def get_profile(
    current_user = Depends(get_current_user)
):
    return {
        "message": "Protected Route Accessed",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role,
            "target_companies": current_user.target_companies,
            "interview_types": current_user.interview_types,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        }
    }

@router.get("/google/login")
async def google_login(request: Request):

    backend_url = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
    redirect_uri = f"{backend_url}/auth/google/callback"

    print("Redirect URI:", redirect_uri)

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )

@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):

    token = await oauth.google.authorize_access_token(
        request
    )

    user_info = token.get("userinfo")

    email = user_info["email"]
    name = user_info["name"]

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if not existing_user:

        new_user = User(
            name=name,
            email=email,
            password="google_oauth"
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        existing_user = new_user

    access_token = create_access_token(
        {
            "sub": existing_user.email
        }
    )

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return RedirectResponse(
        url=f"{frontend_url}/google-success?token={access_token}"
    )

@router.get("/test-email")
async def test_email():

    await send_reset_email(
        "nishantpandey1838@gmail.com",
        "https://example.com/reset"
    )

    return {
        "message": "Email sent"
    } 
@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == request.email
    ).first()

    print("User found:", user)

    token = create_reset_token(
        user.email
    )
    print("Token generated")

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password?token={token}"
    print("Reset link:", reset_link)

    await send_reset_email(
        user.email,
        reset_link
    )
    print("Email function completed")

    return {
        "message": "Reset link sent successfully"
    } 
@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    email = verify_reset_token(
        request.token
    )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.password = hash_password(
        request.new_password
    )

    db.commit()

    return {
        "message": "Password reset successful"
    }

@router.put("/profile/update")
def update_profile(
    data: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == current_user.id
    ).first()

    user.name = data.get(
        "name",
        user.name
    )

    user.target_companies = ",".join(
        data.get("target_companies", [])
    )

    user.interview_types = ",".join(
        data.get("interview_types", [])
    )

    db.commit()

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "target_companies": user.target_companies,
            "interview_types": user.interview_types
        }
    }