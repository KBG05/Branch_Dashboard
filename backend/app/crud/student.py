from typing import List, Optional
from app.models.student  import StudentInDB
from app.db.session import Session
from sqlmodel import select
from fastapi import HTTPException, status
from app.scripts.scripts import extract_students_data
from io import BytesIO
from  app.schemas.student import StudentUpdate

def get_student_by_usn(session:Session, usn:str)-> StudentInDB:
    return session.exec(select(StudentInDB).where(StudentInDB.usn==usn)).first()

def get_student_all(session:Session)->List[StudentInDB]:
    return session.exec(select(StudentInDB)).all()

def create_student(session:Session, student:StudentInDB):
            existing=session.exec(select(StudentInDB).where(StudentInDB.usn==student.usn)).first()

            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="student with the usn already exists")
            
            session.add(student)
            session.commit()
            session.refresh(student)
            return student.usn

def create_student_file(session:Session, buffer:BytesIO)->dict:
    dict_data=extract_students_data(buffer=buffer)
    for row in dict_data:
        try:
            existing=session.exec(select(StudentInDB).where(StudentInDB.usn==row["usn"])).first()
            if existing:
                continue
            allowed_fields = set( StudentInDB.__fields__.keys())
            filtered_data = {k: v for k, v in row.items() if k in allowed_fields}
            student = StudentInDB(**filtered_data)
            session.add(student)
        except Exception as e:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    session.commit()
    
    return{"success":True}

def update_student(session:Session, student:StudentUpdate )->dict:
    existing=session.exec(select(StudentInDB).where(StudentInDB.usn==student.usn)).first()

    if (not existing):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="student does not exist")
    for key, value in student.model_dump(exclude_unset=True).items():
        setattr(existing, key, value)
    
    session.add(existing)
    session.commit()
    session.refresh(existing)
    return{"success":True}
        
            
