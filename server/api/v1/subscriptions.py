from fastapi import APIRouter, HTTPException, status, Depends
from models.subscription import SubscriptionCreate, SubscriptionResponse, SubscriptionUpdate
from core.logger import logger
from services.db.subscriptions import create_subscription, get_user_subscriptions, get_subscription_by_id, delete_subscription, update_subscription
from auth.dependencies import get_current_user
from typing import List

router = APIRouter()

@router.post("", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_sub(sub_data: SubscriptionCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["clerk_user_id"]

    subscription = await create_subscription(user_id, sub_data)

    return subscription

@router.get("", response_model=List[SubscriptionResponse])
async def get_subscriptions(current_user: dict = Depends(get_current_user)):
    user_id = current_user["clerk_user_id"]

    subscription_list = await get_user_subscriptions(user_id)
    
    return subscription_list

@router.get("/{subscription_id}", response_model=SubscriptionResponse)
async def get_subscription(subscription_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["clerk_user_id"]

    subscription = await get_subscription_by_id(subscription_id, user_id)
    if not subscription:
        raise HTTPException(status_code=404, detail="INVALID_SUBSCRIPTION")
    
    return subscription

@router.put("/{subscription_id}", response_model=SubscriptionResponse)
async def update_sub(subscription_id: str, update_data: SubscriptionUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["clerk_user_id"]

    subscription_update = await update_subscription(subscription_id, user_id, update_data)
    if not subscription_update:
        raise HTTPException(status_code=404, detail="INVALID_SUBSCRIPTION")
    
    return subscription_update

@router.delete("/{subscription_id}", status_code=204)
async def delete_sub(subscription_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["clerk_user_id"]

    sub_delete = await delete_subscription(subscription_id, user_id)
    if not sub_delete:
        raise HTTPException(status_code=404, detail="INVALID_SUBSCRIPTION")
    
    return
    


