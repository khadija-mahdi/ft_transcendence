import asyncio
from channels.layers import get_channel_layer
import json
from channels.db import database_sync_to_async
from game.managers.achievements_manager import AchievementsManager
from user.models import User
from game.models import Matchup, Tournament, GamePlayer
from game.utils.game_utils import Ball, Paddle, Config
from typing import Dict
import logging

logger = logging.getLogger(__name__)


class Game():
    first_player: GamePlayer = None
    second_player: GamePlayer = None
    first_player_user: User = None
    second_player_user: User = None
    tournament: Tournament = None

    def __init__(self, room_id):
        self.room_id = room_id
        self.lock = None
        self.is_running = True
        self.players = []
        self.ball = Ball()
        halfHeight = (Config.tableDepth / 2)

        self.player_1_paddle = Paddle(5,  halfHeight)
        self.player_2_paddle = Paddle(Config.tableWidth - 10, halfHeight)

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
            self.first_player_user = await database_sync_to_async(lambda: self.first_player.user)()

            self.second_player = await database_sync_to_async(lambda: self.matchup.second_player)()
            self.second_player_user = await database_sync_to_async(lambda: self.second_player.user)()

            self.tournament = await database_sync_to_async(lambda: self.matchup.tournament)()

            isFinished = await database_sync_to_async(lambda: self.matchup.game_over)()
            logger.debug(
                f'Getting Game With uuid {room_id} result is {self.matchup.game_type}, isFinished = {isFinished}')
            if isFinished:
                return None

        except Matchup.DoesNotExist:
            self.matchup = None
        return self

    async def add_player(self, player):
        logger.debug(f'Add Player {player}')
        async with self.lock:
            if len(self.players) == 2 or player in self.players or not self.matchup:
                logger.debug(f'  > either player list is full > {len(self.players) == 2}\n'
                             f'  > or player already in player list\n'
                             f'     - {player in self.players} \n'
                             f'  > or matchup is null {not self.matchup}')
                return False
            if player == self.first_player_user or player == self.second_player_user:
                logger.debug('Adding player {player}')
                self.players.append(player)
                return True
            else:
                logger.info('player is neither Fp or Sp')
            return False

    async def move_paddle(self, player, action, player_order=None):
        async with self.lock:
            if player_order:
                paddle = self.player_1_paddle if player_order == 1 else self.player_2_paddle
            else:
                paddle = self.player_1_paddle if player == self.first_player_user else self.player_2_paddle
            paddle.movePaddle(action)

    async def findLoserWinnerInstances(self, loser: User):
        if loser == self.first_player_user:
            return self.first_player, self.second_player
        elif loser == self.second_player_user:
            return self.second_player, self.first_player
        return None, None

    async def remove_player(self, player):
        async with self.lock:
            if player in self.players:
                try:
                    self.matchup.game_over = True
                    if len(self.players) > 1:
                        Loser, winner = await self.findLoserWinnerInstances(player)
                        if not Loser and not winner:
                            return
                        self.players.remove(player)
                        if self.matchup.Winner:
                            logger.debug('match has winner already '
                                         f'{self.matchup.Winner.alias}')
                            return
                        await self.handle_winner(winner=winner, Loser=Loser)
                    await database_sync_to_async(self.matchup.save)()
                except ValueError as e:
                    logger.error(f'failed while removing player {e}')
                    pass
            return len(self.players) == 0

    async def game_loop(self):
        logger.info('Starting Game Loop For Game'
                    f'{self.room_id}, {self.is_running}')

        while self.is_running:
            await asyncio.sleep(1/60)
            if not self.matchup:
                return await self.emit(type='game_over', message='matchup not found')
            if len(self.players) != 2 and self.second_player_user is not None\
                    and self.matchup.game_type == 'online':
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

            if self.second_player_user is None and self.matchup.game_type == 'online':
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

    async def NotifyTournamentConsumer(self, Winner: GamePlayer):
        logger.debug(f'Notify Tournament {self.tournament} '
                     f'About this Game Winner {Winner.alias}')
        if self.tournament is None:
            return
        await self.channel_layer.group_send(
            f"tournament_{self.tournament.uuid}",
            {
                'type': 'match_result',
                'message':  json.dumps({
                    'match_id': self.matchup.pk,
                    'winner_id': Winner.pk
                })
            }
        )

    def reset_paddles(self):
        self.player_1_paddle.updatePosition(
            (Config.tableDepth / 2))
        self.player_2_paddle.updatePosition(
            (Config.tableDepth / 2))

    async def new_point(self, is_left_goal):
        self.pause = True
        self.reset_paddles()

        if not is_left_goal:
            self.matchup.first_player.score += 1
        else:
            self.matchup.second_player.score += 1

        await database_sync_to_async(self.matchup.save)()
        winner, Loser = self.determine_winner_and_loser()
        await self.handle_winner(winner, Loser)

    async def handle_winner(self, winner: GamePlayer, Loser: GamePlayer):
        if winner:
            winner = None if type(winner) == str else winner
            Loser = None if type(Loser) == str else Loser
            self.matchup.Winner = winner
            self.matchup.game_over = True

            await database_sync_to_async(self.first_player.save)()
            await database_sync_to_async(self.second_player.save)()
            await database_sync_to_async(self.matchup.save)()

            await self.NotifyTournamentConsumer(winner)
            winner_user: User = await database_sync_to_async(lambda: winner.user)()
            Loser_user: User = await database_sync_to_async(lambda: Loser.user)()
            await self.emit(dict_data={
                'type': 'game_over',
                'winner': winner_user.username if winner_user else "root"
            })
            if self.tournament is None and self.matchup.game_type == 'online':
                if winner_user:
                    await AchievementsManager().handleUserAchievements(user=winner_user)
                if Loser_user:
                    await AchievementsManager().handleLoserUser(user=Loser_user)
            self.is_running = False

        await self.emit(dict_data={
            'type': 'goal',
            'first_player_score': self.matchup.first_player.score,
            'second_player_score': self.matchup.second_player.score
        })

    def determine_winner_and_loser(self):
        SecondPlayer = self.second_player if self.second_player else 'ROBOT'

        if self.matchup.first_player.score >= Config.winScore and self.matchup.first_player.score - self.matchup.second_player.score >= Config.requiredScoreDiff:
            return [self.first_player, SecondPlayer]
        elif self.matchup.second_player.score >= Config.winScore and self.matchup.second_player.score - self.matchup.first_player.score >= Config.requiredScoreDiff:
            return [SecondPlayer, self.first_player]
        if self.matchup.first_player.score >= Config.maxScore and self.matchup.first_player.score > self.matchup.second_player.score:
            return [self.first_player, SecondPlayer]
        elif self.matchup.second_player.score >= Config.maxScore and self.matchup.second_player.score > self.matchup.first_player.score:
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
                room = self.games[room_id]
                del self.games[room_id]
                await room.cleanup()
