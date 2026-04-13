from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.crud.category import (
    create_category, get_category, get_all_categories,
    update_category, delete_category,
)
from app.utils.dependencies import require_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[CategoryResponse])
def list_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_all_categories(db, skip=skip, limit=limit)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_one_category(category_id: int, db: Session = Depends(get_db)):
    return get_category(db, category_id)


@router.post("/", response_model=CategoryResponse, status_code=201)
def create_new_category(data: CategoryCreate, db: Session = Depends(get_db),
                        _: User = Depends(require_admin)):
    return create_category(db, data)


@router.put("/{category_id}", response_model=CategoryResponse)
def edit_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db),
                  _: User = Depends(require_admin)):
    return update_category(db, category_id, data)


@router.delete("/{category_id}")
def remove_category(category_id: int, db: Session = Depends(get_db),
                    _: User = Depends(require_admin)):
    return delete_category(db, category_id)
