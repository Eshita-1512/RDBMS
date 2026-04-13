# SkillBridge — Backend Documentation
# (AI Code Generator Optimized — Copy each code block exactly as written)

---

## IMPORTANT INSTRUCTIONS FOR AI CODE GENERATORS

When generating files from this document:
- Use **Python 3.11+** and **FastAPI 0.110+**
- Use **SQLAlchemy 2.x** ORM syntax only (NOT SQLAlchemy 1.x)
- Use **Pydantic v2** syntax only (NOT v1)
- Every file is self-contained — do not merge files together
- Copy every import exactly — do not remove or add imports
- Never use `db.execute(raw_sql)` — always use ORM methods
- Do not use `async def` in CRUD functions — keep them synchronous
- Router functions MAY be `async def`

---

## 1. Tech Stack

| Component     | Technology                        | Version      |
|---------------|-----------------------------------|--------------|
| Framework     | FastAPI                           | 0.110+       |
| Database      | PostgreSQL                        | 15           |
| ORM           | SQLAlchemy                        | 2.x          |
| Migrations    | Alembic                           | 1.13+        |
| Validation    | Pydantic                          | v2           |
| Auth          | python-jose + passlib[bcrypt]     | latest       |
| Server        | Uvicorn                           | latest       |
| DB Driver     | psycopg2-binary                   | latest       |
| Settings      | pydantic-settings                 | latest       |

---

## 2. Requirements File

**File: `backend/requirements.txt`**
_(Create this file first before anything else)_

```
fastapi==0.110.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.29
alembic==1.13.1
psycopg2-binary==2.9.9
pydantic==2.6.4
pydantic-settings==2.2.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
```

Install with:
```bash
pip install -r requirements.txt
```

---

## 3. Environment Variables

**File: `backend/.env`**

```
DATABASE_URL=postgresql://skillbridge_user:password@localhost:5432/skillbridge_db
SECRET_KEY=supersecretkey_change_this_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 4. Database Connectivity

### How the Frontend Connects to the Database

The frontend (React) **never connects directly to PostgreSQL**. The connection chain is:

```
React (Browser)
    |
    |  HTTP REST API calls (JSON)
    |  Header: Authorization: Bearer <JWT Token>
    v
FastAPI Backend (Python)
    |
    |  SQLAlchemy ORM (Python objects -> SQL queries)
    |  Driver: psycopg2-binary
    v
PostgreSQL Database
```

Every time the frontend needs data, it calls a FastAPI endpoint via Axios (HTTP). FastAPI then uses SQLAlchemy to query PostgreSQL and returns a JSON response. The frontend never writes SQL — it only sends and receives JSON.

### Step 1 — Settings (`app/config.py`)

**File: `backend/app/config.py`**

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = {"env_file": ".env"}


settings = Settings()
```

### Step 2 — Database Engine and Session (`app/database.py`)

**File: `backend/app/database.py`**

This file creates the SQLAlchemy engine (the connection pool to PostgreSQL) and provides a `get_db` dependency that FastAPI injects into every route handler. Each HTTP request gets its own database session, which is closed after the response is sent.

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import settings


# Engine: manages the actual TCP connection pool to PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,   # checks connection health before using it
    echo=False,           # set to True during development to log all SQL
)

# SessionLocal: factory that creates individual DB sessions per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base: all ORM models inherit from this class
class Base(DeclarativeBase):
    pass


# get_db: FastAPI dependency -- yields a session and closes it after the request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Step 3 — App Entry Point (`app/main.py`)

**File: `backend/app/main.py`**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import (
    auth, users, roles, courses, instructors,
    categories, enrollments, lessons, assignments,
    submissions, certificates,
)

# Create all tables on startup (use Alembic in production instead)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkillBridge API", version="1.0.0")

# Allow React frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router,         prefix="/api/v1/auth",         tags=["Auth"])
app.include_router(users.router,        prefix="/api/v1/users",        tags=["Users"])
app.include_router(roles.router,        prefix="/api/v1/roles",        tags=["Roles"])
app.include_router(courses.router,      prefix="/api/v1/courses",      tags=["Courses"])
app.include_router(instructors.router,  prefix="/api/v1/instructors",  tags=["Instructors"])
app.include_router(categories.router,   prefix="/api/v1/categories",   tags=["Categories"])
app.include_router(enrollments.router,  prefix="/api/v1/enrollments",  tags=["Enrollments"])
app.include_router(lessons.router,      prefix="/api/v1/lessons",      tags=["Lessons"])
app.include_router(assignments.router,  prefix="/api/v1/assignments",  tags=["Assignments"])
app.include_router(submissions.router,  prefix="/api/v1/submissions",  tags=["Submissions"])
app.include_router(certificates.router, prefix="/api/v1/certificates", tags=["Certificates"])


