from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.instructor import InstructorCreate, InstructorUpdate, InstructorResponse
from app.crud.instructor import (
    create_instructor, get_instructor, get_all_instructors,
    update_instructor, delete_instructor,
)
from app.utils.dependencies import require_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[InstructorResponse])
def list_instructors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_all_instructors(db, skip=skip, limit=limit)


@router.get("/{instructor_id}", response_model=InstructorResponse)
def get_one_instructor(instructor_id: int, db: Session = Depends(get_db)):
    return get_instructor(db, instructor_id)


@router.post("/", response_model=InstructorResponse, status_code=201)
def create_new_instructor(data: InstructorCreate, db: Session = Depends(get_db),
                          _: User = Depends(require_admin)):
    return create_instructor(db, data)


@router.put("/{instructor_id}", response_model=InstructorResponse)
def edit_instructor(instructor_id: int, data: InstructorUpdate, db: Session = Depends(get_db),
                    _: User = Depends(require_admin)):
    return update_instructor(db, instructor_id, data)


@router.delete("/{instructor_id}")
def remove_instructor(instructor_id: int, db: Session = Depends(get_db),
                      _: User = Depends(require_admin)):
    return delete_instructor(db, instructor_id)
