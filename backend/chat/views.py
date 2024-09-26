from django.conf import settings
from django.core.files.storage import FileSystemStorage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, generics, status
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import ListAPIView
from .serializers import AddMemberSerializer, ChangeNameIconSerializer, ChatRoomsListSerializer, ChatMessageSerializer, ChatRoomSerializer, GetChatRoomSerializer, RemoveMemberSerializer
from .models import ChatRoom, ChatMessage, RemovedMessage, RemovedRoom
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import async_to_sync
from .consumers.chat_consumers import get_channel_layer
from user.models import User
from django.db.models import Q
from django.db.models import Max
from django.contrib.auth import get_user_model


class ChatRoomsListView(ListCreateAPIView):
    serializer_class = ChatRoomsListSerializer
    queryset = ChatRoom.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        removed_rooms = RemovedRoom.objects.filter(
            user=user).values_list('room_id', flat=True)
        query = self.request.query_params.get('q', '')
        queryset = ChatRoom.objects.filter(
            members=user
        ).filter(Q(name__icontains=query) | (Q(members__username__icontains=query, type='private')))\
            .exclude(
            id__in=removed_rooms
        ).annotate(
            last_message_time=Max('messages_chat_room__created_at')
        ).exclude(
            last_message_time__isnull=True,
            type='private'
        ).order_by(
            '-last_message_time'
        )

        return queryset


class RemoveUserRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        room_id = kwargs['room_id']
        user = self.request.user

        room = ChatRoom.objects.filter(id=room_id, members=user).first()
        if room:
            RemovedRoom.objects.get_or_create(user=user, room=room)
            messages = ChatMessage.objects.filter(
                chatRoom_id=room_id, chatRoom__members=user)
            for message in messages:
                RemovedMessage.objects.get_or_create(
                    user=user, message=message)
            return Response({'message': 'Room and messages removed for the user.'})
        else:
            return Response({'error': 'Room not found or user is not a member.'}, status=status.HTTP_404_NOT_FOUND)


class MessagesView(ListAPIView):
    serializer_class = ChatMessageSerializer
    queryset = ChatMessage.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id = self.kwargs['id']
        user = self.request.user
        ChatMessage.objects.filter(
            chatRoom__id=id, chatRoom__members=user).update(seen=True)
        return ChatMessage.objects.\
            filter(chatRoom__id=id, chatRoom__members=user).\
            exclude(id__in=RemovedMessage.objects.filter(user=user).values('message_id')).\
            order_by('created_at').reverse()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.seen = True
        instance.save()
        return Response({'Details': 'Messages Updated!'})


class RemoveUserMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        room_id = kwargs['room_id']
        user = self.request.user
        messages = ChatMessage.objects.filter(
            chatRoom_id=room_id, chatRoom__members=user)
        for message in messages:
            RemovedMessage.objects.get_or_create(user=user, message=message)
        return Response({'message': 'Selected messages have been removed for the user.'})


class ChatRoomView(generics.RetrieveAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs['pk']
        user = self.request.user
        removed_rooms = RemovedRoom.objects.filter(
            user=user).values_list('room_id', flat=True)
        room = ChatRoom.objects.filter(id=room_id).exclude(
            id__in=removed_rooms)
        unseen_messages = ChatMessage.objects.filter(
            chatRoom=room.first(), seen=False).exclude(sender=user)
        for message in unseen_messages:
            message.seen = True
            message.save()
        return room


class CheckPrivateChatRoomView(ListAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('id')
        user = self.request.user
        queryset = ChatRoom.objects.filter(
            type='private', members=user).filter(members=user_id)
        unseen_messages = ChatMessage.objects.filter(
            chatRoom=queryset.first(), seen=False).exclude(sender=user)
        for message in unseen_messages:
            message.seen = True
            message.save()
        if not queryset.exists():
            try:
                user2 = User.objects.get(id=user_id)
                chat_room = ChatRoom.objects.create(type='private')
                chat_room.members.add(user, user2)
                chat_room.save()
                queryset = ChatRoom.objects.filter(
                    type='private', members=user).filter(members=user_id)
            except Exception:
                return []
        return queryset


class DownloadMessageImageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, message_id):
        message = ChatMessage.objects.get(id=message_id)
        image = message.image_file

        fs = FileSystemStorage()
        image_url = fs.url(image.name)

        return Response({'image': request.build_absolute_uri(image_url)})


class UnseenRoomsMessagesView(ListAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        user_rooms = ChatRoom.objects.filter(members=user)
        unseen_messages_rooms = ChatMessage.objects.filter(
            chatRoom__in=user_rooms, seen=False
        ).exclude(sender=user).values_list('chatRoom', flat=True).distinct()

        return ChatRoom.objects.filter(id__in=unseen_messages_rooms)


class AddMembersToRoomView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddMemberSerializer

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return ChatRoom.objects.filter(id=room_id)


class RemoveMembersToRoomView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RemoveMemberSerializer

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return ChatRoom.objects.filter(id=room_id)


class ChangeChatRoomNameView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangeNameIconSerializer

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return ChatRoom.objects.filter(id=room_id)
