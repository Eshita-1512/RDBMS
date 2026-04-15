"""
SkillBridge Database Seeder
Run this ONCE after the backend is confirmed working:
    cd backend
    py seed.py

This bypasses the auth chicken-and-egg problem by inserting directly into the DB.
Safe to re-run — it skips rows that already exist.
"""

import sys
import os

# Make sure Python can find the app package
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import user, role, category, course, instructor, lesson, assignment, enrollment, submission, certificate
from app.database import Base
from app.utils.auth import hash_password
from datetime import datetime, timezone, timedelta

# ── Create tables if not yet created ──────────────────────────────────────────
Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()


def seed_roles():
    from app.models.role import Role
    existing = db.query(Role).count()
    if existing >= 3:
        print("  [SKIP] Roles already seeded")
        return

    roles_data = [
        {"role_id": 1, "role_name": "Admin",      "description": "Platform administrator with full access"},
        {"role_id": 2, "role_name": "Instructor",  "description": "Course creator and teacher"},
        {"role_id": 3, "role_name": "Student",     "description": "Learner enrolled in courses"},
    ]
    for r in roles_data:
        if not db.query(Role).filter(Role.role_id == r["role_id"]).first():
            db.add(Role(**r))
    db.commit()
    print("  [OK] Roles seeded: Admin, Instructor, Student")


def seed_instructors():
    from app.models.instructor import Instructor
    existing = db.query(Instructor).count()
    if existing >= 3:
        print("  [SKIP] Instructors already seeded")
        return

    instructors_data = [
        {"instructor_id": 1, "instructor_name": "Prof. Ananya Sharma",    "email": "ananya@skillbridge.com",  "qualification": "PhD Computer Science", "experience": 12},
        {"instructor_id": 2, "instructor_name": "Dr. Vikram Mehta",       "email": "vikram@skillbridge.com",  "qualification": "MTech Software Eng",   "experience": 8},
        {"instructor_id": 3, "instructor_name": "Ms. Priya Nair",         "email": "priya@skillbridge.com",   "qualification": "MBA Data Analytics",   "experience": 5},
    ]
    for i in instructors_data:
        if not db.query(Instructor).filter(Instructor.instructor_id == i["instructor_id"]).first():
            db.add(Instructor(**i))
    db.commit()
    print("  [OK] Instructors seeded: 3 instructors")


def seed_categories():
    from app.models.category import Category
    existing = db.query(Category).count()
    if existing >= 5:
        print("  [SKIP] Categories already seeded")
        return

    categories_data = [
        {"category_id": 1, "category_name": "Programming",       "description": "Software development and coding"},
        {"category_id": 2, "category_name": "Data Science",      "description": "Data analysis, ML, and AI"},
        {"category_id": 3, "category_name": "Web Development",   "description": "Frontend and backend web tech"},
        {"category_id": 4, "category_name": "Database",          "description": "SQL, NoSQL and database design"},
        {"category_id": 5, "category_name": "Cloud Computing",   "description": "AWS, Azure, GCP and DevOps"},
    ]
    for c in categories_data:
        if not db.query(Category).filter(Category.category_id == c["category_id"]).first():
            db.add(Category(**c))
    db.commit()
    print("  [OK] Categories seeded: 5 categories")


def seed_users():
    from app.models.user import User
    existing = db.query(User).count()
    if existing >= 5:
        print("  [SKIP] Users already seeded")
        return

    users_data = [
        {"user_id": 1, "name": "Admin User",         "email": "admin@skillbridge.com",    "password": hash_password("admin123"),   "role_id": 1},
        {"user_id": 2, "name": "Prof. Ananya Sharma", "email": "prof@test.com",           "password": hash_password("test123"),    "role_id": 2},
        {"user_id": 3, "name": "Dr. Vikram Mehta",   "email": "vikram@test.com",          "password": hash_password("test123"),    "role_id": 2},
        {"user_id": 4, "name": "Rahul Student",      "email": "student@test.com",         "password": hash_password("test123"),    "role_id": 3},
        {"user_id": 5, "name": "Priya Learner",      "email": "priya@test.com",           "password": hash_password("test123"),    "role_id": 3},
    ]
    for u in users_data:
        if not db.query(User).filter(User.email == u["email"]).first():
            db.add(User(**u))
    db.commit()
    print("  [OK] Users seeded: 1 Admin, 2 Instructors, 2 Students")


