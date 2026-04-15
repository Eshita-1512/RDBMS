from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate


def create_course(db: Session, data: CourseCreate) -> Course:
    new_course = Course(
        course_title=data.course_title,
        description=data.description,
        duration=data.duration,
        level=data.level or "Beginner",
        category_id=data.category_id,
        instructor_id=data.instructor_id,
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course


def get_course(db: Session, course_id: int) -> Course:
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


def get_all_courses(db: Session, skip: int = 0, limit: int = 100) -> list[Course]:
    return db.query(Course).offset(skip).limit(limit).all()


def update_course(db: Session, course_id: int, data: CourseUpdate) -> Course:
    course = get_course(db, course_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course_id: int) -> dict:
    course = get_course(db, course_id)
    db.delete(course)
    db.commit()
    return {"detail": f"Course {course_id} deleted successfully"}
