import asyncio
import sys
from sqlalchemy import select
from shared.db import AsyncSessionLocal
from auth_services.app.models.user import User

async def main():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()
        if not users:
            print("No users found in the database.")
            return
        print(f"{'Email':<30} | {'Role':<15} | {'ID':<36}")
        print("-" * 88)
        for user in users:
            print(f"{user.email:<30} | {user.role:<15} | {user.id}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