def seed_courses():
    from app.models.course import Course
    existing = db.query(Course).count()
    if existing >= 8:
        print("  [SKIP] Courses already seeded")
        return

    courses_data = [
        {"course_id": 1, "course_title": "Python for Beginners",         "description": "Learn Python from scratch. Covers data types, loops, functions, OOP and file handling.",           "duration": 30, "level": "Beginner",     "category_id": 1, "instructor_id": 1},
        {"course_id": 2, "course_title": "Data Science with Pandas",     "description": "Master data analysis using Pandas, NumPy and Matplotlib with real-world datasets.",               "duration": 40, "level": "Intermediate", "category_id": 2, "instructor_id": 1},
        {"course_id": 3, "course_title": "Full Stack Web Development",   "description": "Build complete web apps with React frontend and FastAPI backend. Deploy to cloud.",               "duration": 60, "level": "Advanced",     "category_id": 3, "instructor_id": 2},
        {"course_id": 4, "course_title": "PostgreSQL Mastery",           "description": "Deep dive into relational databases — queries, indexes, transactions, stored procedures.",       "duration": 25, "level": "Intermediate", "category_id": 4, "instructor_id": 2},
        {"course_id": 5, "course_title": "Cloud & DevOps Fundamentals", "description": "AWS core services, Docker, CI/CD pipelines and Infrastructure as Code with Terraform.",         "duration": 45, "level": "Intermediate", "category_id": 5, "instructor_id": 3},
        {"course_id": 6, "course_title": "Machine Learning A-Z",        "description": "End-to-end ML: regression, classification, clustering, neural nets and model deployment.",       "duration": 55, "level": "Advanced",     "category_id": 2, "instructor_id": 1},
        {"course_id": 7, "course_title": "React.js Zero to Hero",       "description": "Learn React from components to advanced state management with Redux and React Query.",           "duration": 35, "level": "Beginner",     "category_id": 3, "instructor_id": 2},
        {"course_id": 8, "course_title": "SQL for Data Analysts",       "description": "Write complex SQL queries, CTEs, window functions and build BI dashboards in PostgreSQL.",      "duration": 20, "level": "Beginner",     "category_id": 4, "instructor_id": 3},
        {"course_id": 9, "course_title": "System Design Interviews",    "description": "Design scalable distributed systems: load balancing, caching, databases, microservices.",       "duration": 50, "level": "Advanced",     "category_id": 1, "instructor_id": 1},
        {"course_id": 10,"course_title": "Docker & Kubernetes",         "description": "Containerize apps, orchestrate with Kubernetes, manage clusters and deploy to production.",     "duration": 38, "level": "Intermediate", "category_id": 5, "instructor_id": 3},
    ]
    for c in courses_data:
        if not db.query(Course).filter(Course.course_id == c["course_id"]).first():
            db.add(Course(**c))
    db.commit()
    print(f"  [OK] Courses seeded: {len(courses_data)} courses with levels")


def seed_lessons():
    from app.models.lesson import Lesson
    existing = db.query(Lesson).count()
    if existing >= 10:
        print("  [SKIP] Lessons already seeded")
        return

    lessons_data = [
        # Course 1 — Python for Beginners
        {"lesson_id": 1,  "course_id": 1, "lesson_title": "Introduction to Python",          "lesson_content": "History, installation, first program, REPL.",                   "lesson_duration": 20},
        {"lesson_id": 2,  "course_id": 1, "lesson_title": "Variables and Data Types",        "lesson_content": "int, float, str, list, tuple, dict, set.",                      "lesson_duration": 25},
        {"lesson_id": 3,  "course_id": 1, "lesson_title": "Control Flow and Loops",          "lesson_content": "if-else, for, while, break, continue, range.",                  "lesson_duration": 30},
        # Course 2 — Data Science
        {"lesson_id": 4,  "course_id": 2, "lesson_title": "Pandas DataFrames",               "lesson_content": "Creating, indexing, filtering and aggregating DataFrames.",      "lesson_duration": 40},
        {"lesson_id": 5,  "course_id": 2, "lesson_title": "Data Visualization",              "lesson_content": "Matplotlib and Seaborn charts for EDA.",                         "lesson_duration": 35},
        # Course 3 — Full Stack
        {"lesson_id": 6,  "course_id": 3, "lesson_title": "React Components & Props",        "lesson_content": "Functional components, JSX, props, state with useState.",       "lesson_duration": 45},
        {"lesson_id": 7,  "course_id": 3, "lesson_title": "FastAPI Backend Basics",          "lesson_content": "Routes, request models, responses, dependency injection.",       "lesson_duration": 50},
        # Course 4 — PostgreSQL
        {"lesson_id": 8,  "course_id": 4, "lesson_title": "Advanced SQL Queries",            "lesson_content": "JOINs, subqueries, CTEs, window functions.",                     "lesson_duration": 35},
        # Course 5 — Cloud
        {"lesson_id": 9,  "course_id": 5, "lesson_title": "AWS Core Services",               "lesson_content": "EC2, S3, RDS, Lambda and IAM basics.",                           "lesson_duration": 55},
        {"lesson_id": 10, "course_id": 5, "lesson_title": "Docker Fundamentals",             "lesson_content": "Images, containers, Dockerfile, docker-compose.",                "lesson_duration": 40},
    ]
    from app.models.lesson import Lesson
    for l in lessons_data:
        if not db.query(Lesson).filter(Lesson.lesson_id == l["lesson_id"]).first():
            db.add(Lesson(**l))
    db.commit()
    print("  [OK] Lessons seeded: 10 lessons across 5 courses")


