from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Response
from app.api.dependency  import get_current_user
from app.db.session import get_session
from app.models.model import ResultInDB, AchievementInDB, StudentInDB
from sqlmodel import Session
from app.schemas.achievement import AchievementResponseMessage
from io import BytesIO
from app.scripts.scripts import wide_to_long_to_db
from sqlmodel import select
import pandas as pd

router = APIRouter(tags=["reports"], prefix="/reports", dependencies=[Depends(get_current_user)])

@router.post("/upload-result", response_model=AchievementResponseMessage)
async def upload_result(file:UploadFile=File(...), session:Session=Depends(get_session)):
    if not file.filename.endswith((".pdf")):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="only CSV, XLSX files supported")
    contents=await file.read()
    buffer=BytesIO(contents)
    
    
    try:
        data=wide_to_long_to_db(buffer=buffer)
        if not data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="1")
        for row in data:
            result=ResultInDB(**row)
            session.add(result)
            session.commit()
            session.refresh(result)
    except TypeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)+"1")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)+"2")
    return {"msg":"excel data successfuly added"}





@router.get("/custom-report/{name}", response_class=Response)
def generate_custom_report(name: str, session: Session = Depends(get_session)):
    output = BytesIO()

    if name == "grade_matrix":
        results = session.exec(select(ResultInDB)).all()
        if not results:
            raise HTTPException(status_code=404, detail="No results found")

        df = pd.DataFrame([r.model_dump() for r in results])
        pivot = pd.pivot_table(df, index="subject", columns="grade", values="usn", aggfunc="count", fill_value=0)
        pivot.reset_index(inplace=True)
        pivot.to_excel(output, index=False, sheet_name="Grade Matrix")

    elif name == "category_distribution":
        students = session.exec(select(StudentInDB)).all()
        if not students:
            raise HTTPException(status_code=404, detail="No students found")

        df = pd.DataFrame([s.model_dump() for s in students])
        category_counts = df["allotted_category"].value_counts().reset_index()
        category_counts.columns = ["allotted_category", "count"]
        category_counts.to_excel(output, index=False, sheet_name="Category Distribution")

    else:
        raise HTTPException(status_code=400, detail="Invalid report type")

    output.seek(0)
    return Response(
        content=output.read(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={name}.xlsx"}
    )

      