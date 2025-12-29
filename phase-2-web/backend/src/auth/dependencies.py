"""
FastAPI dependencies for authentication.
Provides get_current_user dependency for protected routes.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import Optional

from src.database import get_session
from src.models.user import User
from src.auth.jwt import verify_token


# HTTP Bearer token scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_session)
) -> User:
    """
    Dependency to get the current authenticated user from JWT token.

    Usage in FastAPI:
        @app.get("/protected")
        async def protected_route(current_user: User = Depends(get_current_user)):
            return {"user": current_user.username}

    Args:
        credentials: HTTP Bearer token from Authorization header
        session: Database session

    Returns:
        User object if authenticated

    Raises:
        HTTPException 401: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Get token from credentials
    token = credentials.credentials

    # Verify and decode token
    token_data = verify_token(token, token_type="access")
    if token_data is None:
        raise credentials_exception

    # Get user from database
    statement = select(User).where(User.id == token_data.user_id)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to get the current active user.
    Ensures user account is active (not disabled).

    Usage in FastAPI:
        @app.get("/protected")
        async def protected_route(user: User = Depends(get_current_active_user)):
            return {"user": user.username}

    Args:
        current_user: Current authenticated user

    Returns:
        User object if active

    Raises:
        HTTPException 403: If user account is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )

    return current_user


async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    session: AsyncSession = Depends(get_session)
) -> Optional[User]:
    """
    Optional dependency to get current user.
    Returns None if no token provided (doesn't raise exception).

    Useful for endpoints that work differently for authenticated vs anonymous users.

    Args:
        credentials: Optional HTTP Bearer token
        session: Database session

    Returns:
        User object if authenticated, None otherwise
    """
    if credentials is None:
        return None

    try:
        token = credentials.credentials
        token_data = verify_token(token, token_type="access")

        if token_data is None:
            return None

        statement = select(User).where(User.id == token_data.user_id)
        result = await session.execute(statement)
        user = result.scalar_one_or_none()

        return user

    except Exception:
        return None