def seed_assignments():
    from app.models.assignment import Assignment
    existing = db.query(Assignment).count()
    if existing >= 5:
        print("  [SKIP] Assignments already seeded")
        return

    now = datetime.now(timezone.utc)
    assignments_data = [
        {"assignment_id": 1, "course_id": 1, "title": "Python Calculator",         "description": "Build a command-line calculator that handles +, -, *, / and error handling.", "due_date": now + timedelta(days=7)},
        {"assignment_id": 2, "course_id": 1, "title": "File I/O Program",          "description": "Read a CSV file, process the data and output a summary report.",               "due_date": now + timedelta(days=14)},
        {"assignment_id": 3, "course_id": 2, "title": "EDA on Real Dataset",       "description": "Perform exploratory data analysis on the Titanic dataset using Pandas.",         "due_date": now + timedelta(days=10)},
        {"assignment_id": 4, "course_id": 3, "title": "React Todo App",            "description": "Build a full CRUD todo app with React, localStorage and Tailwind CSS.",         "due_date": now + timedelta(days=12)},
        {"assignment_id": 5, "course_id": 4, "title": "Database Design Project",   "description": "Design an ER diagram and implement a normalized schema for an e-commerce app.", "due_date": now + timedelta(days=21)},
    ]
    for a in assignments_data:
        if not db.query(Assignment).filter(Assignment.assignment_id == a["assignment_id"]).first():
            db.add(Assignment(**a))
    db.commit()
    print("  [OK] Assignments seeded: 5 assignments")


def seed_enrollments():
    from app.models.enrollment import Enrollment
    existing = db.query(Enrollment).count()
    if existing >= 4:
        print("  [SKIP] Enrollments already seeded")
        return

    enrollments_data = [
        {"user_id": 4, "course_id": 1, "progress": 65},
        {"user_id": 4, "course_id": 2, "progress": 30},
        {"user_id": 5, "course_id": 1, "progress": 90},
        {"user_id": 5, "course_id": 3, "progress": 20},
    ]
    for e in enrollments_data:
        if not db.query(Enrollment).filter(
            Enrollment.user_id == e["user_id"],
            Enrollment.course_id == e["course_id"]
        ).first():
            db.add(Enrollment(**e))
    db.commit()
    print("  [OK] Enrollments seeded: 4 enrollments")


def seed_submissions():
    from app.models.submission import Submission
    existing = db.query(Submission).count()
    if existing >= 4:
        print("  [SKIP] Submissions already seeded")
        return

    submissions_data = [
        {"assignment_id": 1, "user_id": 4, "marks": 88},
        {"assignment_id": 1, "user_id": 5, "marks": 76},
        {"assignment_id": 2, "user_id": 4, "marks": None},   # ungraded
        {"assignment_id": 3, "user_id": 5, "marks": 92},
        {"assignment_id": 4, "user_id": 4, "marks": 45},
        {"assignment_id": 5, "user_id": 5, "marks": None},   # ungraded
    ]
    for s in submissions_data:
        if not db.query(Submission).filter(
            Submission.assignment_id == s["assignment_id"],
            Submission.user_id == s["user_id"]
        ).first():
            db.add(Submission(**s))
    db.commit()
    print("  [OK] Submissions seeded: 6 (4 graded, 2 ungraded)")


def seed_certificates():
    from app.models.certificate import Certificate
    existing = db.query(Certificate).count()
    if existing >= 1:
        print("  [SKIP] Certificates already seeded")
        return

    certificates_data = [
        {"user_id": 5, "course_id": 1, "grade": "A"},
    ]
    for c in certificates_data:
        if not db.query(Certificate).filter(
            Certificate.user_id == c["user_id"],
            Certificate.course_id == c["course_id"]
        ).first():
            db.add(Certificate(**c))
    db.commit()
    print("  [OK] Certificates seeded: 1 certificate")


# ── Run all seeders ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n🌱 SkillBridge Database Seeder")
    print("=" * 40)
    try:
        seed_roles()
        seed_instructors()
        seed_categories()
        seed_users()
        seed_courses()
        seed_lessons()
        seed_assignments()
        seed_enrollments()
        seed_submissions()
        seed_certificates()
        print("=" * 40)
        print("✅ All seeding complete! Restart uvicorn and check http://localhost:8000/docs\n")
    except Exception as e:
        db.rollback()
        print(f"\n❌ ERROR during seeding: {e}")
        print("   Check your .env DATABASE_URL and that PostgreSQL is running.\n")
        raise
    finally:
        db.close()
