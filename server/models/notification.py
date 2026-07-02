from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class NotificationResponse(BaseModel):
    id: str
    subscription_name: str
    platform: str
    to_email: str
    kind: str
    days_before: Optional[int] = None
    renewal_date: date
    sent_at: datetime
