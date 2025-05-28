from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from  uuid import uuid4, UUID

class AchievementInDB(SQLModel, table=True):
    __tablename__="achievement"
    id:UUID=Field(default_factory=uuid4, primary_key=True)
    usn:str=Field(foreign_key="student.usn", nullable=False, index=True)
    title:str
    description:Optional[str]=None
    achievement_type:Optional[str]=None
    achievement_date:Optional[str]=None
    certificated_url:Optional[str]=None




