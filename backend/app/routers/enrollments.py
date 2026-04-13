from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.enrollment import EnrollmentCreate, EnrollmentUpdate, EnrollmentResponse
from app.crud.enrollment import (
    create_enrollment, get_all_enrollments,
    get_user_enrollments, update_enrollment, delete_enrollment,
)
from app.utils.dependencies import get_current_user, require_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[EnrollmentResponse])
def list_all(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return get_all_enrollments(db)


@router.get("/me", response_model=List[EnrollmentResponse])
def my_enrollments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_enrollments(db, current_user.user_id)


@router.post("/", response_model=EnrollmentResponse, status_code=201)
def enroll(data: EnrollmentCreate, db: Session = Depends(get_db),
           _: User = Depends(get_current_user)):
    return create_enrollment(db, data)


@router.put("/{user_id}/{course_id}", response_model=EnrollmentResponse)
def update_progress(user_id: int, course_id: int, data: EnrollmentUpdate,
                    db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return update_enrollment(db, user_id, course_id, data)


@router.delete("/{user_id}/{course_id}")
def unenroll(user_id: int, course_id: int, db: Session = Depends(get_db),
             _: User = Depends(get_current_user)):
    return delete_enrollment(db, user_id, course_id)
