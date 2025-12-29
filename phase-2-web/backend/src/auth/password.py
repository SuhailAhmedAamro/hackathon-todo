"""
Password hashing and verification utilities.

Uses bcrypt with cost factor 12 as specified in @specs/features/authentication.md
"""
import bcrypt


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt with cost factor 12.

    Args:
        password: Plain text password

    Returns:
        Bcrypt hashed password string
    """
    # Convert password to bytes
    password_bytes = password.encode('utf-8')

    # Generate salt and hash with cost factor 12
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)

    # Return as string
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Bcrypt hashed password

    Returns:
        True if password matches, False otherwise
    """
    # Convert to bytes
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')

    # Verify
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def needs_rehash(hashed_password: str) -> bool:
    """
    Check if a password hash needs to be rehashed.
    Useful when upgrading bcrypt cost factor.

    Args:
        hashed_password: Existing password hash

    Returns:
        True if hash should be regenerated, False otherwise
    """
    # Extract cost factor from hash
    try:
        # Bcrypt hash format: $2b$<cost>$<salt><hash>
        parts = hashed_password.split('$')
        if len(parts) >= 3:
            current_cost = int(parts[2])
            return current_cost < 12
    except (ValueError, IndexError):
        pass

    return False
