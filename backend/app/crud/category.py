from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def create_category(db: Session, data: CategoryCreate) -> Category:
    new_category = Category(
        category_name=data.category_name,
        description=data.description,
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


def get_category(db: Session, category_id: int) -> Category:
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


def get_all_categories(db: Session, skip: int = 0, limit: int = 100) -> list[Category]:
    return db.query(Category).offset(skip).limit(limit).all()


def update_category(db: Session, category_id: int, data: CategoryUpdate) -> Category:
    category = get_category(db, category_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int) -> dict:
    category = get_category(db, category_id)
    db.delete(category)
    db.commit()
    return {"detail": f"Category {category_id} deleted successfully"}
