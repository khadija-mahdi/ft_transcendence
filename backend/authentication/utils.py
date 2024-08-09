from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
import requests
from django.core.exceptions import ValidationError

GOOGLE_ID_TOKEN_INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo'
GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'


def generate_user_tokens(user) -> tuple:
    serializer = TokenObtainPairSerializer()
    token_data = serializer.get_token(user)
    print(f"token_data => {token_data}")
    access_token = token_data.access_token
    refresh_token = token_data
    return access_token, refresh_token

def google_get_access_token(code, redirect_uri) -> str:
    print(f"code => {code}")
    data = {
        'code': code,
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code',
    }
    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)

    if not response.ok:
        raise ValidationError('Failed to obtain access token')
    return response.json().get('access_token')

def google_get_user_data(access_token) -> dict:
    response = requests.get(GOOGLE_USER_INFO_URL, params={'access_token': access_token})
    print(f"response => {response.json()} {response.raw}")
    
    if not response.ok:
        raise ValidationError('Failed to obtain user data')
    return response.json()

def get_first_matching_attr(obj, *attrs, default=None):
    for attr in attrs:
        if hasattr(obj, attr):
            return getattr(obj, attr)

    return default


def get_error_message(exc) -> str:
    if hasattr(exc, 'message_dict'):
        return exc.message_dict
    error_msg = get_first_matching_attr(exc, 'message', 'messages')

    if isinstance(error_msg, list):
        error_msg = ', '.join(error_msg)

    if error_msg is None:
        error_msg = str(exc)

    return error_msg

