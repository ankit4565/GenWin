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
        # Reset role and password hash as requested
        user.role = role
        user.password_hash = hash_password(password)
        await db.commit()
        print(f"Updated user: {email} to role: {role} and reset password (ID: {user.id})")
    return user

async def main():
    async with AsyncSessionLocal() as db:
        # Create/reset the requested officers
        await get_or_create_user(db, "ankit@example.com", "Ankit", "1234", "OFFICER")
        await get_or_create_user(db, "amolika@example.com", "Amolika", "1234", "OFFICER")
        await get_or_create_user(db, "vedanshi@example.com", "Vedanshi", "1234", "OFFICER")
        
        # Create/reset the requested administrator
        await get_or_create_user(db, "ansh@example.com", "Ansh", "1234", "ADMINISTRATOR")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
