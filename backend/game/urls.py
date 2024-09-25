
from django.urls import path
from . import views
urlpatterns = [
    path('game-information/', view=views.ListGame.as_view(), name='home'),
    path('create-offline-game', view=views.CreateOfflineGame.as_view(), name='create-offline-game'),
    path('match-history/<int:pk>/',
         view=views.MatchHistory.as_view(), name='match-history'),
    path('match-info/<str:game_uuid>/',
         view=views.MatchInfo.as_view(), name='game-info'),
    path('Tournament/', view=views.listTournaments.as_view(), name='tournament'),
    path('Tournament-announcements/', view=views.listAnnouncements.as_view(),
         name='Tournament-announcements'),
    path('Tournament/detail/<int:pk>/',
         view=views.RetrieveTournament.as_view(), name='tournament-detail'),
    path('Tournament/register/<int:pk>/',
         view=views.RegisterToTournament.as_view(), name='tournament-register'),
     path('Tournament/unregister/<int:pk>/',
         view=views.UnRegisterToTournament.as_view(), name='tournament-unregister'),
    path('tournament-history/<int:pk>/',
         view=views.TournamentHistory.as_view(), name='tournament-history'),
    path('ongoing-tournaments/',
         view=views.OngoingTournaments.as_view(), name='ongoing-tournaments'),
]
