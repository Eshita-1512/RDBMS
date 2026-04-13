from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate, SubmissionGrade


def create_submission(db: Session, data: SubmissionCreate) -> Submission:
    existing = db.query(Submission).filter(
        Submission.assignment_id == data.assignment_id,
        Submission.user_id == data.user_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Assignment already submitted")
    submission = Submission(
        assignment_id=data.assignment_id,
        user_id=data.user_id,
        submission_date=data.submission_date,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def get_submission(db: Session, assignment_id: int, user_id: int) -> Submission:
    sub = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.user_id == user_id,
    ).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    return sub


def get_all_submissions(db: Session) -> list[Submission]:
    return db.query(Submission).all()


def get_user_submissions(db: Session, user_id: int) -> list[Submission]:
    return db.query(Submission).filter(Submission.user_id == user_id).all()


def grade_submission(db: Session, assignment_id: int, user_id: int, data: SubmissionGrade) -> Submission:
    sub = get_submission(db, assignment_id, user_id)
    sub.marks = data.marks
    db.commit()
    db.refresh(sub)
    return sub
