from fastapi import FastAPI
from api.v1 import auth, subscriptions, analytics, notifications
from core.logger import logger
from core.config import settings
from middleware.cors import add_cors
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from services.email.notifications import run_daily_tasks

app_version = "1.0.0"

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Subscription Manager API starting")
    if settings.NOTIFY_ENABLED:
        scheduler.add_job(
            run_daily_tasks,
            CronTrigger(hour=settings.NOTIFY_HOUR_UTC, minute=0),
            id="daily_renewal_tasks",
            replace_existing=True,
        )
        scheduler.start()
        logger.info("Renewal notification scheduler started (hour=%s UTC)", settings.NOTIFY_HOUR_UTC)
    yield
    if scheduler.running:
        scheduler.shutdown(wait=False)
    logger.info("Subscription Manager API shutting down")

app = FastAPI(
    title="Subscription Manager",
    description="Track and manage your subscriptions",
    version=app_version,
    redirect_slashes=False,
    lifespan=lifespan
)

add_cors(app)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["Subscriptions"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])

@app.get("/")
async def root():
    return {
        "message": "Subscription Manager API",
        "status": "running",
        "version": app_version
    }
