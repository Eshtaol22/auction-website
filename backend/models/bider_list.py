
from datetime import datetime
from db.database import Base
import uuid
from xmlrpc.client import DateTime
from sqlalchemy import Column, Integer, String,Float, Boolean, DateTime, UUID,CHAR # type: ignore


class BiderList(Base):
    __tablename__ = "bider_list"
    
    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    auction_product_id = Column(CHAR(36), nullable=False, index=True)
    user_id = Column(CHAR(36), nullable=False, index=True)
    bid_amount = Column(Float, nullable=False)
    bid_time = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_winner = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    
    