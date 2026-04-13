# SkillBridge Frontend Handoff Guide

This document is designed to give you (or your AI agent) everything needed to rapidly build the SkillBridge Frontend.

## 1. Backend Architecture Overview 
The backend is built in **FastAPI** running on `http://localhost:8000`. 
- **CORS** is already configured to accept requests from `http://localhost:5173` (the default Vite port). 
- All endpoints live under the `/api/v1/` prefix.
- All requests (except login/register) require an `Authorization` header with a Bearer Token:
  `Authorization: Bearer <your_jwt_token>`

## 2. Important Endpoint Reference

| Feature Area | Endpoints | Payload/Notes |
|--------------|-----------|---------------|
| **Auth** | `POST /api/v1/auth/register` <br> `POST /api/v1/auth/login` | **Register**: Requires JSON `{name, email, password}` (defaults to Student role). <br> **Login**: Requires **Form Data** (`username`, `password`), returns `{access_token}`. |
| **User** | `GET /api/v1/users/me` | Fetch the currently logged-in user profile. Includes their `role_id` (1=Admin, 2=Instructor, 3=Student). |
| **Courses** | `GET /api/v1/courses/` <br> `POST /api/v1/courses/` <br> `GET /api/v1/courses/{id}` | Public can GET. Instructors can POST (create). |
| **Enrollments**| `POST /api/v1/enrollments/` <br> `GET /api/v1/enrollments/me` | Pass `{course_id, user_id}` to enroll. Use `/me` to populate the Student Dashboard. |
| **Lessons** | `GET /api/v1/lessons/` | Returns the curriculum. Associated with courses via `course_id`. |
| **Assignments**| `POST /api/v1/assignments/` | Instructors post assignments. Students retrieve them. |
| **Submissions**| `POST /api/v1/submissions/` <br> `PUT .../submissions/{a_id}/{u_id}` | Students submit work. Instructors `PUT` to grade them with `{marks}`. |

*(For the exact JSON schemas, always refer to the Swagger UI at `http://localhost:8000/docs`).*

---

## 3. The "Super Prompt" for Antigravity
> **Instructions for the User:** Copy the exact text inside the box below, open a new chat with Antigravity (or another AI agent), and paste it. It contains context on the backend structure and specific instructions to build a beautiful frontend.

```text
Act as a Senior Frontend Engineer. Your task is to build the frontend for "SkillBridge", an online learning platform. 

### Technology Stack:
- React (Vite)
- Tailwind CSS
- React Router DOM (v6)
- Axios (for API requests)
- Lucide React (for icons)

### Backend Details (Already Running):
- URL: `http://localhost:8000/api/v1`
- Auth Strategy: JWT tokens stored in localStorage.
- Login Endpoint expects FORM DATA (`username`, `password`) and returns `{"access_token": "..."}`.
- All other authenticated endpoints expect a JSON payload and an `Authorization: Bearer <token>` header.
- Roles: 1 = Admin, 2 = Instructor, 3 = Student. Check the `role_id` returned by `/users/me` to determine what UI to show.

### Features & Pages to Build:
1. **Public Pages**:
   - `Landing Page`: A beautiful, premium Hero section with glassmorphism to "Find your next skill". Highlight featured courses.
   - `Login / Register`: Clean, centered card forms. 

2. **Student Dashboard (`role_id: 3`)**:
   - `My Courses`: Fetch from `/enrollments/me`. Show a progress bar for each course.
   - `Course Viewer`: When clicking a course, fetch `/lessons/` to list lessons and video placeholders.
   - `Assignments`: Fetch from `/assignments/`, allow students to click "Submit" (calls POST `/submissions/`).

3. **Instructor Dashboard (`role_id: 2`)**:
   - `Course Management`: A table showing courses the instructor created. Button to "Create New Course".
   - `Grading Portal`: Fetch `/submissions/` and allow instructors to set `marks` via PUT.

### System & Design Best Practices:
1. Initialize the Vite project immediately: `npx create-vite@latest skillbridge-frontend --template react`
2. Install Tailwind CSS & React Router DOM.
3. Configure Axios with an interceptor inside an `api.js` file so that it automatically attaches the JWT token from localStorage to every request. If a 401 is returned, redirect to `/login`.
4. Create a Global / shared Layout with a responsive Navbar.
5. Create modern, rich aesthetics. Please use dynamic hover effects, smooth transitions (`transition-all`), and modern typography (e.g., Google Inter font). If it looks plain or generic, it's a failure. Make it feel like a premium $1M+ modern learning platform.

Please formulate your plan, create the file structure, and start executing the components.
```
