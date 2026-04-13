from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    assignment_id = Column(Integer, ForeignKey("assignments.assignment_id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    submission_date = Column(DateTime(timezone=True), server_default=func.now())
    marks = Column(Integer, nullable=True)  # NULL until graded
