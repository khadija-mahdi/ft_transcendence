from .test_setup import BaseTestCase
from django.urls import reverse
from rest_framework import status

class TestApi(BaseTestCase):

    def test_notification_view(self):
        res = self.client.get(reverse('notifications'))
        self.assertEqual(res.status_code, status.HTTP_200_OK)


    def test_notification_action(self):
        res = self.client.put(reverse('notification-action', kwargs={'pk': self.notification.id}))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.notification.refresh_from_db()
        self.assertTrue(self.notification.seen)