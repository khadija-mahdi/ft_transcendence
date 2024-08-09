from rest_framework import serializers
from .models import ChatRoom, ChatMessage
from user.serializers import BaseUserSerializer
from user.models import User
from chat.models import RemovedMessage
from django.utils import timezone


class UserSerializer(serializers.ModelSerializer, BaseUserSerializer):
    fullname = serializers.SerializerMethodField()
    url = serializers.HyperlinkedIdentityField(
        view_name='user', lookup_field='pk')
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'image_url', 'fullname',
                  'username', 'status', 'url', ]


class ChatRoomsListSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    input_members = serializers.ListField(
        child=serializers.IntegerField(), write_only=False, required=False)
    name = serializers.CharField(required=False, write_only=True)
    room_name = serializers.SerializerMethodField()
    room_icon = serializers.SerializerMethodField()
    admin = UserSerializer(read_only=True)
    icon = serializers.ImageField(write_only=True, required=False)
    last_message = serializers.SerializerMethodField()
    unseen_messages_count = serializers.SerializerMethodField()
    all_messages_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'all_messages_count', 'room_icon', 'unseen_messages_count', 'last_message', 'name', 'icon',
                  'type', 'room_name', 'admin', 'members',  'input_members']

    def get_last_message(self, obj):
        last_message = ChatMessage.objects.filter(
            chatRoom=obj).order_by('-created_at').first()

        if last_message and not RemovedMessage.objects.filter(message_id=last_message.id).exists():
            return {
                'id': last_message.id,
                'message': last_message.message,
                'image_file': last_message.image_file.url if last_message.image_file else None,
                'created_at': last_message.created_at,
                'sender_username': last_message.sender.username if last_message.sender else None,
                'seen': last_message.seen,
                'type': 'text' if last_message.message else 'image'
            }
        return None

    def create(self, validated_data):
        user = self.context['request'].user
        members = validated_data.pop('input_members')
        if validated_data['type'] == 'private':
            if len(members) > 1:
                raise serializers.ValidationError(
                    'Private chat room can only have 2 members')
        chat_room = ChatRoom.objects.create(admin=user, **validated_data)
        chat_room.members.add(user)
        for id in members:
            chat_room.members.add(User.objects.get(id=id))
        chat_room.members.add(*members)
        return chat_room

    def get_room_icon(self, obj):
        if obj.type == 'group':
            if obj.icon and self.context['request'].build_absolute_uri(obj.icon.url):
                return self.context['request'].build_absolute_uri(obj.icon.url)
            else:
                return None
        user = self.context['request'].user
        member = obj.members.exclude(id=user.id).first()
        if member is None:
            return None
        return self.context['request'].build_absolute_uri(member.image_url)

    def get_room_name(self, obj):
        if obj.type == 'group':
            return obj.name
        user = self.context['request'].user
        member = obj.members.exclude(id=user.id).first()
        if member is None:
            return None
        return member.username

    def get_unseen_messages_count(self, obj):
        members = obj.members.all()
        user = self.context['request'].user
        unseen_messages_count = ChatMessage.objects.filter(
            chatRoom=obj, seen=False).exclude(sender=user).filter(sender__in=members).count()

        return unseen_messages_count

    def get_all_messages_count(self, obj):
        user = self.context['request'].user
        return ChatMessage.objects.filter(seen=False).exclude(sender=user).count()


