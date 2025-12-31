"""
Authentication API endpoints.

Implements @specs/features/authentication.md:
- POST /api/auth/register - User registration
- POST /api/auth/login - User login with JWT tokens
- POST /api/auth/refresh - Refresh access token
- POST /api/auth/logout - Logout (invalidate tokens)
- GET /api/auth/me - Get current user info
- POST /api/auth/change-password - Change user password
- GET /api/auth/oauth/{provider} - OAuth login (Google, GitHub)
- GET /api/auth/oauth/{provider}/callback - OAuth callback
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import Annotated
import secrets

from src.database import get_session
from src.models.user import User
from src.schemas.user import UserCreate, UserLogin, UserResponse, Token, ChangePassword
from src.auth.password import hash_password, verify_password
from src.auth.jwt import create_access_token, create_refresh_token, verify_token
from src.auth.dependencies import get_current_active_user
from src.auth.oauth import oauth, get_google_user_info, get_github_user_info
from src.config import settings


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


@router.post("/change-password")
async def change_password(
    password_data: ChangePassword,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: AsyncSession = Depends(get_session)
) -> dict:
    """
    Change user password.

    Requires valid JWT access token. User must provide:
    - Current password (for verification)
    - New password (min 8 chars, uppercase, lowercase, number)
    - Confirm password (must match new password)

    Args:
        password_data: Password change request data
        current_user: Current authenticated user
        session: Database session

    Returns:
        Success message

    Raises:
        HTTPException 400: If passwords don't match
        HTTPException 401: If current password is incorrect
        HTTPException 422: If new password doesn't meet requirements
    """
    # Validate that new password and confirm password match
    if not password_data.validate_passwords_match():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirm password do not match"
        )

    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )

    # Check that new password is different from current
    if verify_password(password_data.new_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )

    # Hash new password and update user
    current_user.password_hash = hash_password(password_data.new_password)
    current_user.update_timestamp()

    session.add(current_user)
    await session.commit()

    return {
        "message": "Password changed successfully",
        "detail": "Your password has been updated. Please use your new password for future logins."
    }


@router.get("/oauth/{provider}")
async def oauth_login(provider: str, request: Request):
    """
    Initiate OAuth login with Google or GitHub.

    Args:
        provider: OAuth provider (google or github)
        request: FastAPI request object

    Returns:
        Redirect to OAuth provider's authorization page

    Raises:
        HTTPException 400: If provider is not supported or not configured
    """
    if provider not in ['google', 'github']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported OAuth provider. Use 'google' or 'github'."
        )

    # Check if OAuth provider is configured
    if provider == 'google' and not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
        )

    if provider == 'github' and not settings.GITHUB_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET."
        )

    # Redirect to OAuth provider
    redirect_uri = f"{request.url.scheme}://{request.url.netloc}/api/auth/oauth/{provider}/callback"
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)


@router.get("/oauth/{provider}/callback")
async def oauth_callback(
    provider: str,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    OAuth callback endpoint.

    Handles the callback from OAuth provider after user authorization.
    Creates or finds user and returns JWT tokens.

    Args:
        provider: OAuth provider (google or github)
        request: FastAPI request object
        session: Database session

    Returns:
        Redirect to frontend with tokens in URL params

    Raises:
        HTTPException 400: If OAuth fails or provider not supported
    """
    if provider not in ['google', 'github']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported OAuth provider"
        )

    try:
        # Get access token from OAuth provider
        client = oauth.create_client(provider)
        token = await client.authorize_access_token(request)

        # Get user info from provider
        if provider == 'google':
            user_info = await get_google_user_info(token)
            email = user_info.get('email')
            name = user_info.get('name', '')
            # Generate username from email or name
            username = email.split('@')[0] if email else name.replace(' ', '_').lower()

        elif provider == 'github':
            user_info = await get_github_user_info(token)
            email = user_info.get('email')
            username = user_info.get('login', '')
            name = user_info.get('name', username)

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to retrieve email from OAuth provider"
            )

        # Check if user exists
        statement = select(User).where(User.email == email)
        result = await session.execute(statement)
        user = result.scalar_one_or_none()

        if not user:
            # Create new user with OAuth
            # Generate a random secure password (user won't use it for OAuth login)
            random_password = secrets.token_urlsafe(32)

            # Ensure username is unique
            base_username = username
            counter = 1
            while True:
                statement = select(User).where(User.username == username)
                result = await session.execute(statement)
                if not result.scalar_one_or_none():
                    break
                username = f"{base_username}{counter}"
                counter += 1

            user = User(
                username=username,
                email=email,
                password_hash=hash_password(random_password),
                is_active=True
            )

            session.add(user)
            await session.commit()
            await session.refresh(user)

        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )

        # Generate JWT tokens
        access_token = create_access_token(user.id, user.username)
        refresh_token = create_refresh_token(user.id, user.username)

        # Redirect to frontend with tokens
        frontend_url = settings.OAUTH_REDIRECT_URI
        redirect_url = f"{frontend_url}?access_token={access_token}&refresh_token={refresh_token}&provider={provider}"

        return RedirectResponse(url=redirect_url)

    except Exception as e:
        # Redirect to frontend with error
        frontend_url = settings.OAUTH_REDIRECT_URI
        error_message = str(e) if settings.DEBUG else "OAuth authentication failed"
        redirect_url = f"{frontend_url}?error={error_message}"
        return RedirectResponse(url=redirect_url)
