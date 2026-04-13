from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.instructor import Instructor
from app.schemas.instructor import InstructorCreate, InstructorUpdate


def create_instructor(db: Session, data: InstructorCreate) -> Instructor:
    new_instructor = Instructor(
        instructor_name=data.instructor_name,
        email=data.email,
        qualification=data.qualification,
        experience=data.experience,
    )
    db.add(new_instructor)
    db.commit()
    db.refresh(new_instructor)
    return new_instructor


def get_instructor(db: Session, instructor_id: int) -> Instructor:
    instructor = db.query(Instructor).filter(Instructor.instructor_id == instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")
    return instructor


def get_all_instructors(db: Session, skip: int = 0, limit: int = 100) -> list[Instructor]:
    return db.query(Instructor).offset(skip).limit(limit).all()


def update_instructor(db: Session, instructor_id: int, data: InstructorUpdate) -> Instructor:
    instructor = get_instructor(db, instructor_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(instructor, field, value)
    db.commit()
    db.refresh(instructor)
    return instructor


def delete_instructor(db: Session, instructor_id: int) -> dict:
    instructor = get_instructor(db, instructor_id)
    db.delete(instructor)
    db.commit()
    return {"detail": f"Instructor {instructor_id} deleted successfully"}
