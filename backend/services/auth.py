from multiprocessing.resource_tracker import getfd
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from models.user_security import UserCredentialsModel
from schemas import *
from db.database import SessionLocal, get_db
from models.user import UserActivityModel, UserModel
from fastapi import Depends, HTTPException, status
import bcrypt, jwt
import asyncio
from datetime import datetime, timedelta
from core.security import *
from core.config import *
from sqlalchemy.exc import IntegrityError
from .email_text import *

from services.utility import normalize_email, remove_whitespace
async def login_user(request: LoginRequestSchema, db: Session = Depends(get_db)) -> LoginResponseSchema:

    email = normalize_email(request.email).strip()
    user_and_credentials = db.query(UserModel, UserCredentialsModel).join(
        UserCredentialsModel,
        UserModel.id == UserCredentialsModel.user_id
    ).filter(UserModel.email == email).first()

    if not user_and_credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    user, credentials = user_and_credentials

    if not varify_password(request.password, credentials.hashed_password):
        credentials.failed_login_attempts += 1
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not user.is_active:
        verification_code: str = generate_random_otp()
        await store_verification_code(email, verification_code)
        if not (await send_email(email, "Elovia Access Protocol: Verification Code Inside", verification_code_only_email.format(code = verification_code))):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send verification email"
            )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email before logging in."
        )

    # Update or create user activity
    existing_activity = db.query(UserActivityModel).filter(UserActivityModel.user_id == user.id).first()
    if existing_activity:
        existing_activity.last_login = datetime.utcnow()
    else:
        db.add(UserActivityModel(user_id=user.id, last_login=datetime.utcnow()))
    db.commit()

    # Generate JWT token
    token_data = {"user_id": str(user.id)}
    token = create_access_token(token_data)

    return LoginResponseSchema(token=token)

async def registor_user(request: RegisterRequestSchema,db: Session = Depends(get_db)):
    try:
        email = normalize_email(request.email).strip()
        if db.query(UserModel).filter(UserModel.email == email).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        hashed_password = hash_password(remove_whitespace(request.password))
        new_user = UserModel(
            first_name=request.first_name,
            last_name=request.last_name,
            email=email,
            phone_number=request.phone_number,
            location=request.location,
            is_active=False # Set to True, or False if email verification is required
        )
        
        db.add(new_user)
        try:
            db.flush() # Get the user ID (new_user.id) before committing
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Phone number already registered"
            )
        
        new_credentials = UserCredentialsModel(
            user_id=new_user.id,
            hashed_password=hashed_password
        )
        new_user_info = UserActivityModel(
            user_id = new_user.id,
            last_password_change = datetime.utcnow()
        )
        
        db.add(new_credentials)
        db.add(new_user_info)
        
        verification_code: str = generate_random_otp()
        await store_verification_code(email, verification_code)
        if not (await send_email(email, "Elovia Access Protocol: Verification Code Inside", verification_email.format(code = verification_code))):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send verification email"
            )
        db.commit()
        db.refresh(new_user)
        return RegisterResponseSchema(message="User registered successfully")
    except HTTPException as exc:
        db.rollback()
        return exc
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
async def verify_user_email(request: VerificationCodeRequestSchema, db: Session = Depends(get_db) ):
    try:
        email = normalize_email(request.email).strip()
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required"
            )
        code = request.code.strip()
        is_code_valid = await verify_code(email, code)
        if not is_code_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification code"
            )
        # set is_active to true
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not found"
            )
        user.is_active = True
        db.commit()
        await set_email_verified(email)
        
        return EmailVerificationResponseSchema()
    except HTTPException as exc:
        db.rollback()
        return exc
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

async def get_verification_code(requesst: EmailVerificationRequestSchema, db: Session = Depends(get_db)):
    try:
        email = normalize_email(requesst.email).strip()
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required"
            )
        verification_code: str = generate_random_otp()
        await store_verification_code(email, verification_code)
        if verification_code is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Verification code not found"
            )
        if not (await send_email(email, "Elovia Auction Access Code – Secure Verification Required", verification_code_only_email.format(code = verification_code))):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send verification email"
            )
        return EmailVerificationResponseSchema(message="Verification code sent successfully")
    except HTTPException as exc:
        return exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
async def forgot_password(request: PasswordResetRequestSchema, db: Session = Depends(get_db)):
    try:
        email = normalize_email(request.email).strip()
       
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required"
            )
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail = "User with this email does not exist"
            )
        verification_code: str = generate_random_otp()
        await store_verification_code(email, verification_code)
        if not ( await send_email(email, "Elovia Auction Password Reset Code - Secure Verification", reset_password_email.format(code = verification_code))):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send password reset email"
            )
        return EmailVerificationResponseSchema()
    except HTTPException as exc:
        raise exc
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
async def reset_password(request: PasswordResetConfirmSchema, db: Session = Depends(get_db)):
    try:
        email = normalize_email(request.email).strip()
        if email is None:
            raise HTTPException(
                status_code= status.HTTP_400_BAD_REQUEST,
                detail="Email is required"
            )
        if (verify_email_verified(email) == False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Timeout expired. Please request a new verification code."
            )
        code = request.email.strip()
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        hashed_new_password = hash_password(remove_whitespace(request.new_password))
        credential = db.query(UserCredentialsModel).filter(UserCredentialsModel.user_id == user.id).first()
        credential.hashed_password = hashed_new_password
        user_activity = db.query(UserActivityModel).filter(UserActivityModel.user_id == user.id).first()
        if user_activity:
            user_activity.last_password_change = datetime.utcnow()
        db.commit()
        return EmailVerificationResponseSchema(message="Password reset successfully")
    except HTTPException as exc:
        db.rollback()
        return exc
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )