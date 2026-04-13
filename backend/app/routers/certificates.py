from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.certificate import CertificateCreate, CertificateResponse
from app.crud.certificate import (
    create_certificate, get_all_certificates,
    get_user_certificates, delete_certificate,
)
from app.utils.dependencies import get_current_user, require_admin, require_instructor
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[CertificateResponse])
def list_all(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return get_all_certificates(db)


@router.get("/me", response_model=List[CertificateResponse])
def my_certificates(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_certificates(db, current_user.user_id)


@router.post("/", response_model=CertificateResponse, status_code=201)
def issue(data: CertificateCreate, db: Session = Depends(get_db),
          _: User = Depends(require_instructor)):
    return create_certificate(db, data)


@router.delete("/{user_id}/{course_id}")
def revoke(user_id: int, course_id: int, db: Session = Depends(get_db),
           _: User = Depends(require_admin)):
    return delete_certificate(db, user_id, course_id)
