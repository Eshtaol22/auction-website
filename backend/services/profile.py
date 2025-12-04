from fastapi import HTTPException, Request, status
from fastapi.params import Depends
from requests import Session
from datetime import datetime
from core.security import *
from db.database import get_db
from models.auction_product import AuctionProductModel
from models.user import *
from .email_text import *
from models.user_security import UserCredentialsModel
from schemas.profile_schema import *
async def getProfile(token: str, db : Session = Depends(get_db)):
    try:
        user_id: str = decode_token(token)
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        # merge two model UserpfoielModel and UserModel
        userInfo = db.query(UserModel, UserProfileModel).outerjoin(
    UserProfileModel, UserProfileModel.user_id == UserModel.id
).filter(UserModel.id == user_id).first()
        
        if userInfo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return UserProfileResponseSchema(
            id=userInfo.UserModel.id,
            first_name=userInfo.userModel.first_name,
            last_name=userInfo.userModel.last_name,
            email=userInfo.userModel.email,
            phone_number=userInfo.userModel.phone_number,
            location=userInfo.userModel.location,
            is_active=userInfo.userModel.is_active,
            created_at=userInfo.userModel.created_at,
            update_at=userInfo.userModel.updated_at,
            bio=userInfo.UserProfileModel.bio if userInfo.UserProfileModel.bio else "",
            profile_picture_url=userInfo.UserProfileModel.profile_picture_url if userInfo.UserProfileModel.profile_picture_url else "",
        )
    except HTTPException as http_exc:
        return http_exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
async def updateProfile(token: str, profile_data: UserProfileUpdateSchema, db: Session = Depends(get_db)):
    try:
        user_id = decode_token(token)
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user, profile = db.query(UserModel, UserProfileModel).join(
            UserProfileModel, UserProfileModel.user_id == UserModel.id
        ).filter(UserModel.id == user_id).first() or (None, None)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        for attr in ["first_name", "last_name", "phone_number", "location"]:
            val = getattr(profile_data, attr)
            if val: setattr(user, attr, val)

        for attr in ["bio", "profile_picture_url"]:
            val = getattr(profile_data, attr)
            if val: setattr(profile, attr, val)

        db.commit()
        return UserProfileResponseSchema()

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
        
async def changePassword(token: str, change_password_data: ChangePasswordRequestSchema, db: Session = Depends(get_db)):
    try:
        user_id: str = decode_token(token)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        userSecurity = db.query(UserCredentialsModel).filter(
            UserCredentialsModel.user_id == user_id
        ).first()
        if not userSecurity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User security credentials not found"
            )
        # verify old password
        if not varify_password(change_password_data.old_password, userSecurity.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Old password is incorrect"
            )
        # hash new password
        new_hashed_password = hash_password(change_password_data.new_password)
        userSecurity.hashed_password = new_hashed_password
        userActivity = db.query(UserActivityModel).filter(
            UserActivityModel.user_id == user_id
        ).first()
        if userActivity:
            userActivity.last_password_change = datetime.utcnow()
        db.commit()
        return ChangePasswordResponseSchema()
    except HTTPException as http_exc:
        return http_exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
async def requestDeleteProfile(token: str, db: Session = Depends(get_db)):
    try:
        user_id = decode_token(token)
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Invalid token")
        verification_code = generate_random_otp()
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        await store_verification_code(email=user.email, code=verification_code)
        if(await send_email(user.email,"", delete_profile_email.format(code=verification_code))):
            return VerificationCodeResponseSchema()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send email. Please try again later."
        )
    except HTTPException as http_exc:
        return http_exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
async def deleteProfile(token: str, delete_request_data: DeleteProfileRequestSchema, db: Session = Depends(get_db)):
    try:
        verification_code = delete_request_data.verification_code
        if not verification_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification code is required"
            )
        # verify verification code
        
        user_id = decode_token(token)
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        user = db.query(UserModel).filter_by(id=user_id).first()
        if not (await verification_code(email=user.email, code=verification_code)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid or expired verification code"
            )
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        has_open_auction = db.query(AuctionProductModel).filter(
            AuctionProductModel.created_by == user_id,
            AuctionProductModel.is_active == True,
            AuctionProductModel.listing_end > datetime.utcnow()
        ).first()

        if has_open_auction:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You cannot delete your profile because you have an open auction."
            )

        # Bulk deactivate all user's auctions
        db.query(AuctionProductModel).filter_by(created_by=user_id).update(
            {"is_active": False}, synchronize_session=False
        )

        # Delete related profile info (one-liners)
        for model in (UserActivityModel, UserCredentialsModel, UserProfileModel):
            db.query(model).filter_by(user_id=user_id).delete(synchronize_session=False)

        db.delete(user)
        db.commit()
        return DeleteProfileResponseSchema()

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )