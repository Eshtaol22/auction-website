from datetime import datetime
from db.database import Base
import uuid
from sqlalchemy import CHAR, Column, Integer, String, Boolean, DateTime, Float, JSON, UUID,Text,CHAR

class AuctionProductModel(Base):
    __tablename__ = "auction_products"
    
    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    starting_bid = Column(Float, nullable=False)
    total_bids = Column(Integer, default=0)
    total_price_bids = Column(Float, default=0.0)
    winner_id = Column(CHAR(36), nullable=True, index=True)
    winner_price = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(CHAR(36), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    listing_end = Column(DateTime, nullable=False)
    product_image_urls = Column(JSON, nullable=False)  # list of URLs as JSON
    category = Column(String(100), nullable=False)
    tags = Column(JSON, nullable=True)  # list of tags as JSON
    location = Column(String(100), nullable=True)
