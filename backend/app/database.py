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
