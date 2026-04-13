from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SubmissionCreate(BaseModel):
    assignment_id: int
    user_id: int
    submission_date: Optional[datetime] = None


class SubmissionGrade(BaseModel):
    marks: int


class SubmissionResponse(BaseModel):
    assignment_id: int
    user_id: int
    submission_date: Optional[datetime] = None
    marks: Optional[int] = None
    model_config = {"from_attributes": True}
