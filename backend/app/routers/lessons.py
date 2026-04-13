from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.lesson import LessonCreate, LessonUpdate, LessonResponse
from app.crud.lesson import create_lesson, get_lesson, get_all_lessons, update_lesson, delete_lesson
from app.utils.dependencies import get_current_user, require_instructor, require_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[LessonResponse])
def list_lessons(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                 _: User = Depends(get_current_user)):
    return get_all_lessons(db, skip=skip, limit=limit)


@router.get("/{lesson_id}", response_model=LessonResponse)
def get_one_lesson(lesson_id: int, db: Session = Depends(get_db),
                   _: User = Depends(get_current_user)):
    return get_lesson(db, lesson_id)


@router.post("/", response_model=LessonResponse, status_code=201)
def create_new_lesson(data: LessonCreate, db: Session = Depends(get_db),
                      _: User = Depends(require_instructor)):
    return create_lesson(db, data)


@router.put("/{lesson_id}", response_model=LessonResponse)
def edit_lesson(lesson_id: int, data: LessonUpdate, db: Session = Depends(get_db),
                _: User = Depends(require_instructor)):
    return update_lesson(db, lesson_id, data)


@router.delete("/{lesson_id}")
def remove_lesson(lesson_id: int, db: Session = Depends(get_db),
                  _: User = Depends(require_admin)):
    return delete_lesson(db, lesson_id)
