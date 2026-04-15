"""
SkillBridge DB Migration Helper
Run this to safely add the `level` column to existing `courses` tables:
    cd backend
    py migrate_add_level.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        # Check if level column exists
        result = conn.execute(text("""
            SELECT column_name FROM information_schema.columns
            WHERE table_name='courses' AND column_name='level'
        """))
        if result.fetchone():
            print("✅ 'level' column already exists in courses table — no migration needed.")
            return
        
        # Add the column with a default value
        conn.execute(text("ALTER TABLE courses ADD COLUMN level VARCHAR(50) DEFAULT 'Beginner'"))
        conn.commit()
        print("✅ Added 'level' column to courses table with default 'Beginner'.")

if __name__ == "__main__":
    migrate()
