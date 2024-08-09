from .test_setup import BaseTestCase
from django.urls import reverse
from rest_framework import status


class TestGameAPI(BaseTestCase):

    def test_get_games(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_match_history(self):
        response = self.client.get(
            reverse('match-history', kwargs={'pk': self.user.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tournament(self):
        response = self.client.get(reverse('tournament'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tournament_detail(self):
        response = self.client.get(
            reverse('tournament-detail', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tournament_register(self):
        response = self.client.post(
            reverse('tournament-register', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_tournament_history(self):
        response = self.client.get(
            reverse('tournament-history', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
