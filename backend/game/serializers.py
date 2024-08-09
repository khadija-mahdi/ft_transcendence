import os
from django.conf import settings
from rest_framework import serializers
from .models import Game, Tournament, TournamentsRegisteredPlayers, Brackets, stream, Matchup
from user.serializers import UserSerializer
from django.core.files.storage import default_storage
from django.contrib.auth.models import AnonymousUser


class BaseTournamentSerializer():
    def get_icon(self, obj):
        if obj.icon is None:
            return None
        request = self.context.get("request")
        host = request.get_host()
        protocol = 'https' if request.is_secure() else 'http'
        return f'{protocol}://{host}{obj.icon}'


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class BracketsSerializer(serializers.ModelSerializer):
    player = UserSerializer()

    class Meta:
        model = Brackets
        fields = ['player', 'round_number']


class StreamsSerializer(serializers.ModelSerializer):
    player1 = UserSerializer()
    player2 = UserSerializer()

    class Meta:
        model = stream
        fields = ['stream_url', 'player1', 'player2']


class TournamentSerializer(serializers.ModelSerializer, BaseTournamentSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='tournament-detail')
    register = serializers.HyperlinkedIdentityField(
        view_name='tournament-register')
    icon = serializers.SerializerMethodField(read_only=True)
    icon_file = serializers.FileField(write_only=True)

    class Meta:
        model = Tournament
        fields = ['id', 'icon', 'icon_file', 'name', 'description', 'start_date',
                  'max_players', 'is_public', 'is_monetized', 'url', 'register']

    def create(self, validated_data):
        user = self.context.get('request').user
        icon = validated_data['icon_file']
        save_path = os.path.join(
            settings.MEDIA_ROOT, 'public/profile-images', icon.name)
        path = default_storage.save(save_path, icon)
        validated_data['icon'] = f'/media/{path}'
        validated_data['owner'] = user
        del validated_data['icon_file']
        return super().create(validated_data)


class TournamentDetailsSerializer(serializers.ModelSerializer, BaseTournamentSerializer):
    registered_users = UserSerializer(many=True)
    tournament_bracket = BracketsSerializer(many=True)
    streams = StreamsSerializer(many=True)
    icon = serializers.SerializerMethodField()
    games_states = serializers.SerializerMethodField()
    match_ups = serializers.SerializerMethodField()
    is_my_tournament = serializers.SerializerMethodField()
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ['id', 'uuid', 'icon', 'name', 'description', 'max_players', 'is_public', 'is_monetized',
                  'is_registered', 'is_my_tournament', 'tournament_bracket', 'start_date', 'registered_users',
                  'streams', 'games_states', 'match_ups', 'created_at', 'updated_at']

    def get_games_states(self, obj):
        games_states = Matchup.objects.all().filter(
            tournament=obj).filter(game_over=True)
        return MatchUpSerializer(games_states, many=True, context=self.context).data

    def get_match_ups(self, obj):
        match_up = Matchup.objects.all().filter(tournament=obj).filter(game_over=False)
        return MatchUpSerializer(match_up, many=True, context=self.context).data

    def get_is_my_tournament(self, obj):
        request = self.context.get('request')
        if request is None:
            return False
        return request.user == obj.owner

    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request is None:
            return False
        user = request.user
        if user is None or user == AnonymousUser():
            return False
        return user in obj.registered_users.all()


class MatchUpSerializer(serializers.ModelSerializer):
    first_player = UserSerializer()
    second_player = UserSerializer()
    Winner = UserSerializer()

    class Meta:
        model = Matchup
        fields = ['id', 'first_player', 'second_player', 'Winner',
                  'first_player_score', 'second_player_score',
                  'game_over', 'created_at', 'updated_at']


class TournamentsRegisteredPlayersSerializer(serializers.ModelSerializer):
    tournament = TournamentSerializer()

    class Meta:
        model = TournamentsRegisteredPlayers
        fields = '__all__'
