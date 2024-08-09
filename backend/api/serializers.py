from django.urls import reverse
from rest_framework import serializers
from .models import Notification
from user.serializers import UserSerializer


class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(many=False, read_only=True)
    recipient = UserSerializer(many=False, read_only=True)
    icon = serializers.CharField(read_only=True, source='sender.image_url')
    seen = serializers.BooleanField(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'sender', 'title', 'description', 'icon', 'type',
                  'action', 'seen', 'action', 'created_at', 'updated_at']
