from django.conf import settings
from rest_framework.views import APIView
from rest_framework import serializers
from .serializers import IntraUserSerializer, GoogleUserSerializer
from user.serializers import UserSerializer
from rest_framework.response import Response
from user.models import User
from .mixins import ApiErrorsMixin, OAuth2Authentication
from django.core.cache import cache
from django.core.mail import send_mail
from rest_framework import generics, permissions, status
import random
from django.db import IntegrityError
from django_otp import devices_for_user
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework import views, permissions


class AuthApi(generics.GenericAPIView):
    class AuthSerializer(serializers.Serializer):
        email = serializers.EmailField()
        password = serializers.IntegerField()
    serializer_class = AuthSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(status=status.HTTP_200_OK, data={'detail': 'success'})


class MixinsGoogleLoginApi(ApiErrorsMixin, APIView, OAuth2Authentication):
    access_token_url = 'https://oauth2.googleapis.com/token'
    client_id = settings.GOOGLE_OAUTH2_CLIENT_ID
    client_secret = settings.GOOGLE_OAUTH2_CLIENT_SECRET
    user_info_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
    serializer_class = GoogleUserSerializer


class IntraLoginApi(ApiErrorsMixin, APIView, OAuth2Authentication):
    access_token_url = 'https://api.intra.42.fr/oauth/token'
    client_id = settings.INTRA_OAUTH2_CLIENT_ID
    client_secret = settings.INTRA_OAUTH2_CLIENT_SECRET
    user_info_url = 'https://api.intra.42.fr/v2/me'
    serializer_class = IntraUserSerializer


class RegisterEmailApi(generics.CreateAPIView):
    class EmailSerializer(serializers.Serializer):
        email = serializers.EmailField()

    serializer_class = EmailSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            if User.objects.filter(email=serializer.validated_data.get('email')).exists():
                raise serializers.ValidationError(
                    'User with this email already exists')
            self.send_mail(serializer)
        except serializers.ValidationError as e:
            errorMessage = e.detail[0] if isinstance(
                e.detail, list) else e.detail
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': errorMessage})
        except Exception as e:
            print(f'error => {e.detail}')
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': str(e.detail)})
        return Response(status=status.HTTP_200_OK)

    def send_mail(self, serializer):
        validated_data = serializer.validated_data
        email = validated_data.get('email')
        code = random.randint(1000, 9999)
        cache.set(email, code, timeout=5*60)
        status = send_mail(
            'Verification code',
            f'Your verification code is {code}',
            from_email='mail@api.reducte.tech',
            recipient_list=[email],
            fail_silently=False,
        )


class VerifyEmailApi(generics.CreateAPIView):
    class VerifySerializer(serializers.Serializer):
        email = serializers.EmailField()
        code = serializers.IntegerField()
    serializer_class = VerifySerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.verify_email(serializer)
        except Exception as e:
            print(f'error => {e}')
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': str(e)})
        return Response(status=status.HTTP_200_OK)

    def verify_email(self, serializer):
        validated_data = serializer.validated_data
        email = validated_data.get('email')
        code = validated_data.get('code')
        if cache.get(email) != code:
            raise serializers.ValidationError('Invalid code')


class RegisterUserApi(generics.CreateAPIView):
    class RegisterSerializer(serializers.Serializer):
        username = serializers.CharField()
        password = serializers.CharField()
        email = serializers.EmailField()

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            User.objects.create_user(**serializer.validated_data)
        except IntegrityError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'User with this username already exists'})
        except Exception as e:
            print(f'error => {e}')
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': str(e)})
        return Response(status=status.HTTP_201_CREATED)


def get_user_totp_device(self, user, confirmed=None):
    devices = devices_for_user(user, confirmed=confirmed)
    for device in devices:
        if isinstance(device, TOTPDevice):
            return device
class TOTPCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        user = request.user
        device = get_user_totp_device(self, user)
        if not device:
            device = user.totpdevice_set.create(confirmed=False)
        url = device.config_url
        return Response(url, status=status.HTTP_201_CREATED)
class TOTPVerifyView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, token, format=None):
        user = request.user
        device = get_user_totp_device(self, user)
        if not device == None and device.verify_token(token):
            if not device.confirmed:
                device.confirmed = True
                device.save()
            return Response(True, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)