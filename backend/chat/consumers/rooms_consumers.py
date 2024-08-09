# consumers.py
import json
import base64
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from ..models import ChatMessage, ChatRoom
from user.models import User
from chat.serializers import WsChatRoomSerializer
from rest_framework.request import Request
from asgiref.sync import sync_to_async
from django.core.files.base import ContentFile


class ConsumerRequest():
    def __init__(self, user):
        self.user = user


class RoomsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.rooms = []
        if self.user is None:
            await self.close()
        self.user_id = self.user.id
        await self.channel_layer.group_add(f'user_rooms_{self.user.id}', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        for room in self.rooms:
            await self.channel_layer.group_discard(room, self.channel_name)

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        message_type = data_json.get('type')
        if message_type == 'text':
            message = data_json['message']
            room_id = data_json['room_id']
            await self.save_message(room_id, message)
        elif message_type == 'image':
            image_data = data_json['image_file']
            room_id = data_json['room_id']
            await self.save_image_message(room_id, image_data)

    async def chat_message(self, event):
        message = event['message']
        data = await self.get_room_info(message)
        await self.send(text_data=json.dumps(data))

    @database_sync_to_async
    def get_room_info(self, message):
        room = ChatRoom.objects.get(id=message['room_id'])
        serializer = WsChatRoomSerializer(
            instance=room, context={'request': ConsumerRequest(self.user)})
        host = self.scope['host']

        return {
            'message': message,
            'chat_room': {
                'room_name': serializer.data['room_name'],
                'room_icon':  "https://" + host + serializer.data['room_icon'],
                'last_message': serializer.data['last_message'],
                'unseen_messages_count': serializer.data['unseen_messages_count'],
                'all_messages_count': serializer.data['all_messages_count'],
            }
        }

    async def send_message(self, event):
        message = event['message']
        image_file = event['image_file']
        await self.send(text_data=json.dumps({'message': message, 'image_file': None}))

    @database_sync_to_async
    def save_message(self, room_id, message):
        if not message:
            return
        room = ChatRoom.objects.get(id=room_id)
        ChatMessage.objects.create(
            chatRoom=room, sender=self.user, message=message)

    @database_sync_to_async
    def save_image_message(self, room_id, image_data):
        if not image_data:
            return
        room = ChatRoom.objects.get(id=room_id)
        format, imgstr = image_data.split(';base64,')
        ext = format.split('/')[-1]
        image_file = ContentFile(base64.b64decode(
            imgstr), name=f'{self.user.id}_{room_id}.{ext}')
        ChatMessage.objects.create(
            chatRoom=room,
            sender=self.user,
            image_file=image_file
        )
