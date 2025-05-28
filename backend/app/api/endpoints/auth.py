from fastapi import APIRouter, HTTPException, status, Depends
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, JWT_SECRET_KEY
from app.schemas.user import UserCreate,UserLogin, UserRead 
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.model import UserInDB
from app.core.security import verify_password, create_access_token, get_password_hash
from app.api.dependency  import get_current_user

router = APIRouter(tags=["user"])

@router.post("/login")
async def login(data:UserLogin, session:Session=Depends(get_session)):
    user = session.exec(select(UserInDB).where(UserInDB.username == data.username)).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token=create_access_token(data={"sub":user.username})
    return{"access_token":access_token, "token_type":"bearer"}

@router.post("/register", response_model=UserRead)
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(UserInDB).where(UserInDB.username == user.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    new_user = UserInDB(
        username=user.username,
        hashed_password=get_password_hash(user.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


@router.get("/me", response_model=UserRead)
def read_users_me(current_user: UserRead = Depends(get_current_user)):
    return current_user