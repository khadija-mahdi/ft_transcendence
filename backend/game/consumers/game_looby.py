
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import uuid
from channels.db import database_sync_to_async
from game.models import Matchup, GamePlayer
from urllib.parse import parse_qs
import logging

logger = logging.getLogger(__name__)


class GameLobby(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user:
            self.close()
        self.match_maker = self.scope['url_route']['kwargs']['match_maker']
        self.room_group_name = self.get_group_name(self.user.id)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        query_params = parse_qs(self.scope['query_string'].decode('utf-8'))
        self.game_mode = query_params.get('game_mode', [None])[0]

        await self.accept()
        await self.matchmaking()

    async def matchmaking(self):
        match_user = None
        if self.game_mode == 'multiplayer' or self.game_mode is None:
            match_user = await self.match_maker.get_match_users(self.user)
        if match_user or self.game_mode == 'singleplayer':
            game_started_obj = await self.create_game(match_user)
            await self.emit(self.user.id, game_started_obj)
            if match_user:
                game_started_obj['message']['player'] = self.user.username
                await self.emit(match_user.id, game_started_obj)

    async def emit(self, user_id, game_started_obj):
        await self.channel_layer.group_send(
            self.get_group_name(user_id), game_started_obj
        )

    async def receive(self, text_data=None, bytes_data=None):
        pass

    async def broadcast(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    async def create_game(self, matched_user):
        game_uuid = str(uuid.uuid4())
        game_player = await database_sync_to_async(GamePlayer.objects.create)(user=self.user)
        matched_game_player = await database_sync_to_async(GamePlayer.objects.create)(user=matched_user)
        await database_sync_to_async(Matchup.objects.create)(
            game_uuid=game_uuid,
            first_player=game_player,
            second_player=matched_game_player)

        return {
            "type": 'broadcast',
            'message': {
                'type': 'game_started',
                'game_uuid': game_uuid,
                'first_player': self.user.username,
                'second_player': matched_user.username if matched_user else None
            }
        }

    def get_group_name(self, id):
        return f'game_lobby_group_{id}'

    async def disconnect(self, close_code):
        try:
            await self.match_maker.remove_user(self.user)
        except ValueError as e:
            logger.error(e)
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )
