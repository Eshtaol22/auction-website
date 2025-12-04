
from datetime import datetime
from db.database import Base
import uuid
from xmlrpc.client import DateTime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, UUID,CHAR # type: ignore


class UserCredentialsModel(Base):
    __tablename__ = "user_credentials"
    
    id  = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    user_id = Column(CHAR(36), nullable=False, index=True, unique=True)
    hashed_password = Column(String(1000), nullable=False)
    security_question = Column(String(1000), nullable=True)
    security_answer = Column(String(1000), nullable=True) 
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    failed_login_attempts = Column(Integer, default=0)
