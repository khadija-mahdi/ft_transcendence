import asyncio
from channels.layers import get_channel_layer
import json
from channels.db import database_sync_to_async
from game.managers.achievements_manager import AchievementsManager
from user.models import User
from game.models import Matchup, Tournament
from game.utils.game_utils import Ball, Paddle, Config
from typing import Dict
import logging

logger = logging.getLogger(__name__)


class Game():
    first_player = None
    second_player = None
    tournament = None

    def __init__(self, room_id):
        self.room_id = room_id
        self.is_running = True
        self.players = []
        self.ball = Ball()
        halfHeight = (Config.tableDepth / 2)
        halfPaddle = Config.paddleDepth / 2

        self.player_1_paddle = Paddle(5,  halfHeight - halfPaddle)
        self.player_2_paddle = Paddle(
            Config.tableWidth - 10, halfHeight - halfPaddle)

        self.ball.setPaddles(self.player_1_paddle, self.player_2_paddle)
        self.channel_layer = get_channel_layer()
        self.pause = False
        self.waiting_in_ms = 0
        self.matchup: Matchup = None

    @classmethod
    async def create(cls, room_id):
        self = cls(room_id)
        self.lock = asyncio.Lock()
        try:
            self.matchup = await database_sync_to_async(Matchup.objects.get)(game_uuid=room_id)
            self.first_player = await database_sync_to_async(lambda: self.matchup.first_player)()
            self.second_player = await database_sync_to_async(lambda: self.matchup.second_player)()
            self.tournament = await database_sync_to_async(lambda: self.matchup.tournament)()

            isFinished = await database_sync_to_async(lambda: self.matchup.game_over)()
            if isFinished:
                return None

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

    async def move_paddle(self, player, action):
        async with self.lock:
            paddle = self.player_1_paddle if player == self.first_player else self.player_2_paddle
            paddle.movePaddle(action)

    async def remove_player(self, player):
        async with self.lock:
            if player in self.players:
                try:
                    self.matchup.game_over = True
                    if len(self.players) > 1:
                        Loser = player
                        self.players.remove(player)
                        winner = self.players[0]
                        await self.handle_winner(winner=winner, Loser=Loser)
                    await database_sync_to_async(self.matchup.save)()
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
                self.waiting_in_ms += 16.6
                if self.waiting_in_ms >= 3 * 1000:
                    self.pause = False
                    self.reset_paddles()
                continue
            self.waiting_in_ms = 0
            await self.ball.update(lambda is_left_goal: self.new_point(is_left_goal))
            if self.second_player is None:
                self.player_2_paddle.ai_update(self.ball)

            await self.emit(dict_data={
                'type': 'update',
                'ball': {
                    'x': self.ball.x,
                    'y': self.ball.y,
                    'z': -1
                },
                'leftPaddle': {
                    'x': self.player_1_paddle.getX(),
                    'y': self.player_1_paddle.getY(),
                    'z': -1
                },
                'rightPaddle': {
                    'x': self.player_2_paddle.getX(),
                    'y': self.player_2_paddle.getY(),
                    'z': -1
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
        logger.debug(f'''Notify Tournament {
            self.tournament} called about the winner''')
        if self.tournament is None:
            return
        logger.debug(f'the Winner is {Winner}')
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

    def reset_paddles(self):
        self.player_1_paddle.updatePosition(
            (Config.tableDepth / 2) - Config.paddleDepth / 2)
        self.player_2_paddle.updatePosition(
            (Config.tableDepth / 2) - Config.paddleDepth / 2)

    async def new_point(self, is_left_goal):
        self.pause = True
        self.reset_paddles()

        if not is_left_goal:
            self.matchup.first_player_score += 1
        else:
            self.matchup.second_player_score += 1

        await database_sync_to_async(self.matchup.save)()
        winner, Loser = self.determine_winner_and_loser()
        await self.handle_winner(winner, Loser)

    async def handle_winner(self, winner, Loser):
        if winner:
            winner = None if type(winner) == str else winner
            Loser = None if type(Loser) == str else Loser
            self.matchup.Winner = winner
            self.matchup.game_over = True
            await database_sync_to_async(self.matchup.save)()
            await self.NotifyTournamentConsumer(winner)
            await self.emit(dict_data={
                'type': 'game_over',
                'winner': winner.username if winner else "ROBOT"
            })
            if self.tournament is None and winner:
                await AchievementsManager().handleUserAchievements(user=winner)
            if Loser:
                await AchievementsManager().handleLoserUser(user=Loser)
            self.is_running = False

        await self.emit(dict_data={
            'type': 'goal',
            'first_player_score': self.matchup.first_player_score,
            'second_player_score': self.matchup.second_player_score
        })

    def determine_winner_and_loser(self):
        SecondPlayer = self.second_player if self.second_player else 'ROBOT'

        if self.matchup.first_player_score >= Config.winScore and self.matchup.first_player_score - self.matchup.second_player_score >= Config.requiredScoreDiff:
            return [self.first_player, SecondPlayer]
        elif self.matchup.second_player_score >= Config.winScore and self.matchup.second_player_score - self.matchup.first_player_score >= Config.requiredScoreDiff:
            return [SecondPlayer, self.first_player]
        if self.matchup.first_player_score >= Config.maxScore and self.matchup.first_player_score > self.matchup.second_player_score:
            return [self.first_player, SecondPlayer]
        elif self.matchup.second_player_score >= Config.maxScore and self.matchup.second_player_score > self.matchup.first_player_score:
            return [SecondPlayer, self.first_player]
        return [None, None]

    async def cleanup(self):
        self.is_running = False
        await self.channel_layer.group_send(
            f"game_{self.room_id}",
            {
                'type': 'broadcast',
                'message': json.dumps({
                    'action': 'close'
                })
            })


class GameManager():
    def __init__(self):
        self.games: Dict[str, Game] = {}
        self.lock = None

    async def get_lock(self):
        if self.lock is None:
            self.lock = asyncio.Lock()
        return self.lock

    async def get_or_create_game(self, room_id) -> Game:
        self.lock = await self.get_lock()
        async with self.lock:
            if room_id not in self.games:
                game = await Game.create(room_id)
                if not game:
                    return None
                self.games[room_id] = game
                asyncio.create_task(game.game_loop())
            return self.games[room_id]

    async def remove_game(self, room_id):
        self.lock = await self.get_lock()

        async with self.lock:
            if room_id in self.games:
                await self.games[room_id].cleanup()
                del self.games[room_id]
