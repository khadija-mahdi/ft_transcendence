
from game import routing
from django.urls import re_path
from . import consumers
from django.core.cache import cache
from django.core.cache import CacheHandler
from chat import routing as chat_routing
ws_urlpatterns = [
    re_path(r'ws/user/connect/', consumers.ConnectedConsumer.as_asgi()),
    *routing.ws_urlpatterns,
    *chat_routing.websocket_urlpatterns,

]
