
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import uuid
from channels.db import database_sync_to_async
from game.models import Matchup, GamePlayer
from game.managers.match_maker import InvitesManager
from user.models import User
from channels.exceptions import DenyConnection
import logging

logger = logging.getLogger(__name__)


class GameInvite(AsyncWebsocketConsumer):
    async def connect(self):
        self.user: User = self.scope['user']
        if not self.user:
            self.close()
        self.InvitesManager: InvitesManager = self.scope['url_route']['kwargs']['InvitesManager']
        self.room_group_name = self.get_group_name(self.user.id)
        self.invite_id = self.scope['url_route']['kwargs']['invite_id']
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.matchmaking()

    async def matchmaking(self):
        match_user = await self.InvitesManager.get_match_users(self.invite_id)
        if match_user is None:
            if not await self.InvitesManager.addPlayer(self.invite_id, self.user):
                raise DenyConnection('Same User is waiting')
            return
        logger.info(f'''The invited User has accepted {
            self.user} Playing against {match_user}''')
        
        game_started_obj = await self.create_game(match_user)
        await self.emit(self.user.id, game_started_obj)
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

    async def create_game(self, matched_user: User):
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
        return f'game_invite_group_{id}'

    async def disconnect(self, close_code):
        try:
            await self.InvitesManager.remove_user(self.invite_id, self.user)
        except ValueError as e:
            logger.error(e)
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )
