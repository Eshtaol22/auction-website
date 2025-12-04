
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from passlib.context import CryptContext # pyright: ignore[reportMissingModuleSource]
from datetime import datetime, timedelta
import jwt # type: ignore
from core.config import settings
from passlib.hash import argon2
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import random
import string
import time
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware

from db.database import get_redis
from fastapi.security import OAuth2PasswordBearer

# This tells FastAPI where to get the access token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MAX_BCRYPT_LEN = 72
def hash_password(password: str) -> str:
    return argon2.hash(password)

def varify_password(plain_password: str, hashed_password: str) -> bool:
    return argon2.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    try:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )
def create_refresh_token(data: dict) -> str:
    try:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
def generate_random_otp(length: int = 6) -> str:
    generated_otp = "".join(random.choices(string.digits, k=length))
    return generated_otp

async def store_verification_code(email: str, code: str):
    emial = email.lower().strip()
    redis = await get_redis()
    key = f"verify:{email}"
    await redis.set(key, code, ex=60)
async def verify_code(email: str, code: str):
    redis = await get_redis()
    key = f"verify:{email}"
    stored_code = await redis.get(key)
    
    if stored_code is None:
       return False
    
    if stored_code != code:
        return False
    
    await redis.delete(key)
    return True
async def set_email_verified(email: str):
    redis = await get_redis()
    key = f"email_verified:{email}"
    await redis.set(key, "true", ex=180) # 2 minutes expiration
async def verify_email_verified(email: str) -> bool:
    redis = await get_redis()
    key = f"email_verified:{email}"
    status = await redis.get(key)
    return status == "true"
async def send_email(to_email: str, subject: str, body: str) -> bool:
    try:

        emailPassword = settings.EMAIL_PASSWORD

        conf = ConnectionConfig(
            MAIL_USERNAME="tolossamuel1@gmail.com",
            MAIL_PASSWORD=emailPassword,
            MAIL_FROM="tolossamuel1@gmail.com",
            MAIL_PORT=587,
            MAIL_SERVER="smtp.gmail.com",
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True,
        )
        message = MessageSchema(
            subject=subject,
            recipients=[to_email],
            body=body,
            subtype="html",
        )
        fm = FastMail(conf)
        await fm.send_message(message)
        return True
    except:
        return False
    
def get_client_ip(request: Request) -> str:
    """
    Extracts the real client IP address from the request.
    Handles proxies (X-Forwarded-For) and direct connections.
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # If behind reverse proxy (like Nginx or Render)
        ip = forwarded.split(",")[0]
    else:
        # Direct connection
        ip = request.client.host
    return ip

# count frequency of requests from on Ip address
class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        redis = await get_redis()
        ip = get_client_ip(request)
        key = f"rate_limit:{ip}"
        
        # Increment request count
        count = await redis.incr(key)
        if count == 1:
            await redis.expire(key, settings.RATE_LIMIT_WINDOW_SECONDS)

        if count > settings.RATE_LIMIT_MAX_REQUESTS:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Too many requests, please try again later."}
            )

        # Continue to route
        response = await call_next(request)
        return response
class RequestInfoMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # --- BEFORE request processing ---
        start_time = time.time()

        # Extract client info
        client_ip = request.headers.get("x-forwarded-for", request.client.host)
        user_agent = request.headers.get("user-agent", "unknown")
        path = request.url.path
        method = request.method

        # --- Continue to route handler ---
        response = await call_next(request)

        # --- AFTER request processing ---
        duration_ms = round((time.time() - start_time) * 1000, 2)

        return response