from transcendent.consumers import NotifyUser
import json
from api.serializers import NotificationSerializer
from api.models import Notification
from channels.layers import get_channel_layer
from user.models import User


class NotificationManager():

    def send_notification(self, notification: Notification, request=None) -> None:
        channel_layer = get_channel_layer()
        notification_serialized = NotificationSerializer(
            notification,  context={'request': request}).data
        str_obj = json.dumps(notification_serialized)
        NotifyUser(notification_serialized['recipient']
                   ['id'], str_obj, channel_layer)
