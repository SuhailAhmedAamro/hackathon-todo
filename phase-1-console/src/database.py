"""Database configuration and session management for SQLite"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager

# Database configuration
def get_data_dir() -> Path:
    """Get the data directory path, create if doesn't exist"""
    data_dir = Path(__file__).parent.parent / "data"
    data_dir.mkdir(exist_ok=True)
    return data_dir

def get_database_url() -> str:
    """Get the SQLite database URL"""
    db_path = get_data_dir() / "todos.db"
    return f"sqlite:///{db_path}"

# SQLAlchemy setup
DATABASE_URL = get_database_url()

# Create engine with SQLite optimizations
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # Allow multi-threaded access
    echo=False  # Set to True for SQL debugging
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def init_db():
    """Initialize the database, creating all tables"""
    Base.metadata.create_all(bind=engine)

@contextmanager
def get_db() -> Session:
    """
    Get a database session with automatic cleanup

    Usage:
        with get_db() as db:
            task = db.query(Task).first()
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

def get_db_session() -> Session:
    """
    Get a raw database session (caller must manage cleanup)

    Usage:
        db = get_db_session()
        try:
            task = db.query(Task).first()
            db.commit()
        finally:
            db.close()
    """
    return SessionLocal()
