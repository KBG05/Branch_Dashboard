from fastapi import APIRouter, Depends, HTTPException, status, Body, Path, File, UploadFile, Form
from sqlmodel import Session
from app.db.session import get_session
from io import BytesIO
from app.models.model import AchievementInDB
from app.schemas.achievement import AchievementRead, AchievementList, AchievementUpdate, AchievementResponseMessage
from app.crud.achievement import get_achievement_all, get_achievement_usn, create_achievement, update_achievement, create_achievement_file, delete_achievement
from typing import List
from uuid import UUID
from app.api.dependency import get_current_user
router=APIRouter(prefix="/achievement", tags=["Achievement Management"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=AchievementList, status_code=status.HTTP_200_OK)
def read_achievements(session:Session=Depends(get_session)):
    
    data:AchievementList=get_achievement_all(session=session)

    return data

@router.get("/{usn}", response_model=AchievementList, status_code=status.HTTP_200_OK)
def read_achievement(usn:str, session:Session=Depends(get_session)):
    data:AchievementList=get_achievement_usn(usn=usn, session=session)
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
        
        
@router.delete("/{id}", response_model=AchievementResponseMessage, status_code=status.HTTP_200_OK)
def delete_achivement_data(id:UUID, session:Session=Depends(get_session)):
    try:
        data:dict=delete_achievement(id=id,session=session)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)+"3")
    return AchievementResponseMessage(msg="Achievement updated successfully")

        
@router.post("/upload-excel", response_model=AchievementResponseMessage)
async def add_achievements_csv(file:UploadFile=File(...), session:Session=Depends(get_session) ):
    
    if not file.filename.endswith((".csv", ".xlsx")):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="only CSV, XLSX files supported")
    contents=await file.read()
    buffer=BytesIO(contents)
    
    try:
        response_data=create_achievement_file(buffer=buffer, session=session)
        if not response_data["success"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="1")
        
    except TypeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)+"1")
    
    return AchievementResponseMessage(msg="excel data successfuly added")