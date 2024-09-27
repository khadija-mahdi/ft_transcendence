from typing import Any, Dict
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from game.managers.game_manager import Game, GameManager
from user.models import User
import logging
from channels.exceptions import DenyConnection

logger = logging.getLogger(__name__)


class InGame(AsyncWebsocketConsumer):

    async def connect(self):
        self.user: User = self.scope['user']
        self.Connected = False
        if not self.user:
            await self.close(reason='User not authenticated', code=400)
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.game_manager: GameManager = self.scope['url_route']['kwargs']['game_manager']
        self.game: Game = await self.game_manager.get_or_create_game(self.room_name)

        if not self.game:
            logger.info(f'An Unauthorized Connect: {self.user.username} '
                        f'Tried To Connect To Game `{self.room_name}` '
                        f'The Game Not Available ')
            raise DenyConnection('The Game Not Available')

        if not self.isUserPartOfThisGame():
            logger.info(f'An Unauthorized User: {self.user.username} '
                        f'Tried To Connect To Game: `{self.room_name}` '
                        f'That Isn\'t Part Of.')
            raise DenyConnection(
                'User That Tried To Connect To Game Isn\'t Part Of.')

        self.room_group_name = f"game_{self.room_name}"
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )
        if not await self.game.add_player(self.user):
            raise DenyConnection(
                'The Room Is Full Or The Users Already Connected On Other Session')
        await self.accept()
        self.Connected = True

    async def disconnect(self, close_code):
        logger.info(f'User: {self.user.username}'
                    f' Disconnected From Game-{self.room_name} Websocket')
        if self.Connected:
            await self.game.remove_player(self.user)
            await self.game_manager.remove_game(self.room_name)
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )

    async def isUserPartOfThisGame(self):
        isFp = self.user.username != self.game.matchup.first_player.username
        isSp = self.game.matchup.second_player != None and \
            self.user.username != self.game.matchup.second_player.username
        logger.info(
            f'this game users {self.game.matchup.first_player} and {self.game.matchup.second_player}')
        return isFp or isSp

    async def receive(self, text_data=None, bytes_data=None):
        try:
            data: Dict[str, Any] = json.loads(text_data)
            message_type = data.get('type')
            if message_type == 'move':
                await self.game.move_paddle(self.user, data.get('action'), data.get('player-order'))
        except Exception as e:
            logger.error(f'Failed to convert data into JSON: {e}')

    async def broadcast(self, event):
        message = event['message']
        if self.get_message_object(message).get('action') == 'close':
            logger.debug('closing socket ...')
            await self.close(reason='Socket closed by broadcast action')
            return
        if isinstance(message, dict):
            message = json.dumps(message)
        await self.send(text_data=message)

    def get_message_object(self, message) -> Dict[str, Any]:
        try:
            if isinstance(message, str):
                message = json.loads(message)
            return message
        except:
            return {}
