
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveDestroyAPIView, CreateAPIView

from .tasks import start_scheduler
from .serializers import (
    GameSerializer,
    MatchUpSerializer,
    TournamentSerializer,
    TournamentDetailsSerializer,
    TournamentsRegisteredPlayersSerializer)
from rest_framework import serializers
from .models import Game, Tournament, TournamentsRegisteredPlayers, Brackets, Matchup
from user.models import User
from rest_framework.permissions import IsAuthenticated
import datetime


class ListGame(ListAPIView):
    serializer_class = GameSerializer
    queryset = Game.objects.all()


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

    # def perform_create(self, serializer):
        # start_date_str = self.request.data.get('start_date')
        # start_date = datetime.strptime(start_date_str, '%Y-%m-%dT%H:%M:%S')  # Adjust the format as needed
        # if start_date < datetime.now():
        #     raise serializers.ValidationError(
        #         "Start date must be in the future")
        # tournament_id = super().perform_create(serializer).data.get('id')
        # start_scheduler(tournament_id, start_date)


class listAnnouncements(ListCreateAPIView):
    serializer_class = TournamentSerializer
    queryset = Tournament.objects.all().filter(
        is_monetized=True).order_by('created_at').reverse()[:3]


class RetrieveTournament(RetrieveDestroyAPIView):
    serializer_class = TournamentDetailsSerializer
    queryset = Tournament.objects.all()


class RegisterToTournament(CreateAPIView):
    "register to a tournament"
    "if the user is already registered, it will unregister the user from the tournament"
    "if the user is registered to any other tournament within the a margin of 1 hour,"
    "instruction will be given to unregister from the other tournament first"

    class RegisterToTournamentSerializer(serializers.Serializer):
        pass

    serializer_class = RegisterToTournamentSerializer
    queryset = TournamentsRegisteredPlayers.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        tournament = get_object_or_404(Tournament, pk=self.kwargs.get('pk'))
        if tournament.finished:
            return serializers.ValidationError("Tournament is already finished")
        bracket = Brackets.objects.filter(
            tournament=tournament
        ).filter(player=self.request.user).filter(round_number=1)

        if bracket.exists():
            bracket.delete()
            TournamentsRegisteredPlayers.objects.filter(
                user=self.request.user, tournament=tournament).delete()
            return

        OtherTournaments = TournamentsRegisteredPlayers.objects.filter(
            user=self.request.user)\
            .exclude(created_at__gte=datetime.datetime.now() - datetime.timedelta(hours=1))\
            .exclude(created_at__lte=datetime.datetime.now() + datetime.timedelta(hours=1))
        if OtherTournaments.exists():
            raise serializers.ValidationError(
                "You are already registered to another tournament within the last hour.\
                    Please unregister from the other tournament first.")
        Brackets(tournament=tournament, player=self.request.user).save()
        TournamentsRegisteredPlayers.objects.create(
            user=self.request.user, tournament=tournament)


class MatchHistory(ListAPIView):
    serializer_class = MatchUpSerializer
    queryset = Matchup.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        pk = self.kwargs['pk']
        try:
            user = User.objects.get(pk=pk)
            return Matchup.objects.filter(first_player=user, second_player=user)
        except User.DoesNotExist:
            return []


class TournamentHistory(ListAPIView):
    serializer_class = TournamentsRegisteredPlayersSerializer
    queryset = TournamentsRegisteredPlayers.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TournamentsRegisteredPlayers.objects.filter(user=self.request.user)


class JoinGameLooby():
    pass
