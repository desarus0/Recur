from database.db import subscriptions_collection
from models.subscription import Subscription, SubscriptionCreate, SubscriptionUpdate
from datetime import datetime, date
from bson import ObjectId
from typing import List, Optional

async def create_subscription(user_id: str, sub_data: SubscriptionCreate) -> Subscription:
    sub_dict = {
        "user_id": user_id,
        "platform": sub_data.platform,
        "name": sub_data.name,
        "cost": sub_data.cost,
        "billing_cycle": sub_data.billing_cycle,
        "renewal_date": datetime.combine(sub_data.renewal_date, datetime.min.time()),
        "status": "active",
        "category": sub_data.category,
        "notify_days_before": sub_data.notify_days_before,
        "last_notified_renewal": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await subscriptions_collection.insert_one(sub_dict)

    sub_dict["id"] = str(result.inserted_id)

    return Subscription(**sub_dict)

async def get_user_subscriptions(user_id: str) -> List[Subscription]:
    cursor = subscriptions_collection.find({"user_id": user_id})
    subscriptions = []

    async for sub in cursor:
        sub["id"] = str(sub.pop("_id"))
        subscriptions.append(Subscription(**sub))
    
    return subscriptions

async def get_subscription_by_id(subscription_id: str, user_id: str) -> Optional[Subscription]:
    sub = await subscriptions_collection.find_one({
        "_id": ObjectId(subscription_id),
        "user_id": user_id
    })

    if sub:
        sub["id"] = str(sub.pop("_id"))
        return Subscription(**sub)
    
    return None

async def update_subscription(subscription_id: str, user_id: str, update_data: SubscriptionUpdate) -> Optional[Subscription]:
    # Only include fields that were provided
    update_dict = {k: v for k, v in update_data.dict(exclude_unset=True).items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()

    result = await subscriptions_collection.update_one(
        {"_id": ObjectId(subscription_id), "user_id": user_id},
        {"$set": update_dict}
    )

    if result.modified_count > 0:
        return await get_subscription_by_id(subscription_id, user_id)
    
    return None

async def delete_subscription(subscription_id: str, user_id: str) -> bool:
    result = await subscriptions_collection.delete_one({
        "_id": ObjectId(subscription_id),
        "user_id": user_id
    })

    return result.deleted_count > 0

async def get_notifiable_subscriptions() -> List[Subscription]:
    cursor = subscriptions_collection.find({
        "status": "active",
        "notify_days_before": {"$ne": None},
    })
    subscriptions = []

    async for sub in cursor:
        sub["id"] = str(sub.pop("_id"))
        subscriptions.append(Subscription(**sub))

    return subscriptions

async def mark_notified(subscription_id: str, renewal_date: date) -> None:
    await subscriptions_collection.update_one(
        {"_id": ObjectId(subscription_id)},
        {"$set": {"last_notified_renewal": datetime.combine(renewal_date, datetime.min.time())}}
    )

async def get_active_subscriptions() -> List[Subscription]:
    cursor = subscriptions_collection.find({"status": "active"})
    subscriptions = []

    async for sub in cursor:
        sub["id"] = str(sub.pop("_id"))
        subscriptions.append(Subscription(**sub))

    return subscriptions

async def set_renewal_date(subscription_id: str, renewal_date: date) -> None:
    await subscriptions_collection.update_one(
        {"_id": ObjectId(subscription_id)},
        {"$set": {
            "renewal_date": datetime.combine(renewal_date, datetime.min.time()),
            "updated_at": datetime.utcnow(),
        }}
    )