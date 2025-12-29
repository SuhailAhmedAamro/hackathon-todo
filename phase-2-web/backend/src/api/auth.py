"""
Authentication API endpoints.

Implements @specs/features/authentication.md:
- POST /api/auth/register - User registration
- POST /api/auth/login - User login with JWT tokens
- POST /api/auth/refresh - Refresh access token
- POST /api/auth/logout - Logout (invalidate tokens)
- GET /api/auth/me - Get current user info
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import Annotated

from src.database import get_session
from src.models.user import User
from src.schemas.user import UserCreate, UserLogin, UserResponse, Token
from src.auth.password import hash_password, verify_password
from src.auth.jwt import create_access_token, create_refresh_token, verify_token
from src.auth.dependencies import get_current_active_user


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session)
) -> Token:
    """
    Register a new user.

    Validation rules (from @specs/features/authentication.md):
    - Username: 3-50 chars, alphanumeric + underscore, unique
    - Email: valid format, unique, max 255 chars
    - Password: min 8 chars, uppercase, lowercase, number

    Returns JWT tokens and user info upon successful registration.
    Auto-login after registration.

    Raises:
        HTTPException 400: If username or email already exists
    """
    # Check if username exists
    statement = select(User).where(User.username == user_data.username)
    result = await session.execute(statement)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Check if email exists
    statement = select(User).where(User.email == user_data.email)
    result = await session.execute(statement)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        is_active=True
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    # Generate tokens
    access_token = create_access_token(user.id, user.username)
    refresh_token = create_refresh_token(user.id, user.username)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    session: AsyncSession = Depends(get_session)
) -> Token:
    """
    Login with username/email and password.

    Accepts either username OR email in username_or_email field.
    Returns JWT access token (30min) and refresh token (7 days).

    Raises:
        HTTPException 401: If credentials are invalid
    """
    # Try to find user by username or email
    statement = select(User).where(
        (User.username == credentials.username_or_email) |
        (User.email == credentials.username_or_email)
    )
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    # Verify user exists and password is correct
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Generate tokens
    access_token = create_access_token(user.id, user.username)
    refresh_token = create_refresh_token(user.id, user.username)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/refresh", response_model=Token)
async def refresh_token_endpoint(
    refresh_token: str,
    session: AsyncSession = Depends(get_session)
) -> Token:
    """
    Refresh access token using refresh token.

    Exchange a valid refresh token for a new access token.
    Useful when access token expires (30 minutes).

    Args:
        refresh_token: Valid refresh token (from login response)

    Returns:
        New access token and same refresh token

    Raises:
        HTTPException 401: If refresh token is invalid or expired
    """
    # Verify refresh token
    token_data = verify_token(refresh_token, token_type="refresh")
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user from database
    statement = select(User).where(User.id == token_data.user_id)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Generate new access token (keep same refresh token)
    new_access_token = create_access_token(user.id, user.username)

    return Token(
        access_token=new_access_token,
        refresh_token=refresh_token,  # Return same refresh token
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/logout")
async def logout() -> dict:
    """
    Logout user.

    Note: JWT tokens are stateless, so we can't truly "invalidate" them server-side
    without a token blacklist (which adds complexity).

    For MVP, the client should:
    1. Delete tokens from storage (localStorage, cookies)
    2. Stop including Authorization header in requests

    For production, consider:
    - Token blacklist in Redis
    - Short-lived access tokens (current: 30min)
    - Token versioning per user

    Returns:
        Success message
    """
    return {
        "message": "Logout successful",
        "detail": "Clear tokens from client storage"
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> UserResponse:
    """
    Get current authenticated user information.

    Requires valid JWT access token in Authorization header.

    Returns:
        Current user's profile information (excluding password)
    """
    return UserResponse.model_validate(current_user)
