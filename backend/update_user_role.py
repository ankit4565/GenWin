import asyncio
import sys
from sqlalchemy import select
from shared.db import AsyncSessionLocal
from auth_services.app.models.user import User

async def main():
    if len(sys.argv) < 3:
        print("Usage: python update_user_role.py <email> <role>")
        print("Roles: ADMINISTRATOR, OFFICER, CITIZEN")
        return

    email = sys.argv[1]
    role = sys.argv[2].upper()

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar()
        if not user:
            print(f"Error: User with email '{email}' not found.")
            return

        user.role = role
        await db.commit()
        print(f"Success: Updated role of '{email}' to '{role}'.")

if __name__ == "__main__":
    # Handle event loop properly on Windows
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
