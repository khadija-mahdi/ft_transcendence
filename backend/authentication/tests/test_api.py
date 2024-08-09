from .test_setup import BaseTestCase
from django.urls import reverse
from django.core.cache import cache
from rest_framework import status


class TestAuthenticationAPI(BaseTestCase):
    def test_register_email(self):
        res = self.client.post(reverse('register-email'), data={
            "email": self.email
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_verify_email(self):
        res = self.client.post(reverse('verify-email'), data={
            "email": self.email,
            "code": cache.get(self.email)
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_register_user(self):
        res = self.client.post(reverse('register-user'), data={
            "username": self.username,
            "password": self.password,
            "email": self.email
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_login(self):
        response = self.client.post(reverse('token_obtain_pair'), data={
            'email': self.user.email,
            'password': self.password
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_refresh_token(self):
        response = self.client.post(reverse('token_obtain_pair'), data={
            'email': self.user.email,
            'password': self.password
        })
        refresh = response.data['refresh']
        response = self.client.post(reverse('token_refresh'), data={
            'refresh': refresh
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertNotEqual(response.data['access'], refresh)
