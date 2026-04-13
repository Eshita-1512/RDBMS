from pydantic import BaseModel
from typing import Optional


class CourseCreate(BaseModel):
    course_title: str
    description: Optional[str] = None
    duration: Optional[int] = None
    category_id: Optional[int] = None
    instructor_id: Optional[int] = None


class CourseUpdate(BaseModel):
    course_title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    category_id: Optional[int] = None
    instructor_id: Optional[int] = None


class CourseResponse(CourseCreate):
    course_id: int
    model_config = {"from_attributes": True}
