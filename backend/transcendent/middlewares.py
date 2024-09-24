from rest_framework_simplejwt.tokens import AccessToken

from channels.security.websocket import WebsocketDenier
from user.models import User
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs
import logging

logger = logging.getLogger(__name__)


class JWTAuthMiddlewareStack():
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        scope = self.get_cookies(scope)
        scope['host'] = str(self.get_from_headers(
            scope, b'host'), encoding='utf-8')
        try:
            token = self.get_token(scope)
            if token:
                access_token_obj = AccessToken(token)
                user = await sync_to_async(self.get_user)(
                    user_id=access_token_obj['user_id']
                )
                scope['user'] = user
            else:
                raise ValueError('No token found')
        except Exception as e:
            logger.error(f'Error validating token: {e}')
            denier = WebsocketDenier()
            return await denier(scope, receive, send)
        return await self.app(scope, receive, send)

    def get_cookies(self, scope):
        cookies = self.get_from_headers(scope, b'cookie')
        if not cookies:
            return scope
        cookies_arr = cookies.split(b'; ')
        cookies_dict = {}
        for item in cookies_arr:
            key, value = item.split(b'=')
            cookies_dict[str(key, encoding='utf-8')
                         ] = str(value, encoding='utf-8')
        scope['cookies'] = cookies_dict
        return scope

    def get_token(self, scope):
        qs = scope['query_string'].decode()
        query_params = parse_qs(qs)
        return query_params.get('token', [None])[0]

    def get_from_headers(self, scope, key):
        headers = scope.get('headers')
        key_tuple = [x for x in headers if x[0] == key]
        if not key_tuple or len(key_tuple) == 0 or len(key_tuple[0]) < 2:
            return None
        return (key_tuple[0][1])

    def get_user(self, user_id):
        return User.objects.get(id=user_id)


class DisableCSRFMiddlewareForAPI:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Adjust this path for your API
        if request.path.startswith('/api/v1/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return self.get_response(request)
