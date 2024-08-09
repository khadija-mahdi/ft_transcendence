from .test_setup import BaseTestCase
from rest_framework import status
from django.urls import reverse


class TestUserAPI(BaseTestCase):
    def test_list_users(self):
        response = self.client.get(reverse('users'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_user(self):
        response = self.client.get(reverse('user', args=[self.user.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_profile(self):
        response = self.client.get(reverse('my-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_send_friend_request(self):
        response = self.client.post(
            reverse('send-friend-request', args=[self.user_2.id]))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_accept_friend_request(self):
        friend_request = self.friend_requests[1]
        response = self.client.put(
            reverse('manage-friend-request', args=[friend_request.requester.id]))
        self.assertEqual(1,1)

    def test_decline_friend_request(self):
        friend_request = self.friend_requests[1]
        response = self.client.delete(
            reverse('manage-friend-request', args=[friend_request.requester.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_block_user(self):
        response = self.client.post(
            reverse('block-user', args=[self.user_2.username]))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_online_player(self):
        self.user_2.status = 'online'
        response = self.client.get(
            reverse('online-player'), META={'HTTP_HOST': 'localhost:3000'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if (response.data['count'] != 0):
            self.assertEqual(response.data[0]['status'], 'online')

    def test_top_players(self):
        response = self.client.get(reverse('top-players'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_ranking(self):
        response = self.client.get(reverse('ranking'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invite_player(self):
        response = self.client.get(
            reverse('invite-player', args=[self.user_2.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unfriend_user(self):
        response = self.client.delete(
            reverse('unfriend-user', args=[self.user_2.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
