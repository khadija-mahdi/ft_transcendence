import uuid
from django.db import IntegrityError
from user.models import RankAchievement, Ranks, User, Friends_Request, BlockList
from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from api.models import Notification
from user.serializers import (
    RankAchievementSerializer,
    UserSerializer,
    UserDetailSerializer,
    FriendsSerializer,
    OnlineUserSerializer,
    BlockListSerializer,
    FriendRequestSerializer,
    UserFriendsSerializer
)
from django.db.models import Q
from channels.layers import get_channel_layer
from rest_framework.views import APIView
from rest_framework.response import Response
from transcendent.consumers import NotifyUser
import json
from api.serializers import NotificationSerializer
from django.core.exceptions import ObjectDoesNotExist
from game.models import Matchup
import logging


logger = logging.getLogger(__name__)


class BaseNotification():
    def _create_notification(self, recipient, title, description, type, action):
        notification = Notification(
            title=title,
            description=description,
            sender=self.request.user,
            type=type,
            action=action,
            recipient=recipient)
        notification.save()
        send_notification(notification)

    def _create_chat_notification(self, recipient, title, description, type, action, sender):
        notification = Notification(
            recipient=recipient,
            title=title,
            type=type,
            description=description,
            action=action,
            sender=sender
        )
        notification.save()
        send_notification(notification)


class UserMixine():

    def getFriendsQ(self, user):
        block_list = BlockList.objects.filter(
            Q(user=user) | Q(blocked_user=user))
        query = user.friends.all()
        query = query.exclude(
            id__in=block_list.values_list('blocked_user', flat=True))
        query = query.exclude(id__in=block_list.values_list('user', flat=True))
        return query


class UsersList(generics.ListAPIView):
    class QuerySerializer(serializers.Serializer):
        is_none_friend = serializers.BooleanField(required=False)
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        user = self.request.user
        is_none_friend = False
        if user.is_anonymous:
            return User.objects.all()
        serializer = self.QuerySerializer(data=self.request.query_params)
        if serializer.is_valid():
            is_none_friend = serializer.validated_data.get(
                'is_none_friend', False)
        if is_none_friend:
            return User.objects.exclude(id__in=user.friends.all()).exclude(id=user.id)
        return User.objects.exclude(id=user.id)


class UsersDetail(generics.RetrieveAPIView):
    serializer_class = UserDetailSerializer
    queryset = User.objects.all()

    def perform_update(self, serializer):
        return super().perform_update(serializer)


class UsersDetailByUsername(generics.RetrieveAPIView):
    serializer_class = UserDetailSerializer
    queryset = User.objects.all()
    lookup_field = 'username'


class MyBlockList(generics.ListAPIView):
    class QuerySerializer(serializers.Serializer):
        search_query = serializers.CharField(required=False)
    serializer_class = BlockListSerializer
    queryset = BlockList.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base_query = BlockList.objects.all().filter(user=user)
        queryserializer = self.QuerySerializer(data=self.request.query_params)
        if queryserializer.is_valid():
            search_query = queryserializer.validated_data.get('search_query')
            if search_query is not None or "":
                return base_query.filter(blocked_user__username__icontains=search_query)
        return base_query


class BlockUser(generics.CreateAPIView):
    serializer_class = BlockListSerializer
    queryset = BlockList.objects.all()

    def perform_create(self, serializer):
        pk = self.kwargs.get("pk")
        blocked_user = get_object_or_404(User, pk=pk)
        serializer.save(user=self.request.user, blocked_user=blocked_user)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response({"message": "this entry already exists"}, status=status.HTTP_400_BAD_REQUEST)


class Profile(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError:
            return Response({"message": "this entry already exists"}, status=status.HTTP_400_BAD_REQUEST)


class ChangePassword(APIView):
    class ChangePasswordSerializer(serializers.Serializer):
        old_password = serializers.CharField()
        new_password = serializers.CharField()
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = self.ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'message': 'password is incorrect'}, status=400)
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({'message': 'Password changed successfully'})
        return Response(serializer.errors, status=400)


class SendFriendRequest(generics.CreateAPIView, BaseNotification):
    serializer_class = FriendsSerializer
    queryset = Friends_Request.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        pk = self.kwargs.get("pk")
        addressee = get_object_or_404(User, pk=pk)
        self._create_notification(
            addressee,
            'you have new Friend Request ',
            f'{self.request.user.username} has sent you friend request',
            'friend-request',
            self.request.user.username
        )
        serializer.save(requester=self.request.user, addressee=addressee)


class ManageFriendRequest(APIView, BaseNotification):
    class serializer_class(serializers.Serializer):
        pass

    def put(self, request, pk):
        try:
            user = get_object_or_404(User, pk=pk)
            instance = Friends_Request.objects.get(
                Q(requester=user, addressee=self.request.user))
        except ObjectDoesNotExist:
            return Response(status=404, data={'message': 'Friend request not found'})
        self._create_notification(
            user,
            'Friend Request Accepted',
            f'{self.request.user.username} has accepted your friend request',
            'friend-request',
            user.username
        )
        user.friends.add(self.request.user)
        self.request.user.friends.add(user)
        instance.delete()
        return Response(status=200)

    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        Friends_Request.objects.filter(Q(requester=user, addressee=self.request.user) | Q(
            requester=self.request.user, addressee=user)).delete()
        return Response(status=204)


