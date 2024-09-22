from django.test import TestCase
from rest_framework.test import APIClient
from user.models import User
import uuid
from rest_framework_simplejwt.tokens import RefreshToken
from urllib.parse import quote


class BaseTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email=f"{str(uuid.uuid4())}@gmail.com",
            username='testuser',
            password='testpassword'
        )
        self.refresh = RefreshToken.for_user(self.user)
        self.headers = [
            (b'cookie', f'access={str(self.refresh.access_token)}'.encode()),
            (b'host', b'localhost')]
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.refresh.access_token}'
        )
