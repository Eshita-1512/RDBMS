from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Enrollment(Base):
    __tablename__ = "enrollment"

    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), primary_key=True)
    enrollment_date = Column(DateTime(timezone=True), server_default=func.now())
    progress = Column(Integer, default=0)  # 0-100 percent
