from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
from  uuid import uuid4, UUID


class ResultInDB(SQLModel, table=True):
    __tablename__="result"
    id:Optional[UUID]=Field(default_factory=uuid4, primary_key=True)
    usn:str=Field(foreign_key="student.usn", nullable=False, index=True)
    name:str
    subject:str
    grade:str=Field(max_length=3)
    sgpa:Optional[float]=None
    backlog:int=Field()
    created_at:Optional[datetime]=Field(default_factory=lambda:datetime.now(timezone.utc))




