from .models import Tournament
from channels.layers import get_channel_layer
import json
from transcendent.consumers import NotifyUser
from api.models import Notification
from api.serializers import NotificationSerializer


def send_notification(notification, type='notification', request=None):
    channel_layer = get_channel_layer()
    notification_serialized = NotificationSerializer(
        notification, context={'request': request}).data
    notification_serialized['type'] = type  # type of notification
    str_obj = json.dumps(notification_serialized)
    NotifyUser(notification_serialized['recipient']
               ['id'], str_obj, channel_layer)


def create_notification(recipient, title, description, type, action):
    notification = Notification(
        title=title,
        description=description,
        sender=None,
        type=type,
        action=action,
        recipient=recipient)
    notification.save()
    send_notification(notification)


def notify_tournament_users(tournament_id):
    print(
        f'\n-----------\nNotify Tournament {tournament_id} Users\n-----------\n')
    tournament = Tournament.objects.get(id=tournament_id)
    tournament.ongoing = True
    tournament.save()
    registeredUsers = tournament.registered_users.all()
    for user in registeredUsers:
        print(f'Notify user {user.username}')
        create_notification(
            user,
            tournament.name,
            f'Tournament {tournament.name} is about to start',
            'tournament',
            tournament_id
        )
    return
