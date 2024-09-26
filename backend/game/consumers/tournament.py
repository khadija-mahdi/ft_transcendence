
from channels.generic.websocket import AsyncWebsocketConsumer
from game.managers.tournament_manager import TournamentRoutine, TournamentManager
import json
import logging

logger = logging.getLogger(__name__)


class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user is None:
            return await self.close()
        await self.accept()
        self.tournament_id = self.scope['url_route']['kwargs']['tournament_id']
        self.tournament_group_name = f'tournament_{self.tournament_id}'
        self.tournament_manager: TournamentManager = self.scope[
            'url_route']['kwargs']['tournament_manager']
        self.tournament_routine: TournamentRoutine = await self.tournament_manager.get_or_create_tournament(self.tournament_id)

        if self.tournament_routine is None:
            return await self.close(4004, 'Tournament not found')
        await self.channel_layer.group_add(
            self.tournament_group_name,
            self.channel_name
        )
        await self.tournament_routine.add_player(self.user)

    async def disconnect(self, close_code):
        if self.tournament_routine is None:
            return
        lastPlayer = await self.tournament_routine.remove_player(self.user)
        if lastPlayer and self.tournament_routine.tournament.finished:
            await self.tournament_manager.remove_tournament(self.tournament_id)
        await self.channel_layer.group_discard(
            self.tournament_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            JsonData = json.loads(text_data)
        except json.JSONDecodeError:
            return await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))
        return

    async def match_result(self, event):
        await self.tournament_routine.check_round_completion()

    async def broadcast(self, event):
        message = event['message']
        await self.send(text_data=message)
        try:
            if isinstance(message, str):
                message = json.loads(message)
            if 'status' in message and message['status'] == 'over':
                await self.close()
        except json.JSONDecodeError:
            logger.error('Failed to decode JSON message:', message)
        except Exception as e:
            logger.error(f'Unexpected error: {e}')
