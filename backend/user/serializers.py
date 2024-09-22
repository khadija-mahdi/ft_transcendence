import os
from django.conf import settings
from rest_framework import serializers
from user.models import RankAchievement, User, Friends_Request, Ranks, Achievements, BlockList
from rest_framework.reverse import reverse
from django.db.models import Q
from django.core.files.storage import default_storage
from enum import Enum


class FriendRequestState(Enum):
    NONE = 'NONE'
    SENT = 'SENT'
    RECEIVED = 'RECEIVED'


class BaseUserSerializer():
    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image_url is None or request is None:
            return None
        if not obj.image_url.startswith('/media'):
            return obj.image_url
        return request.build_absolute_uri(obj.image_url)

    def create_avatar(self, validated_data):
        if 'image_file' not in validated_data:
            return validated_data
        avatar = validated_data['image_file']
        save_path = os.path.join(settings.MEDIA_ROOT,
                                 'public/profile-images', avatar.name)
        path = default_storage.save(save_path, avatar)
        validated_data['image_url'] = f'/media/{path}'
        del validated_data['image_file']
        return validated_data

    def get_fullname(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip()

    def get_is_friend(self, obj):
        if self.context.get('request').user.is_anonymous:
            return False
        user = self.context.get('request').user
        if user is None:
            return False
        return user.friends.contains(obj)

    def get_is_blocked(self, obj):
        user = self.context.get('request').user
        if user is None or user.is_anonymous or user == obj:
            return False
        blocked_me_query = BlockList.objects.filter(
            user=user, blocked_user=obj)
        blocked_query = BlockList.objects.filter(user=obj, blocked_user=user)
        return blocked_me_query.exists() or blocked_query.exists()

    def get_friend_request_state(self, obj):
        user = self.context.get('request').user
        if user is None or user.is_anonymous or user == obj:
            return FriendRequestState.NONE.value
        if Friends_Request.objects.filter(requester=user, addressee=obj).exists():
            return FriendRequestState.SENT.value
        elif Friends_Request.objects.filter(requester=obj, addressee=user).exists():
            return FriendRequestState.RECEIVED.value
        return FriendRequestState.NONE.value

    def get_is_my_profile(self, obj):
        user = self.context.get('request').user
        if user is None or user.is_anonymous:
            return False
        return user == obj


class AchievementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievements
        fields = '__all__'


class RankSerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()

    class Meta:
        model = Ranks
        fields = '__all__'

    def get_icon(self, obj):
        request = self.context.get("request")
        if request is None:
            return None
        host = request.get_host()
        protocol = 'https' if self.context.get(
            'request').is_secure() else 'http'
        return f'{protocol}://{host}/{obj.icon}'


class UserFriendsSerializer(serializers.ModelSerializer, BaseUserSerializer):
    fullname = serializers.SerializerMethodField()
    url = serializers.HyperlinkedIdentityField(
        view_name='user', lookup_field='pk')
    unfriend = serializers.HyperlinkedIdentityField(
        view_name='unfriend-user', lookup_field='pk')
    block = serializers.HyperlinkedIdentityField(
        view_name='block-user', lookup_field='pk')
    message = serializers.HyperlinkedIdentityField(
        view_name='block-user', lookup_field='pk')
    image_url = serializers.SerializerMethodField()
    current_xp = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'image_url', 'fullname', 'username', 'current_xp',
                  'url', 'unfriend', 'block', 'message']


class UserSerializer(serializers.ModelSerializer, BaseUserSerializer):
    fullname = serializers.SerializerMethodField()
    url = serializers.HyperlinkedIdentityField(
        view_name='user', lookup_field='pk')
    send_request = serializers.HyperlinkedIdentityField(
        view_name='send-friend-request', lookup_field='pk')
    current_xp = serializers.IntegerField(read_only=True)
    rank = RankSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'image_url', 'fullname',
                  'username', 'rank', 'current_xp', 'coins', 'url', 'send_request']


