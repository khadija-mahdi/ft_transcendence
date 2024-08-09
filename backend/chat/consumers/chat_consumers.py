import json
import base64
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from chat.models import ChatRoom, ChatMessage, RemovedRoom
from django.core.files.base import ContentFile
from api.models import Notification  # Import your Notification model
from user.views import BaseNotification

channel_layer = get_channel_layer()


class ChatConsumer(AsyncWebsocketConsumer, BaseNotification):
    async def connect(self):
        self.user = self.scope['user']
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        if not await self.is_member(self.user, self.room_id):
            await self.send(text_data=json.dumps({
                'error': 'Forbidden access'
            }))
            await self.close(code=1000)  # Use a valid close code
            return
        self.room_group_name = 'chat_%s' % self.room_id
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name)

    async def receive(self, text_data):
        if not await self.is_member(self.user, self.room_id):
            await self.send(text_data=json.dumps({
                'error': 'Forbidden access'
            }))
            await self.close(code=1000)
            return
        data_json = json.loads(text_data)
        message_type = data_json.get('type')

        if message_type == 'text':
            message_text = data_json['message']
            await self.save_message(message_text)
            await self.emit_to_all_members(message_text)
            await self.channel_layer.group_send(
                self.room_group_name,
                self.create_message(message_text)
            )
            await self.notify_users(message_text, message_type)
        elif message_type == 'image':
            image_data = data_json['image_file']
            await self.save_image_message(image_data)
            await self.emit_to_all_members(image_data)
            await self.channel_layer.group_send(
                self.room_group_name,
                self.create_image_message(image_data)
            )
            await self.notify_users(image_data, message_type)

    async def chat_message(self, event):
        if not await self.is_member(self.user, self.room_id):
            await self.send(text_data=json.dumps({
                'error': 'Forbidden access'
            }))
            await self.close(code=1000)
            return
        message = event['message']
        sender = message.get('sender')
        if self.user.username == sender:
            return
        await self.send(text_data=json.dumps({
            'message': message
        }))

    def create_message(self, message):
        return {
            'type': 'chat_message',
            'message': {
                'message': message,
                'sender': self.user.username,
                'room_id': self.room_id
            }
        }

    def create_image_message(self, image_data):
        return {
            'type': 'chat_message',
            'message': {
                'image': image_data,
                'sender': self.user.username,
                'room_id': self.room_id
            }
        }

    async def emit_to_all_members(self, message):
        chat_room = await database_sync_to_async(ChatRoom.objects.get)(id=self.room_id)
        members_qs = chat_room.members.all()
        members = await database_sync_to_async(list)(members_qs)
        for member in members:
            await self.channel_layer.group_send(
                f'user_rooms_{member.id}',
                self.create_message(message)
            )

    @database_sync_to_async
    def save_message(self, message_text):
        if not message_text:
            return
        chat_room = ChatRoom.objects.get(id=self.room_id)
        ChatMessage.objects.create(
            chatRoom=chat_room,
            sender=self.user,
            message=message_text
        )
        removed_room = RemovedRoom.objects.filter(
            user=self.user, room=chat_room)
        removed_room.delete()
        for member in chat_room.members.all():
            if member != self.user:
                removed_room_receiver = RemovedRoom.objects.filter(
                    user=member, room=chat_room)
                if removed_room_receiver:
                    removed_room_receiver.delete()

    @database_sync_to_async
    def save_image_message(self, image_data):
        if not image_data:
            return
        chat_room = ChatRoom.objects.get(id=self.room_id)
        format, imgstr = image_data.split(';base64,')
        ext = format.split('/')[-1]
        image_file = ContentFile(base64.b64decode(
            imgstr), name=f'{self.user.id}_{self.room_id}.{ext}')
        ChatMessage.objects.create(
            chatRoom=chat_room,
            sender=self.user,
            image_file=image_file
        )
        removed_room = RemovedRoom.objects.filter(
            user=self.user, room=chat_room)
        removed_room.delete()
        for member in chat_room.members.all():
            if member != self.user:
                removed_room_receiver = RemovedRoom.objects.filter(
                    user=member, room=chat_room)
                if removed_room_receiver:
                    removed_room_receiver.delete()

    @database_sync_to_async
    def is_member(self, user, room_id):
        return ChatRoom.objects.filter(id=room_id, members=user).exists()

    async def notify_users(self, message, message_type):
        await sync_to_async(self._notify_users_sync)(message, message_type)

    def _notify_users_sync(self, message, message_type):
        chat_room = ChatRoom.objects.get(id=self.room_id)
        members = list(chat_room.members.all())
        title = 'You Have A  New Message'
        type = 'messenger'
        description = f'{self.user.username} sent a new message' if message_type == 'text' else f'{self.user.username} sent a new image'
        action = f'{self.room_id}'

        for member in members:
            if member != self.user:
                self._create_chat_notification(
                    recipient=member,
                    title=title,
                    type=type,
                    description=description,
                    action=action,
                    sender=self.user
                )
