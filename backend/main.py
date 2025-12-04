from http.client import HTTPException
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy import Engine # pyright: ignore[reportMissingImports]
from api.v1.endpoints.auth import router as auth_router
from api.v1.endpoints.profile import profileRout as profile_router
from core.security import RateLimitMiddleware, RequestInfoMiddleware
from db.database import Base, engine, init_redis
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title = "Auc-101",version="1.0.0",)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestInfoMiddleware)
app.add_middleware(RateLimitMiddleware)
app.include_router(
    auth_router, 
    prefix="/api/v1" # Optional: Add a version prefix for all auth routes
)
app.include_router(
    profile_router, 
    prefix="/api/v1" # Optional: Add a version prefix for all auth routes
)
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Optional: Catch unhandled exceptions (500)
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # You can log exc here
    print(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc) or "Internal server error"},
    )
@app.on_event("startup")
async def startup_event():
    """
    Function to run on application startup.
    Creates all defined database tables if they do not already exist.
    This ensures the 'users' and 'user_credentials' tables are available.
    """
    print("Initializing database tables...")
    # Base.metadata.create_all() uses the Base (inherited by all your models) 
    # to find all defined tables and create them in the database.
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables initialized successfully.")
    except HTTPException as http_exc:
        return http_exc
    except Exception as e:
        # It's important to catch errors here to ensure the server can log the issue
        print(f"Error during database initialization: {e}")
    finally:
        await init_redis()
        print("Redis initialized successfully.")

# ---------------------------------------------
@app.get("/")
def read_root():
    # session database start
    
    return {"message": "Welcome to the Auction API"}