from typing import Generator
from pytest import Session
from redis import asyncio as aioredis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings


DATABASE_URL  = settings.get_database_url()

redis_client = None
engine = create_engine(DATABASE_URL)

# Create a session local class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    Creates a new SQLAlchemy session, yields it for use in an endpoint, 
    and ensures it is closed after the request is finished.
    """
    db = SessionLocal()
    try:
        # Yield the session so it can be used by the endpoint that called it
        yield db 
    finally:
        # Ensure the session is always closed, even if errors occur
        db.close()

async def init_redis():
    global redis_client
    REDIS_HOST = settings.REDIS_HOST
    REDIS_PORT = int(settings.REDIS_PORT)
    REDIS_USER = settings.REDIS_USER
    REDIS_PASSWORD = settings.REDIS_PASSWORD
    if redis_client is None:
        redis_client = aioredis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            username=REDIS_USER,
            password=REDIS_PASSWORD,
            decode_responses=True,
        )
        await redis_client.ping()

async def get_redis() -> aioredis.Redis:
    if redis_client is None:
        raise Exception("Redis client not initialized")
    return redis_client