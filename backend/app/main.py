# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.upload import router as upload_router
from app.routers.admin import router as admin_router
from app.routers.question import router as question_router
from app.routers.question_type import router as question_type_router
from app.routers.bookmark import router as bookmark_router
from app.routers.company import router as company_router
from app.routers.resume_analysis import router as resume_analysis_router
from app.routers.dashboard import router as dashboard_router
from app.routers import ai_interview

# pyrefly: ignore [missing-import]
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

import os

app = FastAPI()


# CORS Configuration — origins built dynamically from env vars

_base_origins = [
    # Local Development
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add production frontend URL from environment variable (set this on Railway)
_frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
if _frontend_url:
    _base_origins.append(_frontend_url)

# Fallback: keep the known Vercel URL in case env var isn't set yet
_known_vercel = "https://ai-interview-platform-olive-phi.vercel.app"
if _known_vercel not in _base_origins:
    _base_origins.append(_known_vercel)

print(f"[CORS] Allowed origins: {_base_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_base_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Session Middleware

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "fallback_secret_key")
)


# Routers

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(upload_router)
app.include_router(question_router)
app.include_router(bookmark_router)
app.include_router(admin_router)
app.include_router(question_type_router)
app.include_router(company_router)
app.include_router(resume_analysis_router)
app.include_router(dashboard_router)
app.include_router(ai_interview.router)


# Root Endpoint

@app.get("/")
def root():
    return {"message": "Backend Running"}

# Health Check
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "PrepForge Backend",
        "version": "1.0.0"
    }