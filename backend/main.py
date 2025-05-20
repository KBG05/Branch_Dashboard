from fastapi import FastAPI
from sqlmodel import SQLModel
from app.db.session import engine
from app.models.student import StudentInDB
from app.models.achievement import AchievementInDB
from app.models.result import ResultInDB
from app.api.endpoints import student


from contextlib import asynccontextmanager
@asynccontextmanager
async def lifespan(app:FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app=FastAPI(lifespan=lifespan)

app.include_router(student.router)
