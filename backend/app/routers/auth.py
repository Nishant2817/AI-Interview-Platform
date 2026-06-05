from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import Request
from starlette.responses import RedirectResponse
from app.schemas.auth import (ForgotPasswordRequest, ResetPasswordRequest)
from app.core.jwt import ( create_reset_token, verify_reset_token)
from app.services.email import send_reset_email

from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import hash_password
from app.dependencies import get_db
from app.schemas.auth import LoginRequest
from app.core.jwt import create_access_token,create_refresh_token
from app.core.security import verify_password
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
        "token_type": "bearer"
    }

@router.get("/profile")
def get_profile(
    current_user = Depends(get_current_user)
):
    return {
        "message": "Protected Route Accessed",
        "user": current_user
    }

@router.get("/google/login")
async def google_login(request: Request):

    redirect_uri = "http://127.0.0.1:8000/auth/google/callback"

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

    return {
        "message": "Google Login Success",
        "access_token": access_token,
        "user": {
            "name": existing_user.name,
            "email": existing_user.email
        }
    }  

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

    reset_link = (
        f"http://localhost:3000/reset-password?token={token}"
    )
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
