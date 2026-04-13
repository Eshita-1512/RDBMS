from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.crud.user import create_user, get_user_by_email
from app.utils.auth import verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, data)


from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login", response_model=TokenResponse)
def login(data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.username)  # Swagger uses 'username' for the email field
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({
        "user_id": user.user_id,
        "email": user.email,
        "role_id": user.role_id,
    })
    return {"access_token": token, "token_type": "bearer"}
