from sqlalchemy import Column, Integer, String
from app.database import Base


class Instructor(Base):
    __tablename__ = "instructors"

    instructor_id = Column(Integer, primary_key=True, index=True)
    instructor_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    qualification = Column(String(150))
    experience = Column(Integer)  # years of experience
