from django.db import models
from user.models import User


class ChatRoom(models.Model):
    typeChoices = [
        ('private', 'Private'),
        ('group', 'Group')
    ]

    name = models.CharField(max_length=20, null=True, blank=True)
    members = models.ManyToManyField(User, related_name='members')
    admin = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='chatroom_admin')
    icon = models.ImageField(upload_to='public/chat/', null=True, blank=True)
    type = models.CharField(
        max_length=10, choices=typeChoices, default='private')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.name)


class ChatMessage(models.Model):
    typeChoices = [
        ('text', 'Text'),
        ('text', 'Image')
    ]
    chatRoom = models.ForeignKey(
        ChatRoom, on_delete=models.SET_NULL, null=True, related_name='messages_chat_room')
    sender = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='message_sender')
    message = models.CharField(max_length=1000)
    image_file = models.ImageField(
        upload_to='public/chat/', null=True, blank=True)
    seen = models.BooleanField(default=False)
    seen_at = models.DateTimeField(null=True, blank=True)
    type = models.CharField(
        max_length=10, choices=typeChoices, default='text')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.message
    
class RemovedRoom(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
class RemovedMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'message')
