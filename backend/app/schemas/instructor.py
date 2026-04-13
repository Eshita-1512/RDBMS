from pydantic import BaseModel, EmailStr
from typing import Optional


class InstructorCreate(BaseModel):
    instructor_name: str
    email: EmailStr
    qualification: Optional[str] = None
    experience: Optional[int] = None


class InstructorUpdate(BaseModel):
    instructor_name: Optional[str] = None
    email: Optional[EmailStr] = None
    qualification: Optional[str] = None
    experience: Optional[int] = None


class InstructorResponse(InstructorCreate):
    instructor_id: int
    model_config = {"from_attributes": True}