@app.get("/")
def root():
    return {"message": "SkillBridge API is running"}
```

Run the server with:
```bash
uvicorn app.main:app --reload
```

---

## 5. SQLAlchemy ORM Models

Each model maps one-to-one to a PostgreSQL table. All model files go inside `backend/app/models/`.

### `app/models/__init__.py`
```python
# empty file -- required for Python to treat this as a package
```

### `app/models/role.py`
```python
from sqlalchemy import Column, Integer, String
from app.database import Base


class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255))
```

### `app/models/user.py`
```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.role_id"), nullable=False)
    date_joined = Column(DateTime(timezone=True), server_default=func.now())
```

### `app/models/instructor.py`
```python
from sqlalchemy import Column, Integer, String
from app.database import Base


class Instructor(Base):
    __tablename__ = "instructors"

    instructor_id = Column(Integer, primary_key=True, index=True)
    instructor_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    qualification = Column(String(150))
    experience = Column(Integer)  # years of experience
```

### `app/models/category.py`
```python
from sqlalchemy import Column, Integer, String
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), nullable=False)
    description = Column(String(255))
```

### `app/models/course.py`
```python
from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True)
    course_title = Column(String(200), nullable=False)
    description = Column(String(500))
    duration = Column(Integer)  # total hours
    category_id = Column(Integer, ForeignKey("categories.category_id"))
    instructor_id = Column(Integer, ForeignKey("instructors.instructor_id"))
```

### `app/models/enrollment.py`
```python
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Enrollment(Base):
    __tablename__ = "enrollment"

    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), primary_key=True)
    enrollment_date = Column(DateTime(timezone=True), server_default=func.now())
    progress = Column(Integer, default=0)  # 0-100 percent
```

### `app/models/lesson.py`
```python
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    lesson_id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), nullable=False)
    lesson_title = Column(String(200), nullable=False)
    lesson_content = Column(Text)
    lesson_duration = Column(Integer)  # minutes
```

### `app/models/assignment.py`
```python
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    assignment_id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    due_date = Column(DateTime(timezone=True))
```

### `app/models/submission.py`
```python
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    assignment_id = Column(Integer, ForeignKey("assignments.assignment_id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    submission_date = Column(DateTime(timezone=True), server_default=func.now())
    marks = Column(Integer, nullable=True)  # NULL until graded
```

### `app/models/certificate.py`
```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), primary_key=True)
    issue_date = Column(DateTime(timezone=True), server_default=func.now())
    grade = Column(String(2))  # "A", "B", "C", "D", "F"
```

---

## 6. Pydantic Schemas

Schemas validate incoming request data and shape outgoing response data. All schema files go inside `backend/app/schemas/`.

### `app/schemas/__init__.py`
```python
# empty file
```

### `app/schemas/auth.py`
```python
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
```

### `app/schemas/role.py`
```python
from pydantic import BaseModel
from typing import Optional


class RoleCreate(BaseModel):
    role_name: str
    description: Optional[str] = None


class RoleUpdate(BaseModel):
    role_name: Optional[str] = None
    description: Optional[str] = None


class RoleResponse(RoleCreate):
    role_id: int
    model_config = {"from_attributes": True}
```

### `app/schemas/user.py`
```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role_id: int


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role_id: Optional[int] = None


class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str
    role_id: int
    date_joined: Optional[datetime] = None
    model_config = {"from_attributes": True}
```

### `app/schemas/instructor.py`
```python
from pydantic import BaseModel, EmailStr
from typing import Optional


class InstructorCreate(BaseModel):
    instructor_name: str
    email: EmailStr
    qualification: Optional[str] = None
    experience: Optional[int] = None


class InstructorUpdate(BaseModel):
    instructor_name: Optional[str] = None
    email: Optional[EmailStr] = None
    qualification: Optional[str] = None
    experience: Optional[int] = None


class InstructorResponse(InstructorCreate):
    instructor_id: int
    model_config = {"from_attributes": True}
```

### `app/schemas/category.py`
```python
from pydantic import BaseModel
from typing import Optional


class CategoryCreate(BaseModel):
    category_name: str
    description: Optional[str] = None


