from pydantic import BaseModel
from typing import Optional


# ------------------------
# Login Schemas
# ------------------------
class LoginRequestSchema(BaseModel):
    email: str
    password: str


class LoginResponseSchema(BaseModel):
    token: str
    token_type: str = "bearer"


# ------------------------
# Registration Schemas
# ------------------------
class RegisterRequestSchema(BaseModel):
    phone_number: str
    password: str
    first_name: str
    last_name: str
    email: str
    location: Optional[str] = None


class RegisterResponseSchema(BaseModel):
    message: str = "User registered successfully"


# ------------------------
# User Profile Schema
# ------------------------
class UserProfileResponseSchema(BaseModel):
    user_id: str
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    location: Optional[str] = None
    is_active: bool

# =========================
# Email Verification Request Schema
# =========================
class EmailVerificationRequestSchema(BaseModel):
    email: str

# =========================
# Email Verification Response schema
# =========================
class EmailVerificationResponseSchema(BaseModel):
    message: str = "Email verified successfully"
    
# =========================
# Verification code request schema
# =========================
class VerificationCodeRequestSchema(BaseModel):
    email: str
    code: str

# =========================
#  Password Reset Request Schema
# ==========================
class PasswordResetRequestSchema(BaseModel):
    email: str

# =========================
# Password reset confirmation schema
# =========================
class PasswordResetConfirmSchema(BaseModel):
    email: str
    new_password: str
