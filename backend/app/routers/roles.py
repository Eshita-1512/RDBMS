from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.role import RoleCreate, RoleUpdate, RoleResponse
from app.crud.role import create_role, get_role, get_all_roles, update_role, delete_role
from app.utils.dependencies import require_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[RoleResponse])
def list_roles(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return get_all_roles(db)


@router.get("/{role_id}", response_model=RoleResponse)
def get_one_role(role_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return get_role(db, role_id)


@router.post("/", response_model=RoleResponse, status_code=201)
def create_new_role(data: RoleCreate, db: Session = Depends(get_db)):
    # Auth-free during initial setup — protect with require_admin after seeding if desired
    return create_role(db, data)


@router.put("/{role_id}", response_model=RoleResponse)
def edit_role(role_id: int, data: RoleUpdate, db: Session = Depends(get_db),
              _: User = Depends(require_admin)):
    return update_role(db, role_id, data)


@router.delete("/{role_id}")
def remove_role(role_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return delete_role(db, role_id)
