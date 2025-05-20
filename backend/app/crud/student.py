from typing import List, Optional
from app.models.student  import StudentInDB
from app.db.session import Session
from sqlmodel import select,delete
from pydantic import ValidationError
from fastapi import HTTPException, status
from app.scripts.scripts import extract_students_data
from io import BytesIO

def get_student_by_usn(session:Session, usn:str)-> Optional[StudentInDB]:
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

def create_student_file(session:Session, buffer:BytesIO):
    dict_data=extract_students_data(buffer=buffer)
    added=""
    for row in dict_data:
        try:
            existing=session.exec(select(StudentInDB).where(StudentInDB.usn==row["usn"])).first()
            if existing:
                print("already exists")
                continue
            allowed_fields = set( StudentInDB.__fields__.keys())
            filtered_data = {k: v for k, v in row.items() if k in allowed_fields}
            student = StudentInDB(**filtered_data)
            print(filtered_data)
            session.add(student)
        except Exception as e:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    session.commit()
    
    return{"success":True}

            
            
