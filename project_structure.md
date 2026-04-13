# SkillBridge — Project File Structure

## Overview

SkillBridge is a full-stack online learning platform built with:

- **Backend**: FastAPI (Python) + PostgreSQL
- **Frontend**: React (with Vite) + Tailwind CSS
- **Database ORM**: SQLAlchemy + Alembic (migrations)
- **Authentication**: JWT (JSON Web Tokens)
- **API Docs**: Auto-generated via FastAPI (Swagger UI / ReDoc)
- **Package Management**: pip (backend), npm (frontend)

---

## Root Directory

```
skillbridge/
├── backend/                    # FastAPI application
├── frontend/                   # React application
├── docs/                       # Project documentation
│   ├── backend.md
│   ├── frontend.md
│   ├── design.md
│   └── project_structure.md
├── .gitignore
├── README.md
└── docker-compose.yml          # Optional: containerized setup
```

---

## Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Environment variables, settings
│   ├── database.py              # SQLAlchemy engine & session setup
│   │
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── course.py
│   │   ├── instructor.py
│   │   ├── category.py
│   │   ├── enrollment.py
│   │   ├── lesson.py
│   │   ├── assignment.py
│   │   ├── submission.py
│   │   └── certificate.py
│   │
│   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── course.py
│   │   ├── instructor.py
│   │   ├── category.py
│   │   ├── enrollment.py
│   │   ├── lesson.py
│   │   ├── assignment.py
│   │   ├── submission.py
│   │   └── certificate.py
│   │
│   ├── routers/                 # API route definitions
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── roles.py
│   │   ├── courses.py
│   │   ├── instructors.py
│   │   ├── categories.py
│   │   ├── enrollments.py
│   │   ├── lessons.py
│   │   ├── assignments.py
│   │   ├── submissions.py
│   │   └── certificates.py
│   │
│   ├── crud/                    # Database CRUD logic (service layer)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── course.py
│   │   ├── instructor.py
│   │   ├── category.py
│   │   ├── enrollment.py
│   │   ├── lesson.py
│   │   ├── assignment.py
│   │   ├── submission.py
│   │   └── certificate.py
│   │
│   └── utils/                   # Utility helpers
│       ├── __init__.py
│       ├── auth.py              # JWT creation/verification
│       └── dependencies.py     # FastAPI dependency injection (get_db, get_current_user)
│
├── alembic/                     # Database migrations
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 0001_initial_schema.py
├── alembic.ini
├── requirements.txt
├── .env                         # Environment variables (not committed)
└── .env.example
```

---

## Frontend Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx                 # React app entry point
│   ├── App.jsx                  # Root component with routing
│   │
│   ├── api/                     # Axios API service layer
│   │   ├── axiosInstance.js     # Base Axios config (baseURL, interceptors)
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── courseService.js
│   │   ├── enrollmentService.js
│   │   ├── lessonService.js
│   │   ├── assignmentService.js
│   │   ├── submissionService.js
│   │   └── certificateService.js
│   │
│   ├── components/              # Reusable UI components
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── courses/
│   │   │   ├── CourseCard.jsx
│   │   │   └── CourseList.jsx
│   │   ├── assignments/
│   │   │   ├── AssignmentCard.jsx
│   │   │   └── SubmissionForm.jsx
│   │   └── certificates/
│   │       └── CertificateCard.jsx
│   │
│   ├── pages/                   # Full page views
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── CourseDetailPage.jsx
│   │   │   ├── LessonPage.jsx
│   │   │   ├── AssignmentsPage.jsx
│   │   │   └── CertificatesPage.jsx
│   │   ├── instructor/
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── ManageCoursesPage.jsx
│   │   │   ├── ManageLessonsPage.jsx
│   │   │   ├── ManageAssignmentsPage.jsx
│   │   │   └── GradeSubmissionsPage.jsx
│   │   └── admin/
│   │       ├── AdminPanel.jsx
│   │       ├── ManageUsersPage.jsx
│   │       ├── ManageRolesPage.jsx
│   │       └── ManageCategoriesPage.jsx
│   │
│   ├── context/                 # React Context for global state
│   │   └── AuthContext.jsx      # Auth state (user, token, login, logout)
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   │
│   └── styles/
│       └── index.css            # Tailwind CSS base
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── .env                         # VITE_API_BASE_URL (not committed)
```

---

## Documentation Directory

```
docs/
├── project_structure.md        # This file
├── backend.md                  # Backend API documentation
├── frontend.md                 # Frontend component documentation
└── design.md                   # System design & architecture
```

---

## Additional Tools & Frameworks

| Layer | Tool / Framework | Purpose |
|---|---|---|
| Backend | FastAPI | REST API framework |
| Backend | SQLAlchemy | ORM for PostgreSQL |
| Backend | Alembic | Database migrations |
| Backend | Pydantic | Data validation & serialization |
| Backend | python-jose | JWT token handling |
| Backend | passlib[bcrypt] | Password hashing |
| Backend | psycopg2-binary | PostgreSQL adapter |
| Backend | uvicorn | ASGI server |
| Frontend | React 18 + Vite | UI framework & build tool |
| Frontend | React Router v6 | Client-side routing |
| Frontend | Axios | HTTP client for API calls |
| Frontend | Tailwind CSS | Utility-first CSS styling |
| Frontend | Context API | Lightweight global state management |
| DevOps | Docker + Compose | Optional containerized deployment |
| DevOps | dotenv | Environment variable management |
