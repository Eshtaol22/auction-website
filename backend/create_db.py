from db.database import engine, Base
from models.user import UserModel, UserProfileModel, UserActivityModel
from models.auction_product import AuctionProductModel
from models.bider_list import BiderList
from models.user_security import UserCredentialsModel

# Import other models here as you create them

# Create all tables in the database
Base.metadata.create_all(bind=engine)

print("✅ All tables created successfully!")