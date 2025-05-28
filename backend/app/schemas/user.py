from pydantic import BaseModel

from uuid import UUID

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: UUID
    username: str

class UserLogin(BaseModel):
    username: str
    password: str
