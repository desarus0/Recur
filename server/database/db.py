from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

# Create MongoDB client
client = AsyncIOMotorClient(settings.CONNECTION_STRING)

# Get database
db = client[settings.DATABASE_NAME]

# Collections
users_collection = db['users']
subscriptions_collection = db['subscriptions']
notifications_collection = db['notifications']