from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
from  uuid import uuid4, UUID


class StudentInDB(SQLModel, table=True):
    __tablename__ = "student"
    
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    usn: str = Field(default=None, nullable=False, index=True, unique=True)
    name: str
    gender: Optional[str] = Field(max_length=1, nullable=True)
    doa: Optional[datetime] = None
    dob: Optional[datetime] = None
    semester: Optional[str] = None
    seat_type: Optional[str] = None
    ranking: Optional[str] = None
    allotted_category: Optional[str] = None
    rural_urban: Optional[str] = None
    state: Optional[str] = None
    non_ka_state: Optional[str] = None
    state_code: Optional[str] = None
    batch: Optional[int] = None
    branch: Optional[str] = Field(default="Robotics & AI")
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))


class AchievementInDB(SQLModel, table=True):
    __tablename__="achievement"
    
    id:UUID=Field(default_factory=uuid4, primary_key=True)
    usn:str=Field(foreign_key="student.usn", nullable=False, index=True)
    title:str
    description:Optional[str]=None
    achievement_type:Optional[str]=None
    achievement_date:Optional[str]=None
    certificated_url:Optional[str]=None


class ResultInDB(SQLModel, table=True):
    __tablename__="result"
    
    id:Optional[UUID]=Field(default_factory=uuid4, primary_key=True)
    usn:str=Field(foreign_key="student.usn", nullable=False, index=True)
    name:str
    subject:str
    grade:str=Field(max_length=3)
    sgpa:Optional[float]=None
    created_at:Optional[datetime]=Field(default_factory=lambda:datetime.now(timezone.utc))
    

class UserInDB(SQLModel, table=True):
    __tablename__="user"
    id:Optional[UUID]=Field(default_factory=uuid4, primary_key=True)
    username:str=Field( nullable=False, unique=True, index=True)
    hashed_password:str=Field(nullable=False)

    