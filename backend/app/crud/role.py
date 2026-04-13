from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.role import Role
from app.schemas.role import RoleCreate, RoleUpdate


def create_role(db: Session, data: RoleCreate) -> Role:
    new_role = Role(
        role_name=data.role_name,
        description=data.description,
    )
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role


def get_role(db: Session, role_id: int) -> Role:
    role = db.query(Role).filter(Role.role_id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role


def get_all_roles(db: Session, skip: int = 0, limit: int = 100) -> list[Role]:
    return db.query(Role).offset(skip).limit(limit).all()


def update_role(db: Session, role_id: int, data: RoleUpdate) -> Role:
    role = get_role(db, role_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(role, field, value)
    db.commit()
    db.refresh(role)
    return role


def delete_role(db: Session, role_id: int) -> dict:
    role = get_role(db, role_id)
    db.delete(role)
    db.commit()
    return {"detail": f"Role {role_id} deleted successfully"}
