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


