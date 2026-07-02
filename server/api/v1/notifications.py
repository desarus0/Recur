from fastapi import APIRouter, Depends
from models.notification import NotificationResponse
from services.db.notifications import get_user_notifications
from auth.dependencies import get_current_user
from typing import List

router = APIRouter()

@router.get("", response_model=List[NotificationResponse])
async def list_notifications(current_user: dict = Depends(get_current_user)):
    user_id = current_user["clerk_user_id"]

    notifications = await get_user_notifications(user_id)

    return notifications
