from sqlmodel import create_engine, Session
from app.core.config import DATABASE_URL
from app.models.model import AchievementInDB, StudentInDB, ResultInDB

engine=create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session