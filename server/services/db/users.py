from database.db import users_collection
from models.user import User, UserCreate
from datetime import datetime

async def create_user(user_data: UserCreate) -> User:
    user_dict = {
        "email": user_data.email,
        "name": user_data.name,
        "clerk_user_id": user_data.clerk_user_id,
        "created_at": datetime.utcnow(),
    }

    result = await users_collection.insert_one(user_dict)

    user_dict["id"] = str(result.inserted_id)

    return User(**user_dict)

async def get_user_by_email(email: str) -> User:
    user = await users_collection.find_one({"email": email})
    return user

async def get_user_by_clerk_id(clerk_user_id: str):
    return await users_collection.find_one({"clerk_user_id": clerk_user_id})

async def delete_user(clerk_user_id: str) -> bool:
    result = await users_collection.delete_one({"clerk_user_id": clerk_user_id})
    return result.deleted_count > 0