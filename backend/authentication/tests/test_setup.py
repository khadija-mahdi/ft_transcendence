from django.test import TestCase
from rest_framework.test import APIClient
from user.models import User
import uuid


class BaseTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = 'testuser'
        self.password = 'testpassword'
        self.email = 'testuser@gmail.com'

        self.user = User.objects.create_user(
            email=f'{str(uuid.uuid4())}@test.com',
            password=self.password,
            username=str(uuid.uuid4()),
        )
