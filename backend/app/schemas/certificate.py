from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CertificateCreate(BaseModel):
    user_id: int
    course_id: int
    issue_date: Optional[datetime] = None
    grade: Optional[str] = None


class CertificateResponse(CertificateCreate):
    model_config = {"from_attributes": True}
