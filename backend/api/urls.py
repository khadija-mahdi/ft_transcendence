from django.urls import path, include
from .views import HomeView, NotificationAction, NotificationView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('auth/', include('authentication.urls')),
    path('users/', include('user.urls')),
    path('game/', include('game.urls')),
    path('chat/', include('chat.urls')),
    path('notifications/',view=NotificationView.as_view(), name='notifications'),
    path('notifications/<int:pk>/', view=NotificationAction.as_view(), name='notification-action'),
    
]