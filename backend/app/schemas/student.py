from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel


class StudentBase(BaseModel):
    usn:str

class StudentFullRead(StudentBase):
    usn:str=Field(default=None)
    name:str
    gender:str=Field(max_length=1)
    doa:Optional[datetime]=None
    seat_type:str
    ranking:Optional[str]=None
    batch:int
    branch:str
    state:str

class StudentRead(StudentBase):
    usn:str
    name:str
    branch:str
    batch:int

class StudentList(SQLModel):
    data:list[StudentRead]
    count:int

class StudentResponseMessage(SQLModel):
    msg:str
    
class StudentUpdate(BaseModel):
    usn:Optional[str]=Field(default=None)
    name:Optional[str]=Field(default=None)
    gender:Optional[str]=Field(max_length=1, default=None)
    doa:Optional[datetime]=None
    seat_type:Optional[str]=Field(default=None)
    ranking:Optional[str]=None
    batch:Optional[int]=Field(default=None)
    branch:Optional[str]=Field(default=None)
    state:Optional[str]=Field(default=None)