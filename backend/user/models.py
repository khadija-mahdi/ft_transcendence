from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager
from django.db.models import Q, CheckConstraint, UniqueConstraint, F


class Ranks(models.Model):
    name = models.CharField(max_length=200)
    icon = models.CharField(max_length=200)
    hierarchy_order = models.IntegerField(default=0)
    xp_required = models.IntegerField(default=1000)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class RankAchievement(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    rank = models.ForeignKey('Ranks', on_delete=models.CASCADE)
    achieved_at = models.DateTimeField(auto_now_add=True)


class User(AbstractUser):

    email = models.EmailField(unique=True, blank=False, null=False)
    REGISTRATION_CHOICE = [
        ('email', 'Email'),
        ('google', 'Google'),
        ('facebook', 'Facebook'),
        ('intra', 'Intra'),
    ]
    STATUS_CHOICES = [

        ('online', 'Online'),
        ('offline', 'Offline'),
        ('inGame', 'InGame'),
        ('away', 'Away'),
    ]
    registration_method = models.CharField(max_length=10,
                                           choices=REGISTRATION_CHOICE,
                                           default='email')
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='offline')
    image_url = models.URLField(blank=True, null=True, default='/media/public/default/default-profile.jpeg')
    achievements = models.ManyToManyField('Achievements', blank=True)
    friends = models.ManyToManyField('self', symmetrical=False)
    ranking_logs = models.ManyToManyField('Ranks', through=RankAchievement)
    coins = models.IntegerField(default=0)
    rank = models.ForeignKey(Ranks, on_delete=models.CASCADE,
                             related_name='user_rank', null=True, default=None)
    current_xp = models.IntegerField(default=0)
    total_xp = models.IntegerField(default=0)
    enabled_2fa = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self) -> str:
        return self.username


class Friends_Request(models.Model):
    requester = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='requester', null=False, default=None)
    addressee = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='addressee', null=False, default=None)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            CheckConstraint(check=~Q(requester=F('addressee')),
                            name='requester_and_addressee_must_be_different'),
            UniqueConstraint(
                fields=['requester', 'addressee'], name='unique_requester_addressee')
        ]

    def __str__(self) -> str:
        return f'{self.requester.username} - {self.addressee.username}'


class BlockList(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='blocker_user', null=False, default=None)
    blocked_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='blocked_user', null=False, default=None)

    class Meta:
        constraints = [
            CheckConstraint(check=~Q(user=F('blocked_user')),
                            name='user_and_blocked_user_must_be_different'),
            UniqueConstraint(
                fields=['user', 'blocked_user'], name='unique_user_blocked_user')
        ]

    def __str__(self) -> str:
        return f'{self.user.username} Blocked {self.blocked_user.username}'


class Achievements(models.Model):
    name = models.CharField(max_length=200)
    icon = models.CharField(max_length=200)
    requirement_value = models.IntegerField(default=0)
    requirement_type = models.CharField(max_length=200, default='join')
    description = models.TextField()
    reward_coins = models.IntegerField(default=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
