# pyrefly: ignore [missing-import]
from fastapi import FastAPI 
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.upload import router as upload_router
from app.routers import admin
from app.routers.admin import router as admin_router
# pyrefly: ignore [missing-import]
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from app.routers.question import router as question_router
from app.routers.question_type import router as question_type_router
from app.routers.bookmark import router as bookmark_router
from app.routers.company import router as company_router
from app.routers.resume_analysis import router as resume_analysis_router
from app.routers.dashboard import router as dashboard_router
from app.routers import ai_interview

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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



@app.get("/")
def root():
    return {"message": "Backend Running"}

app.add_middleware(
    SessionMiddleware,
    secret_key="[ENCRYPTION_KEY]"
)
