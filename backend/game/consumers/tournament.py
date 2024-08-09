
from channels.generic.websocket import AsyncWebsocketConsumer
from game.managers.tournament_manager import TournamentRoutine, TournamentManager
import json


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
            print('Tournament not found')
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
        if lastPlayer:
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
        print(f'JsonData is \n{JsonData}')
        return

    async def match_result(self, event):
        await self.tournament_routine.check_round_completion()

    async def broadcast(self, event):
        message = event['message']
        print(message)
        await self.send(text_data=message)
        try:
            if isinstance(message, str):
                message = json.loads(message)
            status = message['status']
            if status == 'over':
                print(f'closing connection for {self.user}')
                await self.close()
        except json.JSONDecodeError:
            print('Failed to decode JSON message:', message)
        except KeyError:
            print('Key "status" not found in message:', message)
        except Exception as e:
            print(f'Unexpected error: {e}')
