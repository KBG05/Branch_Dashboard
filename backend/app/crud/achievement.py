from typing import Optional, List
from app.models.achievement import AchievementInDB
from app.schemas.achievement import AchievementList, AchievementUpdate, AchievementRead
from sqlmodel import Session, select
from fastapi import HTTPException, status
from uuid import UUID 

def get_achievement_all(session:Session)->AchievementList:
    data=session.exec(select(AchievementInDB)).all()
    return AchievementList(data=data, count=len(data))
    

def get_achievement_usn(usn:str, session:Session)-> AchievementList | AchievementRead:
    data=session.exec(select(AchievementInDB).where(AchievementInDB.usn==usn)).all()
    return AchievementList(data=data, count=len(data))
    

def create_achievement(achievement:AchievementInDB, session:Session)->dict:
    session.add(achievement)
    session.commit()
    session.refresh(achievement)
    return {"success":True}

def update_achievement(achievement:AchievementUpdate, session:Session)->dict:
    existing=session.exec(select(AchievementInDB).where(AchievementInDB.id==achievement.id)).first()
    
    if(not existing):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="achievement does not exist")
    
    for key, value in achievement.model_dump(exclude_unset=True).items():
        setattr(existing,key, value)
    
    
    session.add(existing)
    session.commit()
    session.refresh(existing)
    return{"success":True}

def delete_achievement(id:UUID, session:Session)->dict:
    existing=session.exec(select(AchievementInDB).where(AchievementInDB.id==id)).first()
    
    if(not existing):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="achievement does not exist")
    
    session.delete(existing)
    session.commit()
    return {"success":True}