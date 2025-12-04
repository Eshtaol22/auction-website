# core/config.py
from pydantic_settings import BaseSettings  # type: ignore
from pydantic import ConfigDict
from urllib.parse import quote_plus
from typing import Optional

class Settings(BaseSettings):
    project_name: str = "Auc-101 Backend"
    admin_email: str = "admin@example.com"

    # Optional full URL (keeps backwards compatibility)
    DATABASE_URL: Optional[str] = None

    # Individual parts (used when DATABASE_URL not provided)
    DATABASE_USER: Optional[str] = None
    DATABASE_PASSWORD: Optional[str] = None
    DATABASE_HOST: Optional[str] = None
    DATABASE_PORT: Optional[int] = None
    DATABASE_NAME: Optional[str] = None
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_USER: str
    REDIS_PASSWORD: str
    EMAIL_PASSWORD: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    RATE_LIMIT_WINDOW_SECONDS: int = 60
    RATE_LIMIT_MAX_REQUESTS: int = 100
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: list[str] = ["*"]

    # allow extra env vars so old DATABASE_URL won't error
    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=True,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def get_database_url(self) -> str:
        """
        Return the full SQLAlchemy database URL.
        Priority:
         1. If DATABASE_URL provided in env, return it (no change).
         2. Otherwise build a mysql+pymysql URL from parts.
        """
        if self.DATABASE_URL:
            return self.DATABASE_URL

        # require parts to build the url
        required = (
            self.DATABASE_USER,
            self.DATABASE_PASSWORD,
            self.DATABASE_HOST,
            self.DATABASE_PORT,
            self.DATABASE_NAME,
        )
        if not all(required):
            raise ValueError(
                "DATABASE_URL not provided and one or more DATABASE_* parts are missing. "
                "Provide either DATABASE_URL or all of DATABASE_USER, DATABASE_PASSWORD, "
                "DATABASE_HOST, DATABASE_PORT, DATABASE_NAME."
            )

        password = quote_plus(self.DATABASE_PASSWORD)
        return (
            f"mysql+pymysql://{self.DATABASE_USER}:{password}@"
            f"{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )

# instantiate settings
settings = Settings()
