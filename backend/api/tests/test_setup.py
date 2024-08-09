from rest_framework.test import APITestCase, APIClient
from user.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import Notification


class BaseTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@gmail.com', username='testuser', password='testpassword')
        self.notification = Notification.objects.create(
            recipient=self.user,
            sender=self.user,
            title='Test Notification',
            description='Test Description'
        )
        
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
