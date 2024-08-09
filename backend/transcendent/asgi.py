"""
ASGI config for transcendent project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from .middlewares import JWTAuthMiddlewareStack
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from .routing import ws_urlpatterns
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendent.settings')

http_asgi_application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": http_asgi_application,
        "websocket": JWTAuthMiddlewareStack(URLRouter(ws_urlpatterns)),
    }
)
