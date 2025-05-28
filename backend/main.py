from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.db.session import engine
from app.api.endpoints import student, achievement
from app.api.endpoints import auth, reports

app=FastAPI()

app.include_router(student.router)
app.include_router(achievement.router)
app.include_router(auth.router)
app.include_router(reports.router)
app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])