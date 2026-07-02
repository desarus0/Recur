from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class SubscriptionCreate(BaseModel):
    platform: str
    name: str
    cost: float
    billing_cycle: str
    renewal_date: date
    category: Optional[str] = None
    notify_days_before: Optional[int] = None

class SubscriptionUpdate(BaseModel):
    platform: Optional[str] = None
    name: Optional[str] = None
    cost: Optional[float] = None
    billing_cycle: Optional[str] = None
    renewal_date: Optional[date] = None
    status: Optional[str] = None
    category: Optional[str] = None
    notify_days_before: Optional[int] = None

class Subscription(BaseModel):
    id: Optional[str] = None
    user_id: str
    platform: str
    name: str
    cost: float
    billing_cycle: str
    renewal_date: date
    status: str = "active"
    category: Optional[str] = None
    notify_days_before: Optional[int] = None
    last_notified_renewal: Optional[date] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class SubscriptionResponse(BaseModel):
    id: str
    platform: str
    name: str
    cost: float
    billing_cycle: str
    renewal_date: date
    status: str
    category: Optional[str] = None
    notify_days_before: Optional[int] = None
