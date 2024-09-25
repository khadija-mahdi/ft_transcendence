from django.db import models


class Notification(models.Model):
    NotificationTypes = [
        ('messenger', 'Messenger',),
        ('invite', 'Invite'),
        ('friend-request', 'FriendRequest'),
        ("info", 'Info')
    ]

    recipient = models.ForeignKey('user.User', on_delete=models.CASCADE)
    sender = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, related_name='sender', null=True)
    title = models.CharField(max_length=200, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(
        max_length=30, choices=NotificationTypes, default='info')
    action = models.CharField(max_length=500, blank=True, null=True)
    seen = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
