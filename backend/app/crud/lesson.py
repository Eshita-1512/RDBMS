from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.lesson import Lesson
from app.schemas.lesson import LessonCreate, LessonUpdate


def create_lesson(db: Session, data: LessonCreate) -> Lesson:
    new_lesson = Lesson(
        course_id=data.course_id,
        lesson_title=data.lesson_title,
        lesson_content=data.lesson_content,
        lesson_duration=data.lesson_duration,
    )
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson


def get_lesson(db: Session, lesson_id: int) -> Lesson:
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


def get_all_lessons(db: Session, skip: int = 0, limit: int = 100) -> list[Lesson]:
    return db.query(Lesson).offset(skip).limit(limit).all()


def update_lesson(db: Session, lesson_id: int, data: LessonUpdate) -> Lesson:
    lesson = get_lesson(db, lesson_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(lesson, field, value)
    db.commit()
    db.refresh(lesson)
    return lesson


def delete_lesson(db: Session, lesson_id: int) -> dict:
    lesson = get_lesson(db, lesson_id)
    db.delete(lesson)
    db.commit()
    return {"detail": f"Lesson {lesson_id} deleted successfully"}
