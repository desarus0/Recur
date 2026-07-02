from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    CONNECTION_STRING: str
    DATABASE_NAME: str

    # Clerk
    CLERK_JWKS_URL: str

    # Email notifications (Resend)
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "Recur <alerts@recur-app.com>"
    NOTIFY_ENABLED: bool = True
    # Hour of day (UTC, 0-23) the daily notification job runs
    NOTIFY_HOUR_UTC: int = 13

    # Logging settings
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"

settings = Settings()