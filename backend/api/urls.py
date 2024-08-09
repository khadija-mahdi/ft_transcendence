from django.urls import path, include
from .views import HomeView, NotificationAction, NotificationView

urlpatterns = [
    path('', view=HomeView.as_view(), name='home'),
    path('auth/', include('authentication.urls')),
    path('users/', include('user.urls')),
    path('game/', include('game.urls')),
    path('chat/', include('chat.urls')),
    path('notifications/',view=NotificationView.as_view(), name='notifications'),
    path('notifications/<int:pk>/', view=NotificationAction.as_view(), name='notification-action'),
    
]