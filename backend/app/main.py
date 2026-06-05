# pyrefly: ignore [missing-import]
from fastapi import FastAPI 
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.upload import router as upload_router
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(upload_router)

@app.get("/")
def root():
    return {"message": "Backend Running"}

app.add_middleware(
    SessionMiddleware,
    secret_key="[ENCRYPTION_KEY]"
)
