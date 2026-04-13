from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.assignment import Assignment
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate


def create_assignment(db: Session, data: AssignmentCreate) -> Assignment:
    new_assignment = Assignment(
        course_id=data.course_id,
        title=data.title,
        description=data.description,
        due_date=data.due_date,
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment


def get_assignment(db: Session, assignment_id: int) -> Assignment:
    assignment = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


def get_all_assignments(db: Session, skip: int = 0, limit: int = 100) -> list[Assignment]:
    return db.query(Assignment).offset(skip).limit(limit).all()


def update_assignment(db: Session, assignment_id: int, data: AssignmentUpdate) -> Assignment:
    assignment = get_assignment(db, assignment_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(assignment, field, value)
    db.commit()
    db.refresh(assignment)
    return assignment


def delete_assignment(db: Session, assignment_id: int) -> dict:
    assignment = get_assignment(db, assignment_id)
    db.delete(assignment)
    db.commit()
    return {"detail": f"Assignment {assignment_id} deleted successfully"}
