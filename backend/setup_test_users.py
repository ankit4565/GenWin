import asyncio
import sys
from sqlalchemy import select
from shared.db import AsyncSessionLocal
from auth_services.app.models.user import User
from auth_services.app.utils.password import hash_password

async def get_or_create_user(db, email, full_name, password, role):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar()
    if not user:
        user = User(
            email=email,
            full_name=full_name,
            password_hash=hash_password(password),
            role=role
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        print(f"Created user: {email} with role: {role} (ID: {user.id})")
    else:
        # Update role if already exists
        user.role = role
        await db.commit()
        print(f"Updated user: {email} to role: {role} (ID: {user.id})")
    return user

async def main():
    async with AsyncSessionLocal() as db:
        await get_or_create_user(db, "citizen@example.com", "Test Citizen", "password123", "CITIZEN")
        await get_or_create_user(db, "officer@example.com", "Test Officer", "password123", "OFFICER")
        await get_or_create_user(db, "admin@example.com", "Test Admin", "password123", "SUPER_ADMIN")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
