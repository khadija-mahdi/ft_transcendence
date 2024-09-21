from typing import Any, Dict, List
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from user.models import User
from game.models import Matchup, Tournament, Brackets
from game.managers.achievements_manager import AchievementsManager
from transcendent.consumers import NotifyUser
from api.serializers import NotificationSerializer
from api.models import Notification
from api.services import NotificationManager
import asyncio
import logging
import random
import json


logger = logging.getLogger(__name__)

# Constants
WAIT_PERIOD_SECONDS = 30


class TournamentRoutine():
    """Class representing the routine of a single tournament."""

    def __init__(self, uuid) -> None:
        self.uuid: str = uuid
        self.channel_layer = get_channel_layer()
        self.waiting_players: List[User] = []
        self.time_in_s: int = 0
        self.lock: asyncio.Lock = None
        self.tournament: Tournament = None
        self.current_round: int = 1

    @classmethod
    async def create(cls, uuid):
        """Factory method to initialize TournamentRoutine instance."""
        instance = cls(uuid)
        instance.lock = asyncio.Lock()
        try:
            instance.tournament = await database_sync_to_async(Tournament.objects.get)(uuid=uuid, finished=False)
        except Tournament.DoesNotExist:
            logger.error(f'Tournament with this id {uuid}\
                         and still is not finished does not exists')
            return None
        except Exception as error:
            logger.error(f'error occurred while getting tournament \
                         {uuid}: {error}')
            return
        asyncio.create_task(instance.tournament_loop())
        return instance

    async def add_player(self, player: User) -> None:
        """Adds a player to the waiting list if not already present."""
        async with self.lock:
            if player not in self.waiting_players:
                self.waiting_players.append(player)
                logger.debug(f'Added player {player.username}\
                       to tournament {self.uuid}')
            else:
                logger.warning(
                    f'Player {player.username} already in waiting list.')

    async def remove_player(self, player: User) -> bool:
        """Removes a player from the waiting list."""
        async with self.lock:
            if player in self.waiting_players:
                self.waiting_players.remove(player)
                logger.debug(f'Removed player {player.username}\
                      from tournament {self.uuid}')
            return len(self.waiting_players) == 0

    async def emit(self, dict_data) -> None:
        """Sends a message to the tournament group."""
        logger.debug(f'Sending to Tournament group {dict_data}')
        await self.channel_layer.group_send(
            f"tournament_{self.uuid}",
            {'type': 'broadcast', 'message': json.dumps(dict_data)}
        )

    async def create_and_send_notification(self, info: Dict[str, Any], recipient: User, sender: User) -> None:
        notification = Notification(
            recipient=recipient,
            sender=sender,
            title='You Are Scheduled to new game',
            description=f'You are to play against {sender.username}',
            type='new-game',
            action=json.dumps(info)
        )
        await database_sync_to_async(notification.save)()
        await sync_to_async(NotificationManager().send_notification)(notification)

    async def emit_match_info(self, match: Matchup) -> None:
        """Emit match info to the Users channel."""
        first_player: User = await database_sync_to_async(User.objects.get)(id=match.first_player.id)
        second_player: User = await database_sync_to_async(User.objects.get)(id=match.second_player.id)
        match_info = {
            'type': 'match_info',
            'match_uuid': str(match.game_uuid),
            'first_player': first_player.username,
            'second_player': second_player.username
        }
        await self.create_and_send_notification(match_info, first_player, second_player)
        await self.create_and_send_notification(match_info, second_player, first_player)

    async def create_initial_matches(self) -> None:
        """Creates the initial matches when the tournament starts."""
        logger.debug(
            f'Creating the Initial Tournament MatchUps for {self.uuid}')
        await self.create_matches(self.waiting_players.copy())

    async def create_matches(self, players: User) -> None:
        """Creates matchUps for the players in the current round."""

        logger.debug(f'''Creating the Tournament MatchUps '''
                     f'''for {self.uuid} players {players}''')
        random.shuffle(players)
        await database_sync_to_async(Brackets.objects.filter(
            tournament=self.tournament).delete)()

        while len(players) >= 2:
            matchup = Matchup(
                first_player=players[0],
                second_player=players[1],
                tournament=self.tournament,
                round_number=self.current_round
            )
            await database_sync_to_async(matchup.save)()
            await self._create_brackets(players[0], players[1])
            await self.emit_match_info(matchup)
            logger.info(f'''Staring Game {matchup.first_player.username}'''
                        f''' vs {matchup.second_player.username}''')
            del players[0:2]

        logger.debug(f'Remaining Player are {players}')
        if len(players) == 1:
            await self._auto_win_last_player(players[0])

    @database_sync_to_async
    def _create_brackets(self, first_player, second_player) -> None:
        """Creates the brackets for two players."""
        Brackets(tournament=self.tournament,
                 round_number=self.current_round, player=first_player).save()
        Brackets(tournament=self.tournament,
                 round_number=self.current_round, player=second_player).save()

    async def _auto_win_last_player(self, last_player: User) -> None:
        """Automatically advance the last player to the next round if they have no opponent."""
        logger.debug(
            f'A Player has moved up to next round automatically {last_player}')
        bracket = Brackets(tournament=self.tournament,
                           round_number=self.current_round, player=last_player)
        match_up = Matchup(first_player=last_player, second_player=None, tournament=self.tournament,
                           Winner=last_player, game_over=True, round_number=self.current_round)
        await database_sync_to_async(bracket.save)()
        await database_sync_to_async(match_up.save)()

    async def tournament_loop(self):
        """The main loop to handle the tournament logic."""
        logger.debug('Tournament loop iteration start...')
        while True:
            self.time_in_s += 1
            logger.debug(
                f'{self.time_in_s}s has passed sense the start of the tournament')

            if self.time_in_s < WAIT_PERIOD_SECONDS:
                await asyncio.sleep(1)
                continue

            async with self.lock:
                available_player = len(self.waiting_players)
                if available_player == self.tournament.max_players or available_player >= self.tournament.max_players / 2:
                    return await self.create_initial_matches()
                logger.warning(f'''less than half required players showed up,required :{
                               self.tournament.max_players}, available: {available_player}''')
                await self._declare_tournament_as_finished()
                return await self.emit(
                    {'type': 'tournament_end', 'message': 'Not Enough Player Showed Up'})

    async def check_round_completion(self):
        """Check if the current round has been completed."""
        """It's triggered at every matchup finishes."""

        current_round_matches = await database_sync_to_async(Matchup.objects.filter(
            tournament=self.tournament,
            Winner__isnull=False,
            game_over=True,
            round_number=self.current_round
        ).count)()

        total_round_matches = await database_sync_to_async(Matchup.objects.filter(
            tournament=self.tournament,
            round_number=self.current_round
        ).count)()
        logger.info(f'''A Round Completed Stats:'''
                    f'''Current Round Matches : {current_round_matches}'''
                    f'''tOtal Round Matches : {total_round_matches}''')

        if current_round_matches == total_round_matches:
            await self.prepare_next_round()

    async def prepare_next_round(self) -> None:
        """Prepare for the next round or declare the tournament winner."""
        winners = await database_sync_to_async(
            lambda: list(Matchup.objects.filter(
                tournament=self.tournament,
                game_over=True,
                Winner__isnull=False,
                round_number=self.current_round
            ).values_list('Winner', flat=True))
        )()

        logger.info(f"""PreParing Next Round"""
                    f"""current_round {self.current_round + 1}"""
                    f"""this round Winners {winners}""")
        self.current_round += 1
        if len(winners) == 0:
            if self.tournament.finished is False:
                self.tournament.finished = True
                await database_sync_to_async(self.tournament.save)()
                return await self.emit({'type': 'tournament_end', 'message': 'No Winner Found'})
            return
        if len(winners) > 1:
            winners = await database_sync_to_async(
                lambda: list(User.objects.filter(id__in=winners))
            )()
            return self.create_matches(winners)
        return self._declare_tournament_winner(winners[0])

    async def _declare_tournament_winner(self, winner_id: int) -> None:
        """Declare the tournament winner."""

        logger.info(f'Tournament Finished and the winner is f{winner_id}')
        tournament_winner: User = await database_sync_to_async(User.objects.get)(id=winner_id)
        await self._declare_tournament_as_finished()
        AchievementsManager().handleUserAchievements(user=tournament_winner)
        await self.emit({'type': 'tournament_completed', 'winner': tournament_winner.username})

    async def _declare_tournament_as_finished(self):
        """Declare the tournament as Finished"""
        self.tournament.finished = True
        self.tournament.ongoing = False
        await database_sync_to_async(self.tournament.save)()


class TournamentManager():
    """Manages multiple tournament instances."""

    lock = None
    tournaments: Dict[str, TournamentRoutine] = {}

    def __init__(self) -> None:
        pass

    async def get_lock(self) -> asyncio.Lock:
        if self.lock is None:
            self.lock = asyncio.Lock()
        return self.lock

    async def get_or_create_tournament(self, uuid) -> TournamentRoutine:
        """Gets or creates a tournament routine."""

        self.lock = await self.get_lock()
        async with self.lock:
            logger.debug(f'looking by {uuid} ')
            logger.debug(f'stored tournaments {self.tournaments} ')
            if uuid not in self.tournaments:
                logger.debug('create new tournament')
                tournament = await TournamentRoutine.create(uuid)
                if tournament is None:
                    logger.debug(f'No Tournament Record Found {uuid}')
                    return None

                self.tournaments[uuid] = tournament
            return self.tournaments[uuid]

    async def remove_tournament(self, uuid) -> None:
        """Removes a tournament from the manager."""

        self.lock = await self.get_lock()
        async with self.lock:
            if uuid in self.tournaments:
                del self.tournaments[uuid]
