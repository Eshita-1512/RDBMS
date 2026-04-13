from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.certificate import Certificate
from app.schemas.certificate import CertificateCreate


def create_certificate(db: Session, data: CertificateCreate) -> Certificate:
    existing = db.query(Certificate).filter(
        Certificate.user_id == data.user_id,
        Certificate.course_id == data.course_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Certificate already issued")
    cert = Certificate(
        user_id=data.user_id,
        course_id=data.course_id,
        issue_date=data.issue_date,
        grade=data.grade,
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


def get_user_certificates(db: Session, user_id: int) -> list[Certificate]:
    return db.query(Certificate).filter(Certificate.user_id == user_id).all()


def get_all_certificates(db: Session) -> list[Certificate]:
    return db.query(Certificate).all()


def delete_certificate(db: Session, user_id: int, course_id: int) -> dict:
    cert = db.query(Certificate).filter(
        Certificate.user_id == user_id,
        Certificate.course_id == course_id,
    ).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    db.delete(cert)
    db.commit()
    return {"detail": "Certificate revoked"}
