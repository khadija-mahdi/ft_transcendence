import asyncio
from channels.layers import get_channel_layer
import json
from channels.db import database_sync_to_async
from user.models import User
from game.models import Matchup, Tournament, Brackets
from game.managers.achievements_manager import AchievementsManager
import random
from typing import Dict


class TournamentRoutine():
    waiting_players = []
    time_in_s = 0
    lock = None
    tournament = None
    current_round = 1

    def __init__(self, uuid) -> None:
        self.uuid = uuid
        self.channel_layer = get_channel_layer()

    @classmethod
    async def create(cls, uuid):
        self = TournamentRoutine(uuid)
        self.lock = asyncio.Lock()
        try:
            self.tournament = await database_sync_to_async(Tournament.objects.get)(uuid=uuid, finished=False)
        except Tournament.DoesNotExist:
            return None
        asyncio.create_task(self.tournament_loop())
        return self

    async def add_player(self, player):
        print(f'called add_player {player.username} to tournament_{self.uuid}')
        async with self.lock:
            if player not in self.waiting_players:
                self.waiting_players.append(player)

    async def remove_player(self, player):
        async with self.lock:
            if player in self.waiting_players:
                self.waiting_players.remove(player)
            return len(self.waiting_players) == 0

    async def emit_match_info(self, match):
        first_player = await database_sync_to_async(User.objects.get)(id=match.first_player.id)
        second_player = await database_sync_to_async(User.objects.get)(id=match.second_player.id)
        match_info = {
            'type': 'match_info',
            'match_uuid': str(match.game_uuid),
            'first_player': first_player.username,
            'second_player': second_player.username
        }
        await self.emit(match_info)

    async def create_matches(self, players):
        async with self.lock:
            random.shuffle(players)
        print(f'called create_matches to tournament_{self.uuid}')
        await database_sync_to_async(Brackets.objects.filter(
            tournament=self.tournament).delete)()
        for i in range(0, len(players), 2):
            if i + 1 < len(players):
                matchup = Matchup(
                    first_player=players[i],
                    second_player=players[i + 1],
                    tournament=self.tournament,
                    round_number=self.current_round
                )
                await database_sync_to_async(matchup.save)()
                await self.CreateBracket(players[i], players[i + 1])
                await self.emit_match_info(matchup)
                del players[i:i + 2]
                print(
                    f'created match between {matchup.first_player.username} and {matchup.second_player.username}')
        if len(players) > 0:
            print('last player automatically moved to next round')
            bracket = Brackets(
                tournament=self.tournament,
                round_number=self.current_round,
                player=players[0])
            match_up = Matchup(
                first_player=players[0],
                second_player=None,
                tournament=self.tournament,
                Winner=players[0],
                game_over=True,
                round_number=self.current_round
            )
            await database_sync_to_async(bracket.save)()
            await database_sync_to_async(match_up.save)()
            await self.check_round_completion()

    @database_sync_to_async
    def CreateBracket(self, first_player, second_player):
        Brackets(
            tournament=self.tournament,
            round_number=self.current_round,
            player=first_player
        ).save()
        Brackets(
            tournament=self.tournament,
            round_number=self.current_round,
            player=second_player
        ).save()

    async def create_initial_matches(self):
        await self.create_matches(self.waiting_players)

    async def tournament_loop(self):
        while True:
            self.time_in_s += 1
            print(f'{self.time_in_s} tick...')
            if len(self.waiting_players) == self.tournament.max_players or self.time_in_s >= 10:
                print('All Players Showed Up')
                print(
                    f'self.tournament.max_players, { self.tournament.max_players}, waiting_players, {self.waiting_players}')
                await self.create_initial_matches()
                break
            elif self.time_in_s >= 120:
                print('still Waiting')
                print(
                    f'self.tournament.max_players, { self.tournament.max_players}, waiting_players, {self.waiting_players}')
                if len(self.waiting_players) < self.tournament.max_players / 2:
                    print('Not Enough Players Showed Up')
                    return await self.emit(
                        {'status': 'over', 'reason': 'Not Enough Player Showed Up'})
                else:
                    print('All Players Showed Up')
                    self.create_initial_matches()
                break
            await asyncio.sleep(1)

    async def check_round_completion(self):
        print(f'called check_round_completion to tournament_{self.uuid}')
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
        print(
            f'current_round_matches, {current_round_matches}, total_round_matches, {total_round_matches}')
        if current_round_matches == total_round_matches:
            print('All Matches Completed')
            await self.prepare_next_round()
        else:
            print('Not All Matches Completed')

    async def prepare_next_round(self):
        print(f'called prepare_next_round to tournament_{self.uuid}')
        async with self.lock:
            self.current_round += 1
            current_round_winners = await database_sync_to_async(
                lambda: list(Matchup.objects.filter(
                    tournament=self.tournament,
                    game_over=True,
                    Winner__isnull=False,
                    round_number=self.current_round - 1
                ).values_list('Winner', flat=True))
            )()
            if len(current_round_winners) == 0:
                if self.tournament.finished is False:
                    self.tournament.finished = True
                    await database_sync_to_async(self.tournament.save)()
                    return await self.emit({'status': 'over', 'reason': 'No Winner Found'})
                return
            if len(current_round_winners) > 1:
                winners = await database_sync_to_async(
                    lambda: list(User.objects.filter(
                        id__in=current_round_winners))
                )()
                print(f'winners, {winners}')
                self.create_matches(winners)
            else:
                print('Tournament Over')
                tournament_winner = await database_sync_to_async(User.objects.get)(id=current_round_winners[0])
                self.tournament.finished = True
                await database_sync_to_async(self.tournament.save)()
                AchievementsManager().handleUserAchievements(user=tournament_winner)
                await self.emit({'status': 'over', 'winner': tournament_winner.username})

    async def emit(self, dict_data):
        print(f'called emit to tournament_{self.uuid}')
        await self.channel_layer.group_send(
            f"tournament_{self.uuid}",
            {
                'type': 'broadcast',
                'message': json.dumps(dict_data)
            }
        )


class TournamentManager():
    lock = None
    tournaments: Dict[str, TournamentRoutine] = {}

    def __init__(self) -> None:
        pass

    async def get_lock(self) -> asyncio.Lock:
        if self.lock is None:
            self.lock = asyncio.Lock()
        return self.lock

    async def get_or_create_tournament(self, uuid) -> TournamentRoutine:
        self.lock = await self.get_lock()
        async with self.lock:
            if uuid not in self.tournaments:
                print('create new tournament')
                tournament = await TournamentRoutine.create(uuid)
                if tournament is None:
                    return None

                self.tournaments[uuid] = tournament
            return self.tournaments[uuid]

    async def remove_tournament(self, uuid) -> None:
        self.lock = await self.get_lock()
        async with self.lock:
            if uuid in self.tournaments:
                del self.tournaments[uuid]