class CategoryUpdate(BaseModel):
    category_name: Optional[str] = None
    description: Optional[str] = None


class CategoryResponse(CategoryCreate):
    category_id: int
    model_config = {"from_attributes": True}
```

### `app/schemas/course.py`
```python
from pydantic import BaseModel
from typing import Optional


class CourseCreate(BaseModel):
    course_title: str
    description: Optional[str] = None
    duration: Optional[int] = None
    category_id: Optional[int] = None
    instructor_id: Optional[int] = None


class CourseUpdate(BaseModel):
    course_title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    category_id: Optional[int] = None
    instructor_id: Optional[int] = None


class CourseResponse(CourseCreate):
    course_id: int
    model_config = {"from_attributes": True}
```

### `app/schemas/enrollment.py`
```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EnrollmentCreate(BaseModel):
    user_id: int
    course_id: int


class EnrollmentUpdate(BaseModel):
    progress: Optional[int] = None  # 0-100


class EnrollmentResponse(BaseModel):
    user_id: int
    course_id: int
    enrollment_date: Optional[datetime] = None
    progress: int
    model_config = {"from_attributes": True}
```

### `app/schemas/lesson.py`
```python
from pydantic import BaseModel
from typing import Optional


class LessonCreate(BaseModel):
    course_id: int
    lesson_title: str
    lesson_content: Optional[str] = None
    lesson_duration: Optional[int] = None


class LessonUpdate(BaseModel):
    lesson_title: Optional[str] = None
    lesson_content: Optional[str] = None
    lesson_duration: Optional[int] = None


class LessonResponse(LessonCreate):
    lesson_id: int
    model_config = {"from_attributes": True}
