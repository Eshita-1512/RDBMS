from pydantic import BaseModel
from typing import Optional


class LessonCreate(BaseModel):
    course_id: int
    lesson_title: str
    lesson_content: Optional[str] = None
    lesson_duration: Optional[int] = None


class LessonUpdate(BaseModel):
    lesson_title: Optional[str] = None
    lesson_content: Optional[str] = None
    lesson_duration: Optional[int] = None


class LessonResponse(LessonCreate):
    lesson_id: int
    model_config = {"from_attributes": True}
