from rest_framework_simplejwt.authentication import JWTAuthentication
import requests
from rest_framework import exceptions as rest_exceptions
from .serializers import InputSerializer
from user.serializers import UserSerializer
from rest_framework.response import Response
from django.core.exceptions import ValidationError

from django.conf import settings

from .utils import get_error_message
from user.models import User

from django.shortcuts import redirect
from urllib.parse import urlencode
from .utils import generate_user_tokens


class ApiErrorsMixin:
    """
    Mixin that transforms Django and Python exceptions into rest_framework ones.
    Without the mixin, they return 500 status code which is not desired.
    """
    expected_exceptions = {
        ValueError: rest_exceptions.ValidationError,
        ValidationError: rest_exceptions.ValidationError,
        PermissionError: rest_exceptions.PermissionDenied,
        User.DoesNotExist: rest_exceptions.NotAuthenticated
    }

    def handle_exception(self, exc):
        if isinstance(exc, tuple(self.expected_exceptions.keys())):
            drf_exception_class = self.expected_exceptions[exc.__class__]
            drf_exception = drf_exception_class(get_error_message(exc))

            return super().handle_exception(drf_exception)

        return super().handle_exception(exc)


class OAuth2Authentication:
    """
    Custom OAuth2Authentication class that
    Provides a way to authenticate users using an OAuth2 token.
    """

    access_token_url = None
    client_id = None
    client_secret = None
    redirect_uri = f'{settings.BASE_FRONTEND_URL}/auth'
    user_info_url = None
    serializer_class = None

    def get(self, request):
        if any(attr is None for attr in [self.access_token_url, self.client_id, self.client_secret, self.user_info_url, self.serializer_class]):
            return Response(status=400)
        serializer = InputSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        code = validated_data.get('code')
        error = validated_data.get('error')
        login_url = f'{settings.BASE_FRONTEND_URL}'

        if error or not code:
            params = urlencode({'error': error})
            return redirect(f'{login_url}?{params}')

        try:
            print('getting access token\n\n')
            access_token = self.OAuth2_get_access_token(code)
            print(f'access token => {access_token}\n\n')
            print('getting user data\n\n')
            user_data = self.OAuth2_get_user_data(access_token)
        except ValidationError as e:
            print(f'error => {e}')
            return Response(status=400, data={'error': str(e)})

        try:
            user = User.objects.get(email=user_data['email'])
            return Response(self.get_response_data(user, request))
        except User.DoesNotExist:
            if (self.serializer_class is None):
                raise ValidationError('serializer_class is not defined')
            serializer = self.serializer_class(data=user_data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            print(f'serialize validated data => {validated_data} \n\n')
            return Response(self.get_response_data(user, request))

    def get_response_data(self, user, request) -> dict:
        access_token, refresh_token = generate_user_tokens(user)
        return {
            "user": UserSerializer(user, context={'request': request}).data,
            'access': str(access_token),
            'refresh': str(refresh_token),
        }

    def OAuth2_get_access_token(self, code) -> str:
        
        data = {
            'code': code,
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'redirect_uri': self.redirect_uri,
            'grant_type': 'authorization_code',
        }
        print(f'data => {data}\n\n')
        response = requests.post(self.access_token_url, data=data)
        if not response.ok:
            raise ValidationError(
                f'Failed to obtain access token {response.json()}')
        return response.json().get('access_token')

    def OAuth2_get_user_data(self, access_token) -> dict:
        response = requests.get(self.user_info_url,
                                headers={
                                    'Authorization': f'Bearer {access_token}'},
                                params={'access_token': access_token})
        if not response.ok:
            raise ValidationError(
                f'Failed to obtain user data {response.json()}')
        return response.json()