class UserDetailSerializer(serializers.ModelSerializer, BaseUserSerializer):
    registration_method = serializers.CharField(read_only=True)
    send_request = serializers.HyperlinkedIdentityField(
        view_name='send-friend-request', lookup_field='pk')
    achievements = AchievementsSerializer(many=True, read_only=True)
    fullname = serializers.SerializerMethodField()
    ranking_logs = RankSerializer(read_only=True, many=True)
    rank = RankSerializer(read_only=True)
    coins = serializers.IntegerField(read_only=True)
    current_xp = serializers.IntegerField(read_only=True)
    image_file = serializers.ImageField(write_only=True, required=False)
    image_url = serializers.SerializerMethodField()
    rankProgressPercentage = serializers.SerializerMethodField()
    is_friend = serializers.SerializerMethodField()
    friend_request_state = serializers.SerializerMethodField()
    is_blocked = serializers.SerializerMethodField()
    is_my_profile = serializers.SerializerMethodField()
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    def __init__(self, *args, **kwargs):
        super(UserDetailSerializer, self).__init__(*args, **kwargs)
        if self.context.get('view') and self.context.get('view').kwargs.get('pk') == self.context.get('request').user.id:
            self.fields.pop('send_request')

    class Meta:
        model = User
        fields = ['id', 'image_file', 'fullname', 'username', 'first_name', 'last_name', 'enabled_2fa', 'is_my_profile', 'is_friend', 'is_blocked',
                  'friend_request_state', 'email', 'image_url', 'registration_method', 'status', 'coins', 'rank',
                  'current_xp', 'rankProgressPercentage', 'achievements', 'ranking_logs', 'send_request']

    def update(self, instance, validated_data):
        return super().update(instance, self.create_avatar(validated_data))

    def create(self, validated_data):
        return super().create(self.create_avatar(validated_data))

    def get_rankProgressPercentage(self, obj):
        if obj.rank is None:
            try:
                obj.rank = Ranks.objects.get(pk=1)
            except Exception:
                return 0
        return round((obj.current_xp / obj.rank.xp_required) * 100)


class RankAchievementSerializer(serializers.ModelSerializer):
    point = serializers.SerializerMethodField()

    class Meta:
        model = RankAchievement
        fields = ['id', 'point', 'achieved_at']

    def get_point(slef, obj):
        return (obj.rank.hierarchy_order * obj.rank.xp_required)


class OnlineUserSerializer(serializers.ModelSerializer, BaseUserSerializer):
    fullname = serializers.SerializerMethodField()
    url = serializers.HyperlinkedIdentityField(
        view_name='user', lookup_field='pk')
    send_invitation = serializers.HyperlinkedIdentityField(
        view_name='invite-player', lookup_field='pk')
    image_url = serializers.SerializerMethodField()
    current_xp = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'image_url', 'fullname', 'current_xp',
                  'username', 'url', 'send_invitation']


class BlockListSerializer(serializers.ModelSerializer):
    blocked_user = UserSerializer(read_only=True)

    class Meta:
        model = BlockList
        fields = ['blocked_user']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation["blocked_user"]


class FriendRequestSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='requester.id', read_only=True)
    image_url = serializers.SerializerMethodField()
    fullname = serializers.SerializerMethodField()
    username = serializers.CharField(source='requester.username')
    current_xp = serializers.IntegerField(
        source='requester.current_xp', read_only=True)
    manage_friend_request = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['user_id', 'username', 'fullname', 'image_url', 'current_xp',
                  'url',  'manage_friend_request']

    def get_manage_friend_request(self, obj):
        return reverse('manage-friend-request', kwargs={"pk": obj.requester.id},  request=self.context.get('request'))

    def get_url(self, obj):
        return reverse('user', kwargs={"pk": obj.requester.id},  request=self.context.get('request'))

    def get_fullname(self, obj):
        return f'{obj.requester.first_name} {obj.requester.last_name}'.strip()

    def get_image_url(self, obj):
        request = self.context.get("request")
        image_url = obj.requester.image_url
        if image_url is None or request is None:
            return None
        if not image_url.startswith('/media'):
            return image_url
        return request.build_absolute_uri(image_url)


class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friends_Request
        fields = []


def get_friendship_list(self):
    user_id = self.context.get('view').kwargs.get('pk')
    current_user = User.objects.get(pk=user_id)
    friends_as_requester = User.objects.filter(
        Q(requester__addressee=current_user) & Q(requester__is_accepted=True))
    friends_as_addressee = User.objects.filter(
        Q(addressee__addressee=current_user) & Q(addressee__is_accepted=True))
    friends = friends_as_requester | friends_as_addressee
    q = friends.exclude(id=user_id).distinct()
    return q
