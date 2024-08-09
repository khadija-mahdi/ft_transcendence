from django.urls import re_path
from .consumers import chat_consumers, rooms_consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_id>\w+)/$',
            chat_consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/rooms/', rooms_consumers.RoomsConsumer.as_asgi()),
]
