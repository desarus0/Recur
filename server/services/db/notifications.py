from database.db import notifications_collection
from datetime import datetime, date
from typing import List, Optional


async def log_notification(user_id: str, subscription_id: Optional[str], subscription_name: str,
                           platform: str, to_email: str, kind: str,
                           days_before: Optional[int], renewal_date: date) -> None:
    await notifications_collection.insert_one({
        "user_id": user_id,
        "subscription_id": subscription_id,
        "subscription_name": subscription_name,
        "platform": platform,
        "to_email": to_email,
        "kind": kind,
        "days_before": days_before,
        "renewal_date": datetime.combine(renewal_date, datetime.min.time()),
        "sent_at": datetime.utcnow(),
    })


async def get_user_notifications(user_id: str, limit: int = 100) -> List[dict]:
    cursor = notifications_collection.find({"user_id": user_id}).sort("sent_at", -1).limit(limit)
    notifications = []

    async for n in cursor:
        n["id"] = str(n.pop("_id"))
        notifications.append(n)

    return notifications
