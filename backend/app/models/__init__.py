# Import all models here so SQLAlchemy's Base.metadata discovers every table
from app.models.role import Role
from app.models.user import User
from app.models.instructor import Instructor
from app.models.category import Category
from app.models.course import Course
from app.models.lesson import Lesson
from app.models.assignment import Assignment
from app.models.enrollment import Enrollment
from app.models.submission import Submission
from app.models.certificate import Certificate
