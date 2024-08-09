from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('google/', view=views.MixinsGoogleLoginApi.as_view(), name='google-login'),
    path('intra/', view=views.IntraLoginApi.as_view(), name='inta-login'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register-email/', view=views.RegisterEmailApi.as_view(), name='register-email'),
    path('verify-email/', view=views.VerifyEmailApi.as_view(), name='verify-email'),
    path('register-user/', view=views.RegisterUserApi.as_view(), name='register-user'),
]
