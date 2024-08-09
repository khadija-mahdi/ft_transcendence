from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from user.models import User
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
import json


class ConnectedConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        cache.delete(self.get_connected_devices_prefix())
        connected_devices = self.get_update_cache(1)
        await self.channel_layer.group_add(
            notification_group(self.user.id), self.channel_name)
        if connected_devices == 0:
            await self.update_user_status('online')
        await self.accept()

    async def disconnect(self, close_code):
        connected_devices = self.get_update_cache(-1)
        await self.channel_layer.group_discard(notification_group(self.user.id), self.channel_name)
        if connected_devices == 1:
            await self.update_user_status('offline')

    async def receive(self, text_data):
        await self.send(text_data=json.dumps({
            'message': 'Message received',
            'email': self.user.email
        }))

    async def notification(self, event):
        await self.send(text_data=event['notification'])

    def get_connected_devices_prefix(self):
        return f'connected_devices_{self.user.id}'

    def get_update_cache(self, variant):
        connected_devices = cache.get(self.get_connected_devices_prefix(), 0)
        cache.set(self.get_connected_devices_prefix(),
                  connected_devices + variant)
        return connected_devices

    @database_sync_to_async
    def update_user_status(self, status):
        user = User.objects.get(id=self.user.id)
        user.status = status
        user.save()


def NotifyUser(user_id, notification, channel_layer):
    async_to_sync(channel_layer.group_send)(
        notification_group(user_id),
        {
            'type': 'notification',
            'notification': notification
        }
    )


def notification_group(user_id):
    return f'notification_{user_id}'
