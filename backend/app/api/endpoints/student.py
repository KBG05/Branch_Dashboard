from fastapi import APIRouter, Depends, HTTPException, status, Body, Path, File, UploadFile
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.student  import StudentInDB
from app.schemas.student import StudentRead, StudentFullRead, StudentList, StudentResponseMessage
from typing import Annotated
from pydantic import ValidationError
from app.crud.student import get_student_all, get_student_by_usn, create_student, create_student_file
from sqlalchemy.exc import DataError
from io import BytesIO


router=APIRouter(prefix="/student")

@router.get("/", response_model=StudentList, status_code=status.HTTP_200_OK)
def read_students(session:Session=Depends(get_session)):
    # GET /student/
    # Fetches the list of all students from the database.
    # Returns minimal data (as defined in StudentRead) for each student.
    # Useful for displaying a table or list of students on the frontend.

    data=get_student_all(session)
    
    if not data:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No students exist")

    response_data=[StudentRead.model_validate(s.model_dump()) for s in data]
    return StudentList(data=response_data, count=len(response_data))


@router.get("/{usn}", response_model=StudentFullRead)
def read_student(usn:Annotated[str, Path()], session:Session=Depends(get_session)):
    # GET /student/{usn}
    # Retrieves detailed information of a single student based on their USN.
    # Returns full student data (as defined in StudentFullRead).
    # Useful for frontend views like student profile or detailed student record.

    data=get_student_by_usn(session=session, usn=usn)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="the student does not exist")
    return data



@router.post("/", response_model=StudentResponseMessage, status_code=status.HTTP_201_CREATED)
def add_student(student:Annotated[StudentInDB, Body(embed=True)], session:Session=Depends(get_session)):
    # POST /student/
    # Accepts a student object in the request body and creates a new student in the database.
    # Validates that a student with the same USN does not already exist.
    # Returns the created student data (as defined in StudentResponse).

    try:
        response_data=create_student(student=student, session=session)
    except DataError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.add_detail("Invalid input"))
    return StudentResponseMessage(msg=f"USN:{response_data} added successfully")


@router.post("/upload-excel", response_model=StudentResponseMessage)
async def add_students_csv(file:UploadFile=File(...), session:Session=Depends(get_session) ):
    if not file.filename.endswith((".csv", ".xlsx")):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="only CSV, XLSX files supported")
    print(file.filename)
    contents=await file.read()
    buffer=BytesIO(contents)
    print(buffer)
    try:
        response_data=create_student_file(buffer=buffer, session=session)
        if not response_data["success"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="1")
        
    except TypeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)+"1")
    
    return {"msg":"excel data successfuly added"}
