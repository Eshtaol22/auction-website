from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from schemas import *
from schemas.error import APIErrorResponse
from services.auth import (
    login_user, forgot_password, get_verification_code,
    registor_user, reset_password, verify_user_email
)
from db.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post(
    "/login",
    response_model=LoginResponseSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "model": APIErrorResponse,
            "description": "Invalid credentials or account inactive",
        },
        status.HTTP_403_FORBIDDEN: {
            "model": APIErrorResponse,
            "description": "Email not verified.",
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": APIErrorResponse,
            "description": "Internal server error",
        },
    }
)
async def login(request: LoginRequestSchema, db: Session = Depends(get_db)):
    return await login_user(request, db)

@router.post(
    "/register",
    response_model=RegisterResponseSchema,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_409_CONFLICT: {
            "model": APIErrorResponse,
            "description": "User already exists (email or phone number taken).",
            "content": {
                "application/json": {
                    "example": {"detail": "Email already registered"}
                }
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": APIErrorResponse,
            "description": "Internal server error or failed to send verification email.",
            "content": {
                "application/json": {
                    "example": {"detail": "Failed to send verification email"}
                }
            },
        },
    }
)
async def register(request: RegisterRequestSchema, db: Session = Depends(get_db)):
    return await registor_user(request, db)


@router.post(
    "/verify-email",
    response_model=EmailVerificationResponseSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": APIErrorResponse,
            "description": "Invalid, expired verification code or email not found",
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid or expired verification code"}
                }
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": APIErrorResponse,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"detail": "Internal server error"}
                }
            },
        },
    }
)
async def verify_email(request: VerificationCodeRequestSchema, db: Session = Depends(get_db)):
    return await verify_user_email(request, db)


@router.post(
    "/resend-verification-code",
    response_model=EmailVerificationResponseSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": APIErrorResponse,
            "description": "Email is required",
            "content": {
                "application/json": {
                    "example": {"detail": "Email is required"}
                }
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "model": APIErrorResponse,
            "description": "Verification code could not be generated",
            "content": {
                "application/json": {
                    "example": {"detail": "Verification code not found"}
                }
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": APIErrorResponse,
            "description": "Failed to send verification email or internal server error",
            "content": {
                "application/json": {
                    "example": {"detail": "Failed to send verification email"}
                }
            },
        },
    }
)
async def resend_verification_code(request: EmailVerificationRequestSchema, db: Session = Depends(get_db)):
    return await get_verification_code(request, db)


@router.post(
    "/forget-password",
    response_model=EmailVerificationResponseSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": APIErrorResponse,
            "description": "Email is missing or user does not exist",
            "content": {
                "application/json": {
                    "example": {"detail": "Email is required"}
                }
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": APIErrorResponse,
            "description": "Failed to send password reset email or internal error",
            "content": {
                "application/json": {
                    "example": {"detail": "Failed to send password reset email"}
                }
            },
        },
    }
)
async def forget_password(request: EmailVerificationRequestSchema, db: Session = Depends(get_db)):
    return await forgot_password(request, db)


@router.post(
    "/reset-password",
    response_model=EmailVerificationResponseSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": APIErrorResponse,
            "description": "Email is required or invalid input",
            "content": {
                "application/json": {
                    "example": {"detail": "Email is required"}
                }
            },
        },
        status.HTTP_403_FORBIDDEN: {
            "model": APIErrorResponse,
            "description": "Verification code expired or not verified",
            "content": {
                "application/json": {
                    "example": {"detail": "Timeout expired. Please request a new verification code."}
                }
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "model": APIErrorResponse,
            "description": "User not found",
            "content": {
                "application/json": {
                    "example": {"detail": "User not found"}
                }
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": APIErrorResponse,
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"detail": "Internal server error"}
                }
            },
        },
    }
)
async def reset_password_route(request: PasswordResetRequestSchema, db: Session = Depends(get_db)):
    return await reset_password(request, db)
