from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate, AssignmentResponse
from app.crud.assignment import (
    create_assignment, get_assignment, get_all_assignments,
    update_assignment, delete_assignment,
)
from app.utils.dependencies import get_current_user, require_instructor, require_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[AssignmentResponse])
def list_assignments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                     _: User = Depends(get_current_user)):
    return get_all_assignments(db, skip=skip, limit=limit)


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_one_assignment(assignment_id: int, db: Session = Depends(get_db),
                       _: User = Depends(get_current_user)):
    return get_assignment(db, assignment_id)


@router.post("/", response_model=AssignmentResponse, status_code=201)
def create_new_assignment(data: AssignmentCreate, db: Session = Depends(get_db),
                          _: User = Depends(require_instructor)):
    return create_assignment(db, data)


@router.put("/{assignment_id}", response_model=AssignmentResponse)
def edit_assignment(assignment_id: int, data: AssignmentUpdate, db: Session = Depends(get_db),
                    _: User = Depends(require_instructor)):
    return update_assignment(db, assignment_id, data)


@router.delete("/{assignment_id}")
def remove_assignment(assignment_id: int, db: Session = Depends(get_db),
                      _: User = Depends(require_admin)):
    return delete_assignment(db, assignment_id)
