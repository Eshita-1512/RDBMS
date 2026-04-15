from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse
from app.crud.course import create_course, get_course, get_all_courses, update_course, delete_course
from app.utils.dependencies import get_current_user, require_instructor, require_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[CourseResponse])
def list_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_all_courses(db, skip=skip, limit=limit)


@router.get("/{course_id}", response_model=CourseResponse)
def get_one_course(course_id: int, db: Session = Depends(get_db)):
    return get_course(db, course_id)


@router.post("/", response_model=CourseResponse, status_code=201)
def create_new_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    return create_course(db, data)


@router.put("/{course_id}", response_model=CourseResponse)
def edit_course(
    course_id: int,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    return update_course(db, course_id, data)


@router.delete("/{course_id}")
def remove_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    return delete_course(db, course_id)
