import redis.asyncio as redis

# Setup redis async client connection pool
# decode_responses=True automatically decodes bytes from redis to UTF-8 python strings
redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)
