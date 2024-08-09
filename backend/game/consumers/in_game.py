from channels.generic.websocket import AsyncWebsocketConsumer
import json


class InGame(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope['user']
        if not self.user:
            await self.close(reason='User not authenticated', code=400)
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.game_manager = self.scope['url_route']['kwargs']['game_manager']
        self.game = await self.game_manager.get_or_create_game(self.room_name)
        await self.game.add_player(self.user)
        self.room_group_name = f"game_{self.room_name}"
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print('User Disconnected')
        if await self.game.remove_player(self.user):
            print(
                f'No player left in the game. Removing game. {self.room_name}')
            await self.game_manager.remove_game(self.room_name)
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            if message_type == 'move':
                await self.game.move_paddle(self.user, data['y'])
        except Exception as e:
            print(f'Failed to convert data into JSON: {e}')

    async def broadcast(self, event):
        await self.send(text_data=event['message'])
