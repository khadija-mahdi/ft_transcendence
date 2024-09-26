from .models import Tournament
from channels.layers import get_channel_layer
import json
from transcendent.consumers import NotifyUser
from api.models import Notification
from api.serializers import NotificationSerializer
import logging

logger = logging.getLogger(__name__)


def send_notification(notification, request=None):
    channel_layer = get_channel_layer()
    notification_serialized = NotificationSerializer(
        notification, context={'request': request}).data
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
    logger.info(f'Notify Tournament {tournament_id} Users ')
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        tournament.ongoing = True
        tournament.save()
        logger.debug(f'Tournament {tournament.uuid} is about to start')
        registeredUsers = tournament.registered_users.all()
        for user in registeredUsers:
            logger.debug(
                f'Sending Notification To User-{user.username}')
            create_notification(
                user,
                tournament.name,
                f'Tournament {tournament.name} is about to start',
                'tournament',
                tournament.uuid
            )
        return
    except Exception as e:
        logger.error(f'Job failed for tournament {tournament_id}: {e}')
        raise  # This will trigger the retry logic
