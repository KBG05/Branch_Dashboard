from typing import Optional, List
from app.models.model import AchievementInDB
from app.schemas.achievement import AchievementList, AchievementUpdate, AchievementRead
from sqlmodel import Session, select
from fastapi import HTTPException, status
from uuid import UUID 
from io import BytesIO
from app.scripts.scripts import extract_achievements_data

def get_achievement_all(session:Session)->AchievementList:
    data=session.exec(select(AchievementInDB)).all()
    response_data=[AchievementRead.model_validate(s.model_dump()) for s in data]
    return AchievementList(data=response_data, count=len(response_data))
    

def get_achievement_usn(usn:str, session:Session)-> AchievementList | AchievementRead:
    data=session.exec(select(AchievementInDB).where(AchievementInDB.usn==usn)).all()
    response_data=[AchievementRead.model_validate(s.model_dump()) for s in data]
    return AchievementList(data=response_data, count=len(response_data))
    

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

def create_achievement_file(buffer:BytesIO, session:Session):
    
    dict_data=extract_achievements_data(buffer)
    if(not dict_data):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="empty csv file")
    for row in dict_data:
        achievement=AchievementInDB(**row)
        session.add(achievement)
        session.commit()
        session.refresh(achievement)
    return{"success":True}
        


def delete_achievement(id:UUID, session:Session)->dict:
    existing=session.exec(select(AchievementInDB).where(AchievementInDB.id==id)).first()
    
    if(not existing):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="achievement does not exist")
    
    session.delete(existing)
    session.commit()
    return {"success":True}