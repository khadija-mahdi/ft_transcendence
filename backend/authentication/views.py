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
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from user.models import User
import logging

logger = logging.getLogger(__name__)


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
            logger.error(f'error => {e.detail}')
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
            logger.error(f'error => {e}')
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
            logger.error(f'error => {e}')
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': str(e)})
        return Response(status=status.HTTP_201_CREATED)


class AuthView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    class AuthSerializer(serializers.Serializer):
        email = serializers.EmailField()
        password = serializers.CharField()
    serializer_class = AuthSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = self.verify_email(serializer)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        if user.enabled_2fa:
            self.send_mail(serializer)
            return Response({'detail': '2FA enabled. Check your email.'})
        else:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({
                'access': access_token,
                'refresh': refresh_token
            })

    def verify_email(self, serializer) -> User:
        validated_data = serializer.validated_data
        email = validated_data.get('email')
        password = validated_data.get('password')

        try:
            user: User = User.objects.get(email=email)
        except User.DoesNotExist:
            raise Exception('Invalid email or password.')

        if not user.check_password(password):
            raise Exception('Invalid email or password.')
        return user

    def send_mail(self, serializer):
        validated_data = serializer.validated_data
        email = validated_data.get('email')
        code = random.randint(1000, 9999)
        cache.set(email, code, timeout=5*60)

        try:
            status = send_mail(
                'Two-Factor Authentication (2FA) Code',
                f'Your verification code is {code} ',
                from_email='mail@api.reducte.tech',
                recipient_list=[email],
                fail_silently=False
            )
            return status
        except Exception as e:
            logger.error(f'Error sending email: {e}')
            raise


class Verify2FASerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()


class Verify2FAView(generics.CreateAPIView):
    class VerifySerializer(serializers.Serializer):
        email = serializers.EmailField()
        code = serializers.IntegerField()
    serializer_class = VerifySerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = self.verify_email(serializer)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({
                'access': access_token,
                'refresh': refresh_token
            })
        except Exception as e:
            logger.error(f'error => {e}')
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': str(e)})

    def verify_email(self, serializer):
        validated_data = serializer.validated_data
        email = validated_data.get('email')
        code = validated_data.get('code')
        user = User.objects.get(email=email)
        if cache.get(email) != code:
            raise serializers.ValidationError('Invalid code')
        return user
