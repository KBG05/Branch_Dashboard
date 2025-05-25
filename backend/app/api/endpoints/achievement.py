from fastapi import APIRouter, Depends, HTTPException, status, Body, Path, File, UploadFile, Form
from sqlmodel import Session
from app.db.session import get_session
from io import BytesIO
from app.models.achievement import AchievementInDB
from app.schemas.achievement import AchievementRead, AchievementList, AchievementUpdate, AchievementResponseMessage
from app.crud.achievement import get_achievement_all, get_achievement_usn, create_achievement, update_achievement
from typing import List

router=APIRouter(prefix="/achievement", tags=["Achievement Management"])

@router.get("/", response_model=AchievementList, status_code=status.HTTP_200_OK)
def read_achievements(session:Session=Depends(get_session)):
    
    data:AchievementList=get_achievement_all(session=session)
    if(data.count==0):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="no achievements")
    return data

@router.get("/{usn}", response_model=AchievementList, status_code=status.HTTP_200_OK)
def read_achievement(usn:str, session:Session=Depends(get_session)):
    data:AchievementList=get_achievement_usn(usn=usn, session=session)
    if(data.count==0):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="no achievements")
    
    return data

@router.post("/", response_model=AchievementResponseMessage , status_code=status.HTTP_200_OK)
def add_achievement(achievement:AchievementInDB, session:Session=Depends(get_session)):
    
    try:
        data:dict=create_achievement(session=session, achievement=achievement)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)+"1")
    
    return AchievementResponseMessage(msg="Achievement added successfully")

@router.put("/", response_model=AchievementResponseMessage, status_code=status.HTTP_200_OK)
def update_achievement_data(achievement:AchievementUpdate, session:Session=Depends(get_session)):
    
    try:
        data:dict=update_achievement(session=session, achievement=achievement)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)+"2")
    
    return AchievementResponseMessage(msg="Achievement updated successfully")
        
        
        
        