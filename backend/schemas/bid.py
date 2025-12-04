
from pydantic import BaseModel


# ========================================
# Bid Request Schema
# ========================================
class BidRequestSchema(BaseModel):
    auction_id: str
    bid_amount: float

# ========================================
# Bid Response Schema
# ========================================
class BidResponseSchema(BaseModel):
    bid_title: str
    bid_ammount: float
    message: str = "Bid placed successfully"

# ========================================
# Bid History Response Schema
# ========================================
class BidHistoryResponseSchema(BaseModel):
    bid_id: str
    auction_id: str
    auction_title: str
    auction_description: str
    bid_amount: float
    auction_end_time: str
    is_winner: bool
    total_bids: int
    image_urls: list[str]
    category: str
    tags: list[str] | None
    location: str | None
    created_at: str
    starting_bid: float
    is_active: bool
    winner_price: float | None
class BidHistoryListsResponseSchema(BaseModel):
    myBids: list[BidHistoryResponseSchema]

# ==========================================
# Withdraw Bid Request Schema
# ==========================================
class WithdrawBidRequestSchema(BaseModel):
    bid_id: str

# ===========================================
# Withdraw Bid Response Schema
# ===========================================
class WithdrawBidResponseSchema(BaseModel):
    message: str = "Bid withdrawn successfully"

# ===========================================
# Bid Update Reqeust Schema
# ===========================================
class BidUpdateRequestSchema(BaseModel):
    bid_id: str
    new_bid_amount: float

# ===========================================
# Bid Update Response Schema
# ===========================================
class BidUpdateResponseSchema(BaseModel):
    message: str = "Bid Updated Successfully"