from  pydantic import BaseModel, Field
from typing import Optional, Annotated
from uuid import UUID
from datetime import datetime

class AchievementRead(BaseModel):
    id:UUID
    usn:str
    title:str
    description:Optional[str]=None
    achievement_type:Optional[str]=None
    achievement_date:Optional[datetime]=None
    certificated_url:Optional[str]=None
    
class AchievementList(BaseModel):
    data:list[AchievementRead]
    count:int

class AchievementUpdate(BaseModel):
    usn:Annotated[str, Field(default=None)]
    title:Annotated[Optional[str], Field(default=None)]
    description:Annotated[Optional[str], Field(default=None)]
    achievement_type:Annotated[Optional[str], Field(default=None)]
    achievement_date:Annotated[Optional[datetime], Field(default=None)]
    certificated_url:Annotated[Optional[str], Field(default=None)]


class AchievementResponseMessage(BaseModel):
    msg:str