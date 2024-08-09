from rest_framework.test import APIClient
from django.test import TestCase
from game.models import Game, Tournament
from user.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta


class BaseTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        Game.objects.create(
            name='test-game',
            description='test-description',
        )
        self.user = User.objects.create(
            username='test-user',
            email='test-email@gmail.com',
            password='test-password',
        )
        self.tournament = Tournament.objects.create(
            name='test-tournament',
            description='test-description',
            max_players=16,
            start_date=timezone.now() + timedelta(days=1),
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')
