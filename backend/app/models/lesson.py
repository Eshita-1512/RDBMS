from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    lesson_id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), nullable=False)
    lesson_title = Column(String(200), nullable=False)
    lesson_content = Column(Text)
    lesson_duration = Column(Integer)  # minutes
