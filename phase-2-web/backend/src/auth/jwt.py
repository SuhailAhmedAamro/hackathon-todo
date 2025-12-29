"""
JWT token creation and validation utilities.

Token configuration from @specs/features/authentication.md:
- Access token: 30 minutes expiration
- Refresh token: 7 days expiration
- Algorithm: HS256
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from uuid import UUID

from src.config import settings
from src.schemas.user import TokenData


def create_access_token(user_id: UUID, username: str) -> str:
    """
    Create a JWT access token.

    Args:
        user_id: User's UUID
        username: User's username

    Returns:
        JWT access token string (valid for 30 minutes)
    """
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "user_id": str(user_id),
        "username": username,
        "exp": expire,
        "type": "access"
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token


def create_refresh_token(user_id: UUID, username: str) -> str:
    """
    Create a JWT refresh token.

    Args:
        user_id: User's UUID
        username: User's username

    Returns:
        JWT refresh token string (valid for 7 days)
    """
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    payload = {
        "user_id": str(user_id),
        "username": username,
        "exp": expire,
        "type": "refresh"
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token


def verify_token(token: str, token_type: str = "access") -> Optional[TokenData]:
    """
    Verify and decode a JWT token.

    Args:
        token: JWT token string
        token_type: Expected token type ("access" or "refresh")

    Returns:
        TokenData if valid, None if invalid

    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        # Verify token type
        if payload.get("type") != token_type:
            return None

        user_id: str = payload.get("user_id")
        username: str = payload.get("username")
        exp: int = payload.get("exp")

        if user_id is None or username is None:
            return None

        # Convert expiration to datetime
        exp_datetime = datetime.fromtimestamp(exp) if exp else None

        token_data = TokenData(
            user_id=UUID(user_id),
            username=username,
            exp=exp_datetime
        )

        return token_data

    except JWTError:
        return None


def decode_token(token: str) -> Optional[dict]:
    """
    Decode a JWT token without verification (for debugging).

    Args:
        token: JWT token string

    Returns:
        Decoded payload or None
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"verify_signature": False}
        )
        return payload
    except JWTError:
        return None
