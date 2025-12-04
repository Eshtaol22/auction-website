
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from schemas import *
from schemas.error import APIErrorResponse
from core.security import oauth2_scheme
from services.auth import (
    login_user, forgot_password, get_verification_code,
    registor_user, reset_password, verify_user_email
)
from db.database import get_db
from services.profile import changePassword, deleteProfile, getProfile, requestDeleteProfile, updateProfile

profileRout = APIRouter(prefix="/profile", tags=["Profile"])


@profileRout.get(
    "/",
    response_model=UserProfileResponseSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Invalid or missing token",
            "content": {
                "application/json": {"example": {"detail": "Invalid token"}}
            }
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
            "content": {
                "application/json": {"example": {"detail": "User not found"}}
            }
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal server error",
            "content": {
                "application/json": {"example": {"detail": "Internal server error"}}
            }
        },
    },
    summary="Get user profile",
    description="Retrieves the authenticated user's profile information including personal details and bio."
)
async def get_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return await getProfile(token, db)
    
@profileRout.put(
    "/",
    response_model=UserProfileResponseSchema,
    responses={
        status.HTTP_200_OK: {"description": "Profile updated successfully"},
        status.HTTP_400_BAD_REQUEST: {"description": "Invalid input data"},
        status.HTTP_401_UNAUTHORIZED: {"description": "Invalid or missing token"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Internal server error"},
    },
    summary="Update user profile",
    description="Updates the user's profile information such as name, phone number, location, bio, and profile picture."
)
async def update_profile(profile_data: UserProfileUpdateSchema, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return await updateProfile(token, profile_data, db)
@profileRout.get(
    "/delete",
    response_model=VerificationCodeResponseSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Bad request, missing or invalid input",
            "content": {
                "application/json": {"example": {"detail": "Verification code request failed"}}
            },
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Invalid or missing token",
            "content": {
                "application/json": {"example": {"detail": "Invalid token"}}
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
            "content": {
                "application/json": {"example": {"detail": "User not found"}}
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal server error",
            "content": {
                "application/json": {"example": {"detail": "Internal server error"}}
            },
        },
    },
    summary="Request delete profile verification code",
    description="Sends a verification code to the authenticated user's email to confirm deletion of their profile."
)
async def request_delete_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return await requestDeleteProfile(token, db)

@profileRout.delete(
    "/delete",
    response_model=DeleteProfileResponseSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Missing required verification code",
            "content": {
                "application/json": {"example": {"detail": "Verification code is required"}}
            }
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Invalid or missing authentication token",
            "content": {
                "application/json": {"example": {"detail": "Invalid token"}}
            }
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Invalid or expired verification code",
            "content": {
                "application/json": {"example": {"detail": "Invalid or expired verification code"}}
            }
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
            "content": {
                "application/json": {"example": {"detail": "User not found"}}
            }
        },
        status.HTTP_409_CONFLICT: {
            "description": "User has active auctions and cannot delete profile",
            "content": {
                "application/json": {
                    "example": {"detail": "You cannot delete your profile because you have an open auction."}
                }
            }
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal server error",
            "content": {
                "application/json": {"example": {"detail": "Internal server error"}}
            }
        },
    },
    summary="Delete user profile",
    description=(
        "Deletes the authenticated user's profile after verifying the provided verification code. "
        "All related data such as activity logs, credentials, and profile information will also be deleted. "
        "User's auctions will be deactivated. Profile deletion is not allowed if the user has any active auctions."
    )
)
async def delete_profile(delete_request_data: DeleteProfileRequestSchema, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return await deleteProfile(token, delete_request_data, db)


@profileRout.put(
    "/change-password",
    response_model=ChangePasswordResponseSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Invalid input or old password is incorrect",
            "content": {
                "application/json": {"example": {"detail": "Old password is incorrect"}}
            },
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Invalid or missing authentication token",
            "content": {
                "application/json": {"example": {"detail": "Invalid token"}}
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User security credentials not found",
            "content": {
                "application/json": {"example": {"detail": "User security credentials not found"}}
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal server error",
            "content": {
                "application/json": {"example": {"detail": "Internal server error"}}
            },
        },
    },
    summary="Change user password",
    description=(
        "Allows the authenticated user to change their password. "
        "The user must provide the old password for verification. "
        "Upon successful verification, the password is updated, and the user's last password change timestamp is updated."
    )
)
async def change_password(password_data: ChangePasswordRequestSchema, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return await changePassword(token, password_data, db)