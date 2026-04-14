from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True)
    course_title = Column(String(200), nullable=False)
    description = Column(String(500))
    duration = Column(Integer)  # total hours
    level = Column(String(50), default="Beginner")  # Beginner / Intermediate / Advanced
    category_id = Column(Integer, ForeignKey("categories.category_id"))
    instructor_id = Column(Integer, ForeignKey("instructors.instructor_id"))
