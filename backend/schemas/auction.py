from typing import List, Optional
from pydantic import BaseModel

# ===========================================
# Auction Creation Request Schema
# ===========================================
class AuctionGetRespondSchema(BaseModel):
    auction_id: str
    title: str
    description: str
    starting_bid: float
    total_bids: int
    total_price_bids: float
    is_active: bool
    winner_id: Optional[str] = None
    winner_price: Optional[float] = None
    created_at: str
    creater_id: str
    location: Optional[str] = None
    tags: Optional[List[str]] = None
    category: str
    listing_end: str
    product_image_urls: List[str]
    updated_at: str

# ===========================================
# List of Auctions Response Schema
# ===========================================
class AuctionListResponse(BaseModel):
    auctions: List[AuctionGetRespondSchema]
    
# ===========================================
# Auction Get Single Response Schema
# ===========================================
class AuctionGetResponseSchema(BaseModel):
    auction: AuctionGetRespondSchema

# ===========================================
# Auction Creation Request Schema
# ===========================================
class AuctionCreateRequestSchema(BaseModel):
    title: str
    description: str
    starting_bid: float
    listing_end: str
    product_image_urls: List[str]
    category: str
    tags: Optional[List[str]] = None
    location: Optional[str] = None

# ===========================================
# Auction Creation Response Schema
# ===========================================
class AuctionCreateResponseSchema(BaseModel):
    auction_id: str
    message: str = "Auction created successfully"

# ===========================================
# Update Auction Request Schema
# ===========================================
class AuctionUpdateRequestSchema(BaseModel):
    title : Optional[str] = None
    description : Optional[str] = None
    starting_bid : Optional[float] = None
    listing_end : Optional[str] = None
    product_image_urls : Optional[List[str]] = None
    category : Optional[str] = None
    tags : Optional[List[str]] = None
    location : Optional[str] = None

# ===========================================
# Update Auction Response Schema
# ===========================================
class AuctionUpdateResponseSchema(BaseModel):
    message: str = "Auction Updated Successfully"

# ===========================================
# Delete Auction Request Schema
# ==========================================
class AuctionDeleteRequestSchema(BaseModel):
    auction_id: str

# ===========================================
# Delete Auction Response Schema
# ===========================================
class AuctionDeleteResponseSchema(BaseModel):
    message: str = "Auction Deleted Successfully"


