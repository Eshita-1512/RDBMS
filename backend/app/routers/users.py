from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.user import UserUpdate, UserResponse
from app.crud.user import get_user, get_all_users, update_user, delete_user
from app.utils.dependencies import require_admin, get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return get_all_users(db)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_one_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return get_user(db, user_id)


@router.put("/{user_id}", response_model=UserResponse)
def edit_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    return update_user(db, user_id, data)


@router.delete("/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return delete_user(db, user_id)
