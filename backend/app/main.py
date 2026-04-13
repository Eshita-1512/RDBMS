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
