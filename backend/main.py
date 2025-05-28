from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.db.session import engine
from app.models.student import StudentInDB
from app.models.achievement import AchievementInDB
from app.models.result import ResultInDB
from app.api.endpoints import student


app=FastAPI()

app.include_router(student.router)
app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])