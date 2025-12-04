
from typing import List, Optional
from pydantic import BaseModel

# ========================================
#  profile response schema
# ========================================

class UserProfileResponseSchema(BaseModel):
    id: Optional[str] = ""
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    email: Optional[str] = ""
    phone_number: Optional[str] = ""
    location: Optional[str] = ""
    is_active: bool
    created_at: Optional[str] = None
    update_at: Optional[str] = None
    bio: Optional[str] = ""
    profile_picture_url: Optional[str] = ""
    
# =======================================
# profile update schema
# =======================================
class UserProfileUpdateSchema(BaseModel):
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    phone_number: Optional[str] = ""
    location: Optional[str] = ""
    bio: Optional[str] = ""
    profile_picture_url: Optional[str] = ""
    
# ========================================
# profile update response schema
# ========================================
class UserProfileUpdateResponseSchema(BaseModel):
    message: str = "Profile update successful"

# ========================================
# change password request
# ========================================
class ChangePasswordRequestSchema(BaseModel):
    old_password: Optional[str] = None
    new_password:  Optional[str] = None

# ========================================
# change password response schema
# =========================================
class ChangePasswordResponseSchema(BaseModel):
    message: str= "Password changed successfully"


# =========================================
# delete profile response 
# ========================================
class DeleteProfileResponseSchema(BaseModel):
    message: str = "Profile Deleted successfully"

# =========================================
#  delete profile request schema
# ========================================= 
class DeleteProfileRequestSchema(BaseModel):
    verification_code: Optional[str] = None
    
    
class VerificationCodeResponseSchema(BaseModel):
    message: str = "Verification code sent to your email"