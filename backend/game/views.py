
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveDestroyAPIView, DestroyAPIView, RetrieveAPIView, CreateAPIView
from django.db.models import Q
from .tasks import start_scheduler
from .serializers import (
    GameSerializer,
    MatchUpSerializer,
    TournamentSerializer,
    TournamentDetailsSerializer,
    TournamentsRegisteredPlayersSerializer,
    MatchInfoSerializer)
from rest_framework import serializers
from .models import Game, Tournament, TournamentsRegisteredPlayers, Brackets, Matchup, GamePlayer
from user.models import User
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from .services import notify_tournament_users
from rest_framework.response import Response
from django.http import Http404
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


class ListGame(ListAPIView):
    serializer_class = GameSerializer
    queryset = Game.objects.all()


def FillOutRegisteredPlayers(tournament: Tournament, names=[]):
    for username in names:
        try:
            user: User = User.objects.get(username=username)
            TournamentsRegisteredPlayers.objects.create(
                user=user, tournament=tournament, alias=f'{user.username}-alias')
        except User.DoesNotExist:
            logger.error(f'This User Doesn\'t Not Exists {username}')


def MockTest(tournament):
    FillOutRegisteredPlayers(tournament=tournament, names=[
                             'ayoub', 'aitouna', 'khadija', 'mehdi'])
    notify_tournament_users(tournament.id)


class CreateOfflineGame(CreateAPIView):
    serializer_class = MatchUpSerializer
    queryset = Matchup.objects.all()

    def perform_create(self, serializer: MatchUpSerializer):
        user = self.request.user
        fPlayer_alias = self.request.data.get('first_player_alias')
        sPlayer_alias = self.request.data.get('second_player_alias')
        fPlayer = GamePlayer.objects.create(
            user=user, alias=fPlayer_alias)
        sPlayer = GamePlayer.objects.create(
            user=user, alias=sPlayer_alias)
        serializer.save(game_type='offline',
                        first_player=fPlayer,
                        second_player=sPlayer)


class listTournaments(ListCreateAPIView):
    serializer_class = TournamentSerializer
    queryset = Tournament.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        private_list = Tournament.objects.all().filter(owner=user).filter(
            is_public=False).order_by('created_at').reverse()
        public_list = Tournament.objects.all().filter(
            is_public=True).order_by('created_at').reverse()
        combined_list = private_list | public_list
        return combined_list.order_by('is_public').reverse()

    def perform_create(self, serializer):
        if not serializer.is_valid():
            raise serializers.ValidationError("Invalid data")

        start_date_str = self.request.data.get('start_date')
        start_date = datetime.strptime(start_date_str, '%Y-%m-%dT%H:%M')
        if start_date < datetime.now():
            raise serializers.ValidationError(
                "Start date must be in the future")

        tournament: Tournament = serializer.save()
        # MockTest(tournament)
        if tournament.is_public:
            start_scheduler(tournament.id, start_date)


class listAnnouncements(ListCreateAPIView):
    serializer_class = TournamentSerializer
    queryset = Tournament.objects.all().filter(
        is_monetized=True, finished=False,
        ongoing=False, is_public=True)\
        .order_by('created_at').reverse()[:3]


class RetrieveTournament(RetrieveDestroyAPIView):
    serializer_class = TournamentDetailsSerializer
    queryset = Tournament.objects.all()

    def get_queryset(self):
        queryset = Tournament.objects.all()
        return queryset.filter(owner=self.request.user) | queryset.filter(is_public=True)


class RegisterToTournament(CreateAPIView):
    serializer_class = TournamentsRegisteredPlayersSerializer
    queryset = TournamentsRegisteredPlayers.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        tournament: Tournament = get_object_or_404(
            Tournament, pk=self.kwargs.get('pk'))
        if tournament.finished or tournament.ongoing:
            return serializers.ValidationError("Tournament is already started or finished")
        if tournament.is_public:
            bracket = Brackets.objects.filter(
                tournament=tournament
            ).filter(player=self.request.user).filter(round_number=1)

            if bracket.exists():
                bracket.delete()
                TournamentsRegisteredPlayers.objects.filter(
                    user=self.request.user, tournament=tournament).delete()
                return

            OtherTournaments = TournamentsRegisteredPlayers.objects\
                .filter(user=self.request.user)\
                .exclude(created_at__gte=datetime.now() - timedelta(hours=1))\
                .exclude(created_at__lte=datetime.now() + timedelta(hours=1))

            if OtherTournaments.exists():
                raise serializers\
                    .ValidationError("You are already registered to another tournament within the last hour.")

        alias = serializer.validated_data.get('alias')
        Brackets(tournament=tournament,
                 player=self.request.user, alias=alias).save()
        serializer.save(user=self.request.user, tournament=tournament)

        if not tournament.is_public:
            count = TournamentsRegisteredPlayers.objects\
                .filter(tournament=tournament).count()
            if count == tournament.max_players:
                notify_tournament_users(tournament.pk)


class UnRegisterToTournament(DestroyAPIView):
    serializer_class = TournamentsRegisteredPlayersSerializer
    queryset = TournamentsRegisteredPlayers.objects.all()
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        try:
            tournament = get_object_or_404(
                Tournament, pk=self.kwargs.get('pk'))
            if tournament.finished or tournament.ongoing:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            TournamentsRegisteredPlayers.objects.filter(
                user=self.request.user, tournament=tournament).delete()
            Brackets.objects.filter(tournament=tournament,
                                    player=self.request.user).delete()
        except Http404:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)


class MatchHistory(ListAPIView):
    serializer_class = MatchUpSerializer
    queryset = Matchup.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        pk = self.kwargs['pk']
        try:
            user = User.objects.get(id=pk)
            return Matchup.objects.filter(Q(first_player__user=user) | Q(second_player__user=user))\
                .filter(game_type='online')\
                .filter(tournament__isnull=True)
        except User.DoesNotExist:
            return []


class MatchInfo(RetrieveAPIView):
    serializer_class = MatchInfoSerializer
    queryset = Matchup.objects.all()
    lookup_field = 'game_uuid'
    permission_classes = [IsAuthenticated]


class TournamentHistory(ListAPIView):
    serializer_class = TournamentsRegisteredPlayersSerializer
    queryset = TournamentsRegisteredPlayers.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TournamentsRegisteredPlayers.objects.filter(user=self.request.user, tournament__is_public=True).distinct()


class OngoingTournaments(ListAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tournament.objects\
            .filter(registered_users=self.request.user)\
            .filter(ongoing=True).distinct()


class JoinGameLooby():
    pass
