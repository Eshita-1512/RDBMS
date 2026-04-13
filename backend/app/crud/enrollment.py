from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate, EnrollmentUpdate


def create_enrollment(db: Session, data: EnrollmentCreate) -> Enrollment:
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == data.user_id,
        Enrollment.course_id == data.course_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    enrollment = Enrollment(user_id=data.user_id, course_id=data.course_id, progress=0)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


def get_enrollment(db: Session, user_id: int, course_id: int) -> Enrollment:
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == course_id,
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment


def get_user_enrollments(db: Session, user_id: int) -> list[Enrollment]:
    return db.query(Enrollment).filter(Enrollment.user_id == user_id).all()


def get_all_enrollments(db: Session) -> list[Enrollment]:
    return db.query(Enrollment).all()


def update_enrollment(db: Session, user_id: int, course_id: int, data: EnrollmentUpdate) -> Enrollment:
    enrollment = get_enrollment(db, user_id, course_id)
    if data.progress is not None:
        enrollment.progress = data.progress
    db.commit()
    db.refresh(enrollment)
    return enrollment


def delete_enrollment(db: Session, user_id: int, course_id: int) -> dict:
    enrollment = get_enrollment(db, user_id, course_id)
    db.delete(enrollment)
    db.commit()
    return {"detail": "Unenrolled successfully"}