```

### `app/schemas/assignment.py`
```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AssignmentCreate(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None


class AssignmentResponse(AssignmentCreate):
    assignment_id: int
    model_config = {"from_attributes": True}
```

### `app/schemas/submission.py`
```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SubmissionCreate(BaseModel):
    assignment_id: int
    user_id: int
    submission_date: Optional[datetime] = None


class SubmissionGrade(BaseModel):
    marks: int


class SubmissionResponse(BaseModel):
    assignment_id: int
    user_id: int
    submission_date: Optional[datetime] = None
    marks: Optional[int] = None
    model_config = {"from_attributes": True}
```

### `app/schemas/certificate.py`
```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CertificateCreate(BaseModel):
    user_id: int
    course_id: int
    issue_date: Optional[datetime] = None
    grade: Optional[str] = None


class CertificateResponse(CertificateCreate):
    model_config = {"from_attributes": True}
```

---

## 7. Auth Utilities

### `app/utils/__init__.py`
```python
# empty file
```

### `app/utils/auth.py`
```python
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
```

### `app/utils/dependencies.py`
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.auth import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def require_instructor(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role_id not in (1, 2):
        raise HTTPException(status_code=403, detail="Instructor access required")
    return current_user
```

---

## 8. CRUD Operations Implementation

All CRUD files go inside `backend/app/crud/`. Each file handles exactly one entity.

### How Each CRUD Operation Works

The frontend sends an HTTP request to a FastAPI router. The router calls a CRUD function, passing the SQLAlchemy session (`db`) and validated Pydantic data. The CRUD function runs an ORM query and returns the result. FastAPI serializes it to JSON using the response schema.

```
Frontend Axios call
       |
       v
FastAPI Router  -->  CRUD Function  -->  SQLAlchemy ORM  -->  PostgreSQL
                          |
                   db.add / db.query / db.delete
                   db.commit / db.refresh
                          |
                          v
                   ORM Object returned
                          |
                          v
                   Pydantic Response Schema
                          |
                          v
                   JSON sent to browser
```

### `app/crud/__init__.py`
```python
# empty file
```

### CREATE Operation — Inserting a New Record

**How it works:**
1. Pydantic validates the incoming JSON body into a schema object.
2. The CRUD function creates a new SQLAlchemy ORM model instance from the schema fields.
3. `db.add(obj)` stages the object for INSERT.
4. `db.commit()` sends the INSERT statement to PostgreSQL and confirms the transaction.
5. `db.refresh(obj)` reloads the object from the DB to pick up auto-generated values like `id` or `date_joined`.

### READ Operation — Retrieving Records

**How it works:**
1. `db.query(Model)` starts a SELECT query on that table.
2. `.filter(Model.column == value)` adds a WHERE clause.
3. `.first()` returns one row or `None`; `.all()` returns a list of rows.
4. If nothing is found, an `HTTPException(404)` is raised.
5. The ORM object(s) are returned and serialized to JSON by Pydantic.

### UPDATE Operation — Modifying Existing Records

**How it works:**
1. The existing record is first fetched using the READ logic (raises 404 if not found).
2. `data.model_dump(exclude_unset=True)` extracts only the fields the client actually sent (partial update).
3. `setattr(obj, field, value)` updates each field on the ORM object in memory.
4. `db.commit()` writes the UPDATE statement to PostgreSQL.
5. `db.refresh(obj)` reloads the updated object from the DB.

### DELETE Operation — Removing Records

**How it works:**
1. The existing record is first fetched (raises 404 if not found).
2. `db.delete(obj)` marks the object for deletion.
3. `db.commit()` executes the DELETE statement in PostgreSQL.
4. A confirmation message is returned.

---

### `app/crud/course.py` — Full Reference CRUD Example

```python
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate


def create_course(db: Session, data: CourseCreate) -> Course:
    new_course = Course(
        course_title=data.course_title,
        description=data.description,
        duration=data.duration,
        category_id=data.category_id,
        instructor_id=data.instructor_id,
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course


def get_course(db: Session, course_id: int) -> Course:
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


def get_all_courses(db: Session, skip: int = 0, limit: int = 100) -> list[Course]:
    return db.query(Course).offset(skip).limit(limit).all()


def update_course(db: Session, course_id: int, data: CourseUpdate) -> Course:
    course = get_course(db, course_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course_id: int) -> dict:
    course = get_course(db, course_id)
    db.delete(course)
    db.commit()
    return {"detail": f"Course {course_id} deleted successfully"}
```

---

### `app/crud/user.py`

```python
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.utils.auth import hash_password


def create_user(db: Session, data: UserCreate) -> User:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role_id=data.role_id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    return db.query(User).offset(skip).limit(limit).all()


def update_user(db: Session, user_id: int, data: UserUpdate) -> User:
    user = get_user(db, user_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> dict:
    user = get_user(db, user_id)
    db.delete(user)
    db.commit()
    return {"detail": f"User {user_id} deleted successfully"}
```

---

### `app/crud/enrollment.py`

Enrollment uses a composite primary key — both `user_id` AND `course_id` together identify one row.

```python
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate, EnrollmentUpdate


def create_enrollment(db: Session, data: EnrollmentCreate) -> Enrollment:
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == data.user_id,
        Enrollment.course_id == data.course_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    enrollment = Enrollment(user_id=data.user_id, course_id=data.course_id, progress=0)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


def get_enrollment(db: Session, user_id: int, course_id: int) -> Enrollment:
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == course_id,
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment


def get_user_enrollments(db: Session, user_id: int) -> list[Enrollment]:
    return db.query(Enrollment).filter(Enrollment.user_id == user_id).all()


def get_all_enrollments(db: Session) -> list[Enrollment]:
    return db.query(Enrollment).all()


def update_enrollment(db: Session, user_id: int, course_id: int, data: EnrollmentUpdate) -> Enrollment:
    enrollment = get_enrollment(db, user_id, course_id)
    if data.progress is not None:
        enrollment.progress = data.progress
    db.commit()
    db.refresh(enrollment)
    return enrollment


def delete_enrollment(db: Session, user_id: int, course_id: int) -> dict:
    enrollment = get_enrollment(db, user_id, course_id)
    db.delete(enrollment)
    db.commit()
    return {"detail": "Unenrolled successfully"}
```

---

### `app/crud/submission.py`

```python
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
```

---

### `app/crud/certificate.py`

```python
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
```

---

## 9. Routers

All router files go inside `backend/app/routers/`.

### `app/routers/__init__.py`
```python
# empty file
```

### `app/routers/auth.py`
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.crud.user import create_user, get_user_by_email
from app.utils.auth import verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({
        "user_id": user.user_id,
        "email": user.email,
        "role_id": user.role_id,
    })
    return {"access_token": token, "token_type": "bearer"}
```

### `app/routers/courses.py`
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse
from app.crud.course import create_course, get_course, get_all_courses, update_course, delete_course
from app.utils.dependencies import get_current_user, require_instructor, require_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[CourseResponse])
def list_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_all_courses(db, skip=skip, limit=limit)


@router.get("/{course_id}", response_model=CourseResponse)
def get_one_course(course_id: int, db: Session = Depends(get_db)):
    return get_course(db, course_id)


@router.post("/", response_model=CourseResponse, status_code=201)
def create_new_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    return create_course(db, data)


@router.put("/{course_id}", response_model=CourseResponse)
def edit_course(
    course_id: int,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    return update_course(db, course_id, data)


@router.delete("/{course_id}")
def remove_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return delete_course(db, course_id)
```

### `app/routers/users.py`
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.user import UserUpdate, UserResponse
from app.crud.user import get_user, get_all_users, update_user, delete_user
from app.utils.dependencies import require_admin, get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return get_all_users(db)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_one_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return get_user(db, user_id)


@router.put("/{user_id}", response_model=UserResponse)
def edit_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    return update_user(db, user_id, data)


@router.delete("/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return delete_user(db, user_id)
```

### `app/routers/enrollments.py`
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.enrollment import EnrollmentCreate, EnrollmentUpdate, EnrollmentResponse
from app.crud.enrollment import (
    create_enrollment, get_all_enrollments,
    get_user_enrollments, update_enrollment, delete_enrollment,
)
from app.utils.dependencies import get_current_user, require_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[EnrollmentResponse])
def list_all(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return get_all_enrollments(db)


@router.get("/me", response_model=List[EnrollmentResponse])
def my_enrollments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_enrollments(db, current_user.user_id)


@router.post("/", response_model=EnrollmentResponse, status_code=201)
def enroll(data: EnrollmentCreate, db: Session = Depends(get_db),
           _: User = Depends(get_current_user)):
    return create_enrollment(db, data)


@router.put("/{user_id}/{course_id}", response_model=EnrollmentResponse)
def update_progress(user_id: int, course_id: int, data: EnrollmentUpdate,
                    db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return update_enrollment(db, user_id, course_id, data)


@router.delete("/{user_id}/{course_id}")
def unenroll(user_id: int, course_id: int, db: Session = Depends(get_db),
             _: User = Depends(get_current_user)):
    return delete_enrollment(db, user_id, course_id)
```

### `app/routers/submissions.py`
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.submission import SubmissionCreate, SubmissionGrade, SubmissionResponse
from app.crud.submission import (
    create_submission, get_all_submissions,
    get_user_submissions, grade_submission,
)
from app.utils.dependencies import get_current_user, require_instructor
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[SubmissionResponse])
def list_all(db: Session = Depends(get_db), _: User = Depends(require_instructor)):
    return get_all_submissions(db)


@router.get("/me", response_model=List[SubmissionResponse])
def my_submissions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_submissions(db, current_user.user_id)


@router.post("/", response_model=SubmissionResponse, status_code=201)
def submit(data: SubmissionCreate, db: Session = Depends(get_db),
           _: User = Depends(get_current_user)):
    return create_submission(db, data)


@router.put("/{assignment_id}/{user_id}", response_model=SubmissionResponse)
def grade(assignment_id: int, user_id: int, data: SubmissionGrade,
          db: Session = Depends(get_db), _: User = Depends(require_instructor)):
    return grade_submission(db, assignment_id, user_id, data)
```

### `app/routers/certificates.py`
```python
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
```

---

## 10. Remaining Routers and CRUD — Pattern Reference

For roles, instructors, categories, lessons, and assignments — follow this exact same pattern used in courses.py and course.py. The only things that change are: the model import, the schema imports, the field names inside the create function, and the primary key name. Everything else (db.add, db.commit, db.refresh, setattr loop, db.delete) is identical.

---

## 11. API Endpoint Summary

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /auth/register | Public |
| POST | /auth/login | Public |
| GET | /users/ | Admin |
| GET | /users/me | Any |
| PUT | /users/{id} | Any |
| DELETE | /users/{id} | Admin |
| GET | /roles/ | Admin |
| POST | /roles/ | Admin |
| PUT | /roles/{id} | Admin |
| DELETE | /roles/{id} | Admin |
| GET | /instructors/ | Public |
| POST | /instructors/ | Admin |
| PUT | /instructors/{id} | Admin |
| DELETE | /instructors/{id} | Admin |
| GET | /categories/ | Public |
| POST | /categories/ | Admin |
| PUT | /categories/{id} | Admin |
| DELETE | /categories/{id} | Admin |
| GET | /courses/ | Public |
| GET | /courses/{id} | Public |
| POST | /courses/ | Instructor |
| PUT | /courses/{id} | Instructor |
| DELETE | /courses/{id} | Admin |
| GET | /enrollments/ | Admin |
| GET | /enrollments/me | Any |
| POST | /enrollments/ | Any |
| PUT | /enrollments/{uid}/{cid} | Any |
| DELETE | /enrollments/{uid}/{cid} | Any |
| GET | /lessons/{id} | Any |
| POST | /lessons/ | Instructor |
| PUT | /lessons/{id} | Instructor |
| DELETE | /lessons/{id} | Admin |
| GET | /assignments/{id} | Any |
| POST | /assignments/ | Instructor |
| PUT | /assignments/{id} | Instructor |
| DELETE | /assignments/{id} | Admin |
| GET | /submissions/ | Instructor |
| GET | /submissions/me | Any |
| POST | /submissions/ | Any |
| PUT | /submissions/{aid}/{uid} | Instructor |
| GET | /certificates/ | Admin |
| GET | /certificates/me | Any |
| POST | /certificates/ | Instructor |
| DELETE | /certificates/{uid}/{cid} | Admin |

---

## 12. File Generation Order for AI Tools

Generate files in this exact order to avoid import errors:

```
1.  backend/requirements.txt
2.  backend/.env
3.  backend/app/__init__.py                (empty)
4.  backend/app/config.py
5.  backend/app/database.py
6.  backend/app/models/__init__.py         (empty)
7.  backend/app/models/role.py
8.  backend/app/models/user.py
9.  backend/app/models/instructor.py
10. backend/app/models/category.py
11. backend/app/models/course.py
12. backend/app/models/enrollment.py
13. backend/app/models/lesson.py
14. backend/app/models/assignment.py
15. backend/app/models/submission.py
16. backend/app/models/certificate.py
17. backend/app/schemas/__init__.py        (empty)
18. backend/app/schemas/auth.py
19. backend/app/schemas/role.py
20. backend/app/schemas/user.py
21. backend/app/schemas/instructor.py
22. backend/app/schemas/category.py
23. backend/app/schemas/course.py
24. backend/app/schemas/enrollment.py
25. backend/app/schemas/lesson.py
26. backend/app/schemas/assignment.py
27. backend/app/schemas/submission.py
28. backend/app/schemas/certificate.py
29. backend/app/utils/__init__.py          (empty)
30. backend/app/utils/auth.py
31. backend/app/utils/dependencies.py
32. backend/app/crud/__init__.py           (empty)
33. backend/app/crud/user.py
34. backend/app/crud/role.py               (follow course.py pattern)
35. backend/app/crud/instructor.py         (follow course.py pattern)
36. backend/app/crud/category.py           (follow course.py pattern)
37. backend/app/crud/course.py
38. backend/app/crud/enrollment.py
39. backend/app/crud/lesson.py             (follow course.py pattern)
40. backend/app/crud/assignment.py         (follow course.py pattern)
41. backend/app/crud/submission.py
42. backend/app/crud/certificate.py
43. backend/app/routers/__init__.py        (empty)
44. backend/app/routers/auth.py
45. backend/app/routers/users.py
46. backend/app/routers/roles.py           (follow courses.py pattern)
47. backend/app/routers/instructors.py     (follow courses.py pattern)
48. backend/app/routers/categories.py      (follow courses.py pattern)
49. backend/app/routers/courses.py
50. backend/app/routers/enrollments.py
51. backend/app/routers/lessons.py         (follow courses.py pattern)
52. backend/app/routers/assignments.py     (follow courses.py pattern)
53. backend/app/routers/submissions.py
54. backend/app/routers/certificates.py
55. backend/app/main.py
```

---

## 13. Error Responses

```json
{ "detail": "Course not found" }
```

| Code | Meaning |
|------|---------|
| 400 | Duplicate record or bad input |
| 401 | Missing or invalid JWT |
| 403 | Role does not have permission |
| 404 | Record not found |
| 422 | Pydantic validation failed |
| 500 | Internal Server Error |

---

## 14. Assumptions

1. role_id 1 = Admin, 2 = Instructor, 3 = Student
2. Passwords are hashed with bcrypt and never returned in any response
3. Enrollment progress is an integer 0 to 100
4. Certificate grade is a 1 to 2 character string: A, B, C, D, or F
5. ENROLLMENT, CERTIFICATES, and SUBMISSIONS use composite primary keys
6. date_joined and enrollment_date are auto-set by PostgreSQL server_default
7. Instructors are a separate entity from Users
8. Base.metadata.create_all() is used for development; use Alembic for production
