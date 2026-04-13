from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.utils.auth import hash_password


def create_user(db: Session, data: UserCreate) -> User:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role_id=data.role_id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    return db.query(User).offset(skip).limit(limit).all()


def update_user(db: Session, user_id: int, data: UserUpdate) -> User:
    user = get_user(db, user_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> dict:
    user = get_user(db, user_id)
    db.delete(user)
    db.commit()
    return {"detail": f"User {user_id} deleted successfully"}