class RemoveFriend(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        pk = self.kwargs.get("pk")
        friend = get_object_or_404(User, pk=pk)
        self.request.user.friends.remove(friend)
        friend.friends.remove(self.request.user)
        return


class OnlineFriendsList(generics.ListAPIView, UserMixine):
    class QuerySerializer(serializers.Serializer):
        filterbyName = serializers.BooleanField(required=False)
        filterByLevel = serializers.BooleanField(required=False)
        search = serializers.CharField(required=False)

    serializer_class = OnlineUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        serializer = self.QuerySerializer(data=self.request.query_params)
        query = self.getFriendsQ(self.request.user).filter(status='online')
        if serializer.is_valid():
            filterbyName = serializer.validated_data.get('filterbyName')
            filterByLevel = serializer.validated_data.get('filterByLevel')
            search = serializer.validated_data.get('search')
            if filterbyName:
                return query.order_by('username')
            if filterByLevel:
                return query.order_by('rank__hierarchy_order').order_by('current_xp').reverse()
            if search:
                return query.filter(Q(username__icontains=search) | Q(email__icontains=search))
        return query


class RankAchievementList(APIView):
    serializer_class = RankAchievementSerializer

    def get(self, request):
        ranking_logs = RankAchievement.objects.all().filter(
            user=request.user).order_by('achieved_at')
        data = RankAchievementSerializer(ranking_logs, many=True).data
        return Response(data, status=200)

    def post(self, request):
        rank_achievement = RankAchievement(
            user=request.user, rank=Ranks.objects.get(id=3))
        rank_achievement.save()
        return Response(status=201)


class TopPlayers(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by(
        'rank__hierarchy_order').order_by('current_xp').reverse()[:5]


class Ranking(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('current_xp').reverse()


class InvitePlayer(APIView, BaseNotification):
    serializer_class = FriendsSerializer
    queryset = Friends_Request.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        invite_id = str(uuid.uuid4())

        self._create_notification(
            recipient=user,
            title='Game invitation',
            description=f'''{self.request.user.username
                             } invited you to a game room''',
            type='game-invite',
            action=json.dumps(
                {
                    "invite_id": invite_id,
                    "player": self.request.user.username
                })
        )
        return Response({'message': 'Invitation sent', 'invite_id': invite_id})


class SendTestNotification(APIView):

    def get(self, request):
        user = User.objects.get(id=1)
        notification = Notification(
            title='Test notification',
            description='This is a test notification',
            sender=user,
            recipient=user)
        notification.save()
        send_notification(notification=notification, request=request)
        return Response({'message': 'Notification sent'})


class DestroyFriendShip(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        pk = self.kwargs.get("pk")
        friend = get_object_or_404(User, pk=pk)
        self.request.user.friends.remove(friend)
        return


class SearchUser(generics.ListAPIView):
    class QuerySerializer(serializers.Serializer):
        search_query = serializers.CharField(required=False)
        none_friend_only = serializers.BooleanField(required=False)

    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_my_query(self, search_query):
        user = self.request.user
        block_list = BlockList.objects.filter(
            Q(user=user) | Q(blocked_user=user))
        return user.friends.all().filter(
            Q(username__icontains=search_query) | Q(email__icontains=search_query))\
            .exclude(id__in=block_list
                     .values_list('blocked_user', flat=True))\
            .exclude(id__in=block_list.values_list('user', flat=True))

    def get_none_query(self, search_query):
        user = self.request.user
        return User.objects.filter(
            Q(username__icontains=search_query) | Q(email__icontains=search_query))\
            .exclude(id__in=user.friends.all()).exclude(id=user.id)

    def get_queryset(self):
        none_friend_only = False
        search_query = ""
        serializer = self.QuerySerializer(data=self.request.query_params)
        if serializer.is_valid():
            none_friend_only = serializer.validated_data.get(
                'none_friend_only')
            search_query = serializer.validated_data.get('search_query')
        search_query = search_query if search_query is not None else ""

        if not none_friend_only:
            return self.get_my_query(search_query)
        else:
            return self.get_none_query(search_query)


class RecommendUsers(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        requests = Friends_Request.objects.filter(
            Q(requester=user) | Q(addressee=user))
        return User.objects.exclude(id__in=user.friends.all())\
            .exclude(id=user.id).exclude(id__in=requests.values_list('requester', flat=True))\
            .exclude(id__in=requests.values_list('addressee', flat=True))\
            .order_by('?')


class AppendingRequests(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    queryset = Friends_Request.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Friends_Request.objects.filter(addressee=self.request.user)


class FriendList(generics.ListAPIView, UserMixine):
    serializer_class = UserFriendsSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.getFriendsQ(self.request.user)


class UnblockUser(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        pk = self.kwargs.get("pk")
        blocked_user = get_object_or_404(User, pk=pk)

        BlockList.objects.filter(
            user=self.request.user, blocked_user=blocked_user).delete()
        return


class LogoutAllDevices(APIView):
    permission_classes = [IsAuthenticated]
    channel_layer = get_channel_layer()
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        str_obj = json.dumps({
            'type': 'logout',
            'message': 'You have been logged out',
        })
        NotifyUser(user['id'], str_obj, self.channel_layer)
        return Response({'message': 'All devices logged out'})


def send_notification(notification, request=None):
    channel_layer = get_channel_layer()
    notification_serialized = NotificationSerializer(
        notification,  context={'request': request}).data
    str_obj = json.dumps(notification_serialized)
    NotifyUser(notification_serialized['recipient']
               ['id'], str_obj, channel_layer)