class WsChatRoomSerializer(serializers.ModelSerializer):
    room_name = serializers.SerializerMethodField()
    room_icon = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unseen_messages_count = serializers.SerializerMethodField()
    all_messages_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'all_messages_count', 'room_icon',
                  'unseen_messages_count', 'last_message', 'room_name']

    def get_last_message(self, obj):
        last_message = ChatMessage.objects.filter(
            chatRoom=obj).order_by('-created_at').first()
        if last_message:
            return {
                'id': last_message.id,
                'message': last_message.message,
                'image_file': last_message.image_file.url if last_message.image_file else None,
                'created_at': timezone.localtime(last_message.created_at).isoformat(),
                'sender_username': last_message.sender.username if last_message.sender else None,
                'seen': last_message.seen,
                'type': 'text' if last_message.message else 'image'
            }
        return None

    def get_room_icon(self, obj):
        if obj.type == 'group':
            if obj.icon and hasattr(obj.icon, 'url'):
                return obj.icon.url
            else:
                return None  # Or return a default icon URL/path
        user = self.context['request'].user
        member = obj.members.exclude(id=user.id).first()
        if member is None:
            return None
        return member.image_url

    def get_room_name(self, obj):
        if obj.type == 'group':
            return obj.name
        user = self.context['request'].user
        member = obj.members.exclude(id=user.id).first()
        if member is None:
            return None
        if member.first_name + member.last_name != '':
            return member.first_name + ' ' + member.last_name
        return member.username

    def get_unseen_messages_count(self, obj):
        members = obj.members.all()
        user = self.context['request'].user
        unseen_messages_count = ChatMessage.objects.filter(
            chatRoom=obj, seen=False).exclude(sender=user).filter(sender__in=members).count()
        return unseen_messages_count

    def get_all_messages_count(self, obj):
        user = self.context['request'].user
        return ChatMessage.objects.filter(seen=False).exclude(sender=user).count()


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    seen = serializers.BooleanField(read_only=True)
    seen_at = serializers.DateTimeField(read_only=True)

    room_id = serializers.IntegerField(source='chatRoom.id', read_only=True)
    sender_username = serializers.CharField(
        source='sender.username', read_only=True)
    message = serializers.CharField(required=False)
    type = serializers.CharField(required=False)

    class Meta:
        model = ChatMessage
        fields = ['id', 'room_id', 'sender_username', 'type', 'message', 'image_file', 'seen',
                  'seen_at', 'created_at', 'sender']

    def create(self, validated_data):
        user = self.context['request'].user
        pk = self.context['request'].parser_context['kwargs']['id']
        chatRoom = ChatRoom.objects.get(id=pk)
        chat_message = ChatMessage.objects.create(
            sender=user, chatRoom=chatRoom, **validated_data)
        return chat_message

    def get_type(self, obj):
        if obj.message:
            return 'text'
        return 'image'


class ChatRoomSerializer(ChatRoomsListSerializer):
    receiverUser = serializers.SerializerMethodField()

    class Meta(ChatRoomsListSerializer.Meta):
        fields = ['id', 'room_name', 'room_icon', 'type', 'unseen_messages_count',
                  'last_message', 'admin', 'receiverUser', 'members']

    def get_receiverUser(self, obj):
        user = self.context['request'].user
        receiverUser = obj.members.exclude(id=user.id)
        return UserSerializer(receiverUser, many=True, context=self.context).data


class GetChatRoomSerializer(ChatRoomSerializer):
    receiverUser = serializers.SerializerMethodField()

    class Meta(ChatRoomsListSerializer.Meta):
        fields = ['id', 'room_name', 'room_icon', 'unseen_messages_count',
                  'type', 'last_message', 'receiverUser', 'members']

    def get_receiverUser(self, obj):
        user = self.context['request'].user
        receiverUser = obj.members.exclude(id=user.id)
        return UserSerializer(receiverUser, many=True, context=self.context).data


class AddMemberSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    admin = UserSerializer(read_only=True)
    new_members = serializers.ListField(
        child=serializers.IntegerField(), write_only=False, required=False)

    class Meta:
        model = ChatRoom
        fields = ['id', 'admin', 'members',  'new_members']

    def create(self, validated_data):
        user = self.context['request'].user
        room_id = self.context['request'].parser_context['kwargs']['room_id']
        chatRoom = ChatRoom.objects.get(id=room_id)
        new_member_ids = validated_data['new_members']
        new_members = User.objects.filter(id__in=new_member_ids)
        chatRoom.members.add(*new_members)
        return chatRoom


class RemoveMemberSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    admin = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'admin', 'members', 'user_id']

    def create(self, validated_data):
        user = self.context['request'].user
        room_id = self.context['request'].parser_context['kwargs']['room_id']
        chatRoom = ChatRoom.objects.get(id=room_id)
        user_id = validated_data['user_id']
        user = User.objects.get(id=user_id)
        
        chatRoom.members.remove(user)
        return chatRoom


class ChangeNameIconSerializer(ChatRoomsListSerializer):
    new_name = serializers.CharField(write_only=True, required=False)
    new_icon = serializers.ImageField(write_only=True, required=False)

    class Meta(ChatRoomsListSerializer.Meta):
        model = ChatRoom
        fields = ['room_name', 'room_icon', 'new_name', 'new_icon']

    def create(self, validated_data):
        room_id = self.context['request'].parser_context['kwargs']['room_id']
        chatRoom = ChatRoom.objects.get(id=room_id)
        if 'new_name' in validated_data:
            chatRoom.name = validated_data['new_name']
        if 'new_icon' in validated_data:
            chatRoom.icon = validated_data['new_icon']
        chatRoom.save()
        return chatRoom
