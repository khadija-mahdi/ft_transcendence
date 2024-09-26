from typing import Any, Dict, List
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from user.models import User
from game.models import Matchup, Tournament, Brackets, TournamentsRegisteredPlayers, GamePlayer
from game.managers.achievements_manager import AchievementsManager
from api.models import Notification
from api.services import NotificationManager
import asyncio
import logging
import random
import json

logger = logging.getLogger(__name__)

WAIT_PERIOD_SECONDS = 30


class UserWithAlias:
    def __init__(self, user: User, alias: str = None):
        self.user = user
        self.alias = alias


class TournamentRoutine():
    """Class representing the routine of a single tournament."""

    def __init__(self, uuid) -> None:
        self.uuid: str = uuid
        self.channel_layer = get_channel_layer()
        self.waiting_players: List[UserWithAlias] = []
        self.time_in_s: int = 0
        self.lock: asyncio.Lock = None
        self.tournament: Tournament = None
        self.current_round: int = 1
        self.games_in_progress: bool = False

    @classmethod
    async def create(cls, uuid):
        """Factory method to initialize TournamentRoutine instance."""
        instance = cls(uuid)
        instance.lock = asyncio.Lock()
        try:
            instance.tournament = await database_sync_to_async(Tournament.objects.get)(uuid=uuid, finished=False)
        except Tournament.DoesNotExist:
            logger.error(f'Tournament With This Id {uuid}'
                         'Either Its Not Finished Or It Does Not Exists')
            return None
        except Exception as error:
            logger.error('Error Occurred While Getting Tournament'
                         f'{uuid}: {error}')
            return
        logger.debug(f'Launching Tournament-{uuid} Manager')
        asyncio.create_task(instance.tournament_loop())
        return instance

    async def tournament_loop(self):
        """The main loop to handle the tournament logic."""

        logger.debug('Tournament loop iteration start...')
        while True:
            self.time_in_s += 1
            logger.debug(
                f'{self.time_in_s}s has passed sense the start of the tournament {self.uuid}')

            if self.time_in_s < WAIT_PERIOD_SECONDS:
                await asyncio.sleep(1)
                continue

            async with self.lock:
                available_player = len(self.waiting_players)
                if available_player == self.tournament.max_players or available_player >= self.tournament.max_players / 2:
                    return await self.create_initial_matches()

                logger.warning('less than half required players showed up,required :'
                               '{self.tournament.max_players}, available: {available_player}')

                await self._declare_tournament_as_finished()

                return await self.emit({
                    'type': 'tournament_end',
                    'message': 'Not Enough Player Showed Up'
                })

    async def create_initial_matches(self) -> None:
        """Creates the initial matches when the tournament starts."""
        logger.debug(
            f'Creating the Initial Tournament MatchUps for {self.uuid}')
        await self.create_matches(self.waiting_players.copy())

    async def create_matches(self, players: List[UserWithAlias]) -> None:
        """Creates matchUps for the players in the current round."""

        logger.debug(f'Creating the Tournament MatchUps'
                     f'players {[player.alias for player in players]}')

        # random.shuffle(players)
        keep_emitting = True

        await database_sync_to_async(Brackets.objects.filter(
            tournament=self.tournament, round_number=self.current_round
        ).delete)()

        while len(players) >= 2:
            logger.debug('Creating Match between'
                         f'-> {players[0].alias} vs {players[1].alias}')

            matchup = await self.createMatchUp(players[0], players[1])
            await self._create_brackets(players[0], players[1])
            if keep_emitting:
                await self.emit_match_info(matchup)
                keep_emitting = self.tournament.is_public
            del players[0:2]

        if len(players) == 1:
            await self._auto_win_last_player(players[0])
        self.games_in_progress = True

    async def createMatchUp(self, fp: UserWithAlias, sp: UserWithAlias):
        fGamePlayer = GamePlayer(user=fp.user, alias=fp.alias)
        sGamePlayer = GamePlayer(user=sp.user, alias=sp.alias)
        await database_sync_to_async(fGamePlayer.save)()
        await database_sync_to_async(sGamePlayer.save)()
        matchup = Matchup(
            first_player=fGamePlayer,
            second_player=sGamePlayer,
            tournament=self.tournament,
            round_number=self.current_round,
            game_type='online' if self.tournament.is_public else 'offline'
        )
        await database_sync_to_async(matchup.save)()
        return matchup

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

        logger.info(f'A Round Completed Stats : \n'
                    f' - current_round {self.current_round} \n'
                    f' - Current Round Matches: {current_round_matches} \n'
                    f' - tOtal Round Matches: {total_round_matches} \n')

        if current_round_matches == total_round_matches and total_round_matches != 0:
            await self.prepare_next_round()
        elif not self.tournament.is_public:
            await self.resend_Game_notifications()

    async def prepare_next_round(self) -> None:
        """Prepare for the next round or declare the tournament winner."""

        if not self.games_in_progress:
            return
        self.games_in_progress = False

        winners: List[GamePlayer] = await database_sync_to_async(
            lambda: list(Matchup.objects.filter(
                tournament=self.tournament,
                game_over=True,
                Winner__isnull=False,
                round_number=self.current_round
            ).values_list('Winner', flat=True))
        )()

        logger.info(f"""Preparing Next Round \n"""
                    f"""- current_round {self.current_round + 1} \n"""
                    f"""- this round Winners_id_list {winners}, count {len(winners)} \n""")

        self.current_round += 1

        if len(winners) == 0:
            if not self.tournament.finished:
                self.tournament.finished = True
                await database_sync_to_async(self.tournament.save)()
                return await self.emit({'type': 'tournament_end', 'message': 'No Winner Found'})
            return

        if len(winners) > 1:
            winners_list: List[GamePlayer] = await database_sync_to_async(
                lambda: list(GamePlayer.objects.filter(id__in=winners))
            )()
            self.games_in_progress = True

            logger.debug(f'got the winners from db '
                         f'{[winner.alias for winner in winners_list]}')

            users_list = [UserWithAlias(await database_sync_to_async(lambda: winner.user)(),
                                        winner.alias) for winner in winners_list]
            return await self.create_matches(users_list)

        return await self._declare_tournament_winner(winners[0])

    async def resend_Game_notifications(self):
        """It sends Game uuid to players who still didn\'t finish the game yet"""
        """intended solely for local tournament"""
        logger.debug(f'continue Sending Game Notification For Player'
                     f'{self.current_round}')

        remainingGame: Matchup = await database_sync_to_async(
            Matchup.objects.filter(
                tournament=self.tournament,
                game_over=False,
                Winner__isnull=True,
                round_number=self.current_round
            ).first
        )()

        logger.debug(f'resending the notification for remaining Game : '
                     f'{remainingGame.round_number}')

        first_player: GamePlayer = await database_sync_to_async(lambda: remainingGame.first_player)()
        second_player: GamePlayer = await database_sync_to_async(lambda: remainingGame.second_player)()
        match_info = {
            'type': 'match_info',
            'match_uuid': str(remainingGame.game_uuid),
            'first_player': first_player.alias,
            'first_player': second_player.alias,
        }
        await self.create_and_send_notification(match_info, first_player, second_player)

    async def _declare_tournament_winner(self, winner_id: int) -> None:
        """Declare the tournament winner."""

        logger.info(f'Tournament Finished and the winner is {winner_id}')

        winner: GamePlayer = await database_sync_to_async(GamePlayer.objects.get)(id=winner_id)
        winner_user: User = await database_sync_to_async(lambda: winner.user)()

        await self._declare_tournament_as_finished()
        AchievementsManager().handleUserAchievements(user=winner_user)

        await self.create_and_send_notification(
            {'tournament_id': self.tournament.uuid}, winner, None,
            title='Congratulation',
            description=f'You have won the tournament {self.tournament.name}',
            type='notification')

        await self.emit({'type': 'tournament_completed', 'winner': winner.alias})

    async def _declare_tournament_as_finished(self):
        """Declare the tournament as Finished"""

        self.tournament.finished = True
        self.tournament.ongoing = False
        await database_sync_to_async(self.tournament.save)()

    async def _auto_win_last_player(self, last_player: UserWithAlias) -> None:
        """Automatically advance the last player to the next round if they have no opponent."""

        logger.debug(
            f'A Player has moved up to next round automatically {last_player.alias}')

        player = await database_sync_to_async(GamePlayer.objects.create)(user=last_player.user, alias=last_player.alias)
        await self._create_brackets(last_player, None)
        match_up = Matchup(first_player=player, second_player=None, tournament=self.tournament,
                           Winner=player, game_over=True, round_number=self.current_round)
        await database_sync_to_async(match_up.save)()

    async def add_player(self, player: User) -> None:
        """Adds a player to the waiting list if not already present."""

        async with self.lock:
            if not self.tournament.is_public:
                await self.private_add_player()
            elif player not in [player.user for player in self.waiting_players]:
                "Handle public tournament and register only the active players"
                self.waiting_players.append(UserWithAlias(
                    player, await self.get_user_alias(player.pk)))
                logger.debug(f'Added player {player.username}'
                             f'to tournament {self.uuid}')
            else:
                logger.warning(
                    f'Player {player.username} already in waiting list.')

    async def remove_player(self, player: User) -> bool:
        """Removes a player from the waiting list."""

        async with self.lock:
            player_to_remove = next(
                (gp for gp in self.waiting_players if gp.user == player), None)
            if player_to_remove:
                self.waiting_players.remove(player_to_remove)
                logger.debug(f'Removed player {player.username}'
                             f'from tournament {self.uuid}')
            return len(self.waiting_players) == 0

    async def private_add_player(self):
        """Handle private tournament and register all register players as active players"""
        logger.debug(f'Adding All registered PLayers as active Players'
                     f'to tournament {self.uuid}')
        registered_players: List[TournamentsRegisteredPlayers] = await database_sync_to_async(
            lambda: list(TournamentsRegisteredPlayers.objects.filter(
                tournament=self.tournament))
        )()
        self.waiting_players.clear()
        for r_player in registered_players:
            user = await database_sync_to_async(lambda: r_player.user)()
            alias = r_player.alias
            self.waiting_players.append(UserWithAlias(user, alias))

    async def get_user_alias(self, pk: int) -> str:
        registerRecord: TournamentsRegisteredPlayers = await \
            database_sync_to_async(TournamentsRegisteredPlayers.objects.filter(
                user__pk=pk, tournament=self.tournament).first)()
        return registerRecord.alias

    async def create_and_send_notification(self, info: Dict[str, Any], recipient: GamePlayer,
                                           sender: GamePlayer, title=None, description=None, type=None, save: bool = True) -> None:

        recipient_user: User = await database_sync_to_async(lambda: recipient.user)()
        sender_user: User = await database_sync_to_async(lambda: sender.user)() if sender else None

        notification = Notification(
            recipient=recipient_user,
            sender=sender_user,
            title='You Are Scheduled to new game' if not title else title,
            description=f'You are to play against {sender_user.username}'
            if not description else description,
            type='new-game' if not type else type,
            action=json.dumps(info)
        )
        if save:
            await database_sync_to_async(notification.save)()
        await sync_to_async(NotificationManager().send_notification)(notification)

    @database_sync_to_async
    def _create_brackets(self, fp: UserWithAlias, sp: UserWithAlias) -> None:
        """Creates the brackets for two players."""
        Brackets(tournament=self.tournament, round_number=self.current_round,
                 player=fp.user, alias=fp.alias).save()
        Brackets(tournament=self.tournament, round_number=self.current_round,
                 player=sp.user if sp else fp.user, alias=sp.alias if sp else 'Empty').save()

    async def emit(self, dict_data) -> None:
        """Sends a message to the tournament group."""

        logger.debug(f'Sending to Tournament group {dict_data}')
        await self.channel_layer.group_send(
            f"tournament_{self.uuid}",
            {'type': 'broadcast', 'message': json.dumps(dict_data)}
        )

    async def emit_match_info(self, match: Matchup, save: bool = True) -> None:
        """Emit match info to the Users channel."""

        first_player: GamePlayer = await database_sync_to_async(GamePlayer.objects.get)(pk=match.first_player.pk)
        second_player: GamePlayer = await database_sync_to_async(GamePlayer.objects.get)(pk=match.second_player.pk)
        match_info = {
            'type': 'match_info',
            'match_uuid': str(match.game_uuid),
            'first_player': first_player.alias,
            'second_player': second_player.alias
        }
        await self.create_and_send_notification(match_info, first_player, second_player)
        await self.create_and_send_notification(match_info, second_player, first_player)


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
            if uuid not in self.tournaments:
                logger.info('create new tournament')
                tournament = await TournamentRoutine.create(uuid)
                if tournament is None:
                    logger.info(f'No Tournament Record Found {uuid}')
                    return None
                self.tournaments[uuid] = tournament
            return self.tournaments[uuid]

    async def isTournamentFinished(self, uuid):
        tournament: Tournament = await database_sync_to_async(Tournament.objects.get)(uuid=uuid)
        return tournament and tournament.finished

    async def remove_tournament(self, uuid) -> None:
        """Removes a tournament from the manager."""
        self.lock = await self.get_lock()
        async with self.lock:
            if uuid in self.tournaments and self.isTournamentFinished(uuid):
                del self.tournaments[uuid]
