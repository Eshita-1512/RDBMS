from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role_id: Optional[int] = 3


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role_id: Optional[int] = None


class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str
    role_id: int
    date_joined: Optional[datetime] = None
    model_config = {"from_attributes": True}
