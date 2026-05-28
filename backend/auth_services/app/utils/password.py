import bcrypt


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt directly.
    Passlib is incompatible with bcrypt >= 4.0, so we use the bcrypt library directly.
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """
    Verify a plaintext password against a stored bcrypt hash.
    Catches ValueError to gracefully handle cases where the stored hash is invalid (e.g. plain text).
    """
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except ValueError:
        return False