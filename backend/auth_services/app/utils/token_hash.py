import hashlib


def hash_token(token: str):
    """
    Hash a string token (e.g. Refresh Token) using SHA-256 algorithm.
    Used to safely store tokens in the database without risking credentials leaks.
    """
    return hashlib.sha256(
        token.encode()
    ).hexdigest()
