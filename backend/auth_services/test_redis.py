import asyncio
import redis.asyncio as redis

async def main():
    r = redis.Redis(host='localhost', port=6379)
    try:
        await r.ping()
        print("Redis is running")
    except Exception as e:
        print(f"Redis is not running: {e}")

asyncio.run(main())
