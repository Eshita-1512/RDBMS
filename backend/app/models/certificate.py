from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), primary_key=True)
    issue_date = Column(DateTime(timezone=True), server_default=func.now())
    grade = Column(String(2))  # "A", "B", "C", "D", "F"
