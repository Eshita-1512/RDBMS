from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AssignmentCreate(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None


class AssignmentResponse(AssignmentCreate):
    assignment_id: int
    model_config = {"from_attributes": True}
