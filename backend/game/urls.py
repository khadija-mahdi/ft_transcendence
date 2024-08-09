
from django.urls import path
from . import views
urlpatterns = [
    path('game-information/', view=views.ListGame.as_view(), name='home'),
    path('match-history/<int:pk>/',
         view=views.MatchHistory.as_view(), name='match-history'),
    path('Tournament/', view=views.listTournaments.as_view(), name='tournament'),
    path('Tournament-announcements/', view=views.listTournaments.as_view(), name='Tournament-announcements'),
    path('Tournament/detail/<int:pk>/',
         view=views.RetrieveTournament.as_view(), name='tournament-detail'),
    path('Tournament/register/<int:pk>/',
         view=views.RegisterToTournament.as_view(), name='tournament-register'),
    path('tournament-history/<int:pk>/',
         view=views.TournamentHistory.as_view(), name='tournament-history'),

]
