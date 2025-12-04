

from datetime import datetime
from db.database import Base
import uuid
from xmlrpc.client import DateTime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, UUID,CHAR # type: ignore
# from app.db.base import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone_number = Column(String(100), unique=True, index=True, nullable=True)
    location = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserProfileModel(Base):
    __tablename__ = "user_profiles"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    user_id = Column(CHAR(36), nullable=False, index=True, unique=True)
    bio = Column(String(1000), nullable=True)
    profile_picture_url = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserActivityModel(Base):
    __tablename__ = "user_activities"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    user_id = Column(CHAR(36), nullable=False, index=True)
    last_login = Column(DateTime, default=None)
    last_password_change= Column(DateTime, default=None)
    created_at = Column(DateTime, default=datetime.utcnow)



 