import uuid
from django.test import TestCase
from rest_framework.test import APIClient, URLPatternsTestCase, APITestCase
from user.models import User, Friends_Request
from rest_framework_simplejwt.tokens import RefreshToken


class BaseTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            email=f'{str(uuid.uuid4())}@test.com',
            username=str(uuid.uuid4()),
            password='testpassword',
        )
        self.generate_random_users_and_friend_request(5)
        self.user_2 = User.objects.create(
            email=f'{str(uuid.uuid4())}@test.com',
            username=str(uuid.uuid4()),
            password='testpassword',
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

    def generate_random_users_and_friend_request(self, number_of_users: int):
        self.users = []
        self.friend_requests = []
        for _ in range(number_of_users):
            self.users.append(User.objects.create(
                email=f'{str(uuid.uuid4())}@test.com',
                username=str(uuid.uuid4()),
                password='testpassword',
            ))
        for user in User.objects.all():
            if user != self.user:
                self.friend_requests.append(Friends_Request.objects.create(
                    requester=self.user, addressee=user)
                )
