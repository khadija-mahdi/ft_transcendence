import asyncio
from channels.layers import get_channel_layer
import json
from channels.db import database_sync_to_async
from game.managers.achievements_manager import AchievementsManager
from user.models import User
from game.models import Matchup, Tournament
from game.utils.game_utils import Ball, Paddle
Debugging = True

class Game():
    WIDTH = 800
    HEIGHT = 600
    first_player = None
    second_player = None
    tournament = None

    def __init__(self, room_id):
        self.room_id = room_id
        self.is_running = True
        self.players = []
        self.ball = Ball(Game.WIDTH, Game.HEIGHT)
        self.player_1_paddle = Paddle(
            10,  (Game.HEIGHT / 2) - Paddle.HEIGHT / 2)
        self.player_2_paddle = Paddle(
            Game.WIDTH - 20, (Game.HEIGHT / 2) - Paddle.HEIGHT / 2)
        self.ball.setPaddles(self.player_1_paddle, self.player_2_paddle)
        self.channel_layer = get_channel_layer()
        self.pause = False
        self.waiting_in_ms = 0

    @classmethod
    async def create(cls, room_id):
        self = cls(room_id)
        self.lock = asyncio.Lock()
        try:
            self.matchup = await database_sync_to_async(Matchup.objects.get)(game_uuid=room_id)
            self.first_player = await database_sync_to_async(lambda: self.matchup.first_player)()
            self.second_player = await database_sync_to_async(lambda: self.matchup.second_player)()
            self.tournament = await database_sync_to_async(lambda: self.matchup.tournament)()
            print(
                f'Game created for {self.first_player.username} and {self.second_player.username}')
        except Matchup.DoesNotExist:
            self.matchup = None
        return self

    async def add_player(self, player):
        async with self.lock:
            if len(self.players) == 2 or player in self.players or not self.matchup:
                return False
            if player == self.first_player or player == self.second_player:
                self.players.append(player)
            return True

    async def move_paddle(self, player, y):
        async with self.lock:
            paddle = self.player_1_paddle if player == self.first_player else self.player_2_paddle
            paddle.updatePosition(y=y)

    async def remove_player(self, player):
        async with self.lock:
            if player in self.players:
                try:
                    self.players.remove(player)
                except ValueError:
                    pass
            return len(self.players) == 0

    async def game_loop(self):
        while self.is_running:
            await asyncio.sleep(1/60)
            if not self.matchup:
                return await self.emit(type='game_over', message='matchup not found')
            if len(self.players) != 2 and self.second_player is not None:
                self.waiting_in_ms += 16
                if self.waiting_in_ms >= 20 * 1000:
                    self.matchup.game_over = True
                    self.matchup.Winner = self.first_player
                    await database_sync_to_async(self.matchup.save)()
                    await self.NotifyTournamentConsumer(self.matchup.Winner)
                    return await self.emit(type='game_over', message='player did not not register')
                continue
            if self.pause:
                self.waiting_in_ms += 16
                if self.waiting_in_ms >= 1 * 1000:
                    self.pause = False
                continue
            self.waiting_in_ms = 0
            await self.ball.update(lambda is_left_goal: self.new_point(is_left_goal))
            if self.second_player is None:
                self.player_2_paddle.ai_update(self.ball)
            await self.emit(dict_data={
                'type': 'update',
                'ball': {
                    'x': self.ball.x,
                    'y': self.ball.y
                },
                'leftPaddle': {
                    'x': self.player_1_paddle.x,
                    'y': self.player_1_paddle.y
                },
                'rightPaddle': {
                    'x': self.player_2_paddle.x,
                    'y': self.player_2_paddle.y
                }

            })

    async def emit(self, type=None, message=None, dict_data=None):
        dict_data = {'type': type,
                     'message': message} if dict_data is None else dict_data
        await self.channel_layer.group_send(
            f"game_{self.room_id}",
            {
                'type': 'broadcast',
                'message':  json.dumps(dict_data)
            }
        )

    async def NotifyTournamentConsumer(self, Winner):
        if self.tournament is None:
            return
        await self.channel_layer.group_send(
            f"tournament_{self.tournament.uuid}",
            {
                'type': 'match_result',
                'message':  json.dumps({
                    'match_id': self.matchup.id,
                    'winner_id': Winner.id
                })
            }
        )

    async def new_point(self, is_left_goal):
        self.pause = True
        self.player_1_paddle.updatePosition(
            (Game.HEIGHT / 2) - Paddle.HEIGHT / 2)
        self.player_2_paddle.updatePosition(
            (Game.HEIGHT / 2) - Paddle.HEIGHT / 2)
        if not is_left_goal:
            self.matchup.first_player_score += 1
        else:
            self.matchup.second_player_score += 1
        await database_sync_to_async(self.matchup.save)()
        winner, Loser = self.determine_winner_and_loser()

        if winner:
            self.matchup.Winner = winner
            self.matchup.game_over = True
            await database_sync_to_async(self.matchup.save)()
            await self.NotifyTournamentConsumer(winner)
            await self.emit(dict_data={
                'type': 'game_over',
                'winner': winner.username
            })
            if self.tournament is None:
                await AchievementsManager().handleUserAchievements(user=winner)
            await AchievementsManager().handleLoserUser(user=Loser)
            self.is_running = False

        await self.emit(dict_data={
            'type': 'goal',
            'first_player_score': self.matchup.first_player_score,
            'second_player_score': self.matchup.second_player_score
        })

    def determine_winner_and_loser(self):
        if Debugging:
            return [self.first_player, self.second_player]
        if self.matchup.first_player_score >= 15 and self.matchup.first_player_score - self.matchup.second_player_score >= 2:
            return [self.first_player, self.second_player]
        elif self.matchup.second_player_score >= 15 and self.matchup.second_player_score - self.matchup.first_player_score >= 2:
            return [self.second_player, self.first_player]
        if self.matchup.first_player_score >= 20 and self.matchup.first_player_score > self.matchup.second_player_score:
            return [self.first_player, self.second_player]
        elif self.matchup.second_player_score >= 20 and self.matchup.second_player_score > self.matchup.first_player_score:
            return [self.second_player, self.first_player]
        return [None, None]

    async def cleanup(self):
        self.is_running = False


class GameManager():
    def __init__(self):
        self.games = {}
        self.lock = None

    async def get_lock(self):
        if self.lock is None:
            self.lock = asyncio.Lock()
        return self.lock

    async def get_or_create_game(self, room_id):
        self.lock = await self.get_lock()
        async with self.lock:
            if room_id not in self.games:
                game = await Game.create(room_id)
                self.games[room_id] = game
                asyncio.create_task(game.game_loop())
            return self.games[room_id]

    async def remove_game(self, room_id):
        self.lock = await self.get_lock()
        async with self.lock:
            if room_id in self.games:
                await self.games[room_id].cleanup()
                del self.games[room_id]
