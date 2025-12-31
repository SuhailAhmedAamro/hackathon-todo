"""
OAuth integration for Google and GitHub authentication.

Provides OAuth 2.0 login flows for third-party authentication.
"""
from authlib.integrations.starlette_client import OAuth
from src.config import settings

# Initialize OAuth client
oauth = OAuth()

# Register Google OAuth
if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )

# Register GitHub OAuth
if settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET:
    oauth.register(
        name='github',
        client_id=settings.GITHUB_CLIENT_ID,
        client_secret=settings.GITHUB_CLIENT_SECRET,
        access_token_url='https://github.com/login/oauth/access_token',
        access_token_params=None,
        authorize_url='https://github.com/login/oauth/authorize',
        authorize_params=None,
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'user:email'},
    )


async def get_google_user_info(token: dict) -> dict:
    """
    Get user information from Google using access token.

    Args:
        token: OAuth token dictionary

    Returns:
        User info with email, name, picture
    """
    import httpx

    async with httpx.AsyncClient() as client:
        response = await client.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {token["access_token"]}'}
        )
        return response.json()


async def get_github_user_info(token: dict) -> dict:
    """
    Get user information from GitHub using access token.

    Args:
        token: OAuth token dictionary

    Returns:
        User info with email, login, name
    """
    import httpx

    async with httpx.AsyncClient() as client:
        # Get user profile
        user_response = await client.get(
            'https://api.github.com/user',
            headers={
                'Authorization': f'Bearer {token["access_token"]}',
                'Accept': 'application/json'
            }
        )
        user_data = user_response.json()

        # Get user emails if primary email is not public
        if not user_data.get('email'):
            emails_response = await client.get(
                'https://api.github.com/user/emails',
                headers={
                    'Authorization': f'Bearer {token["access_token"]}',
                    'Accept': 'application/json'
                }
            )
            emails = emails_response.json()
            # Find primary email
            for email in emails:
                if email.get('primary') and email.get('verified'):
                    user_data['email'] = email['email']
                    break

        return user_data
