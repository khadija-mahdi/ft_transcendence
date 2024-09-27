from game.models import Matchup, Tournament
from user.models import User, Achievements, Ranks, RankAchievement
from channels.db import database_sync_to_async
import logging
from django.db.models import QuerySet

logger = logging.getLogger(__name__)


# when player wins, game or tournament this manager get notified and
# update the user achievements and xp and rank accordingly
class AchievementsManager:
    IncrementingXpSteps = 800
    DecrementingXpSteps = 600

    def __init__(self):
        self.rank_achievement = None
        self.current_xp = 0
        self.total_xp = 0

    def relevantGames(self, user: User, achievement_type: str) -> QuerySet:
        match_up = Matchup.objects.filter(
            first_player__user=user, second_player__user=user)\
            .filter(game_over=True).order_by('-created_at')
        obtained_achievement: Achievements = user.achievements.filter(
            requirement_type=achievement_type).order_by('-created_at').first()
        if obtained_achievement:
            match_up = match_up.filter(
                created_at__gte=obtained_achievement.created_at)
        return match_up

    @database_sync_to_async
    def handleWinStreak(self, user: User) -> None:
        if user is None:
            logger.error("Winner is None, cannot handle win streak.")
            return
        win_streak = 0
        win_strike_achievements: QuerySet = Achievements.objects.filter(
            requirement_type='win_streak')
        if not win_strike_achievements.exists():
            return
        last_match_ups: list[Matchup] = self.relevantGames(user, 'win_streak')
        for matchUp in last_match_ups:
            winner = matchUp.Winner
            if winner and winner.user and winner.user is not user:
                break
            win_streak += 1

        for achievement in win_strike_achievements:
            if win_streak >= achievement.requirement_value:
                user.achievements.add(achievement)
        user.save()

    @database_sync_to_async
    def handleTotalPoints(self, user: User) -> None:
        if user is None:
            logger.error("Winner is None, cannot handle win streak.")
            return
        total_point_achievements = Achievements.objects.filter(
            requirement_type='total_points')
        if not total_point_achievements.exists():
            return
        for achievement in total_point_achievements:
            if user.total_xp >= achievement.requirement_value:
                user.achievements.add(achievement)
        user.save()

    @database_sync_to_async
    def handleZeroLoss(self, user: User) -> None:
        if user is None:
            logger.error("Winner is None, cannot handle win streak.")
            return
        total_zero_loss = 0
        achievements = Achievements.objects.filter(
            requirement_type='win_with_zero_loss')
        if not achievements.exists():
            return
        last_match_ups: list[Matchup] = self.relevantGames(
            user, 'win_with_zero_loss')
        for matchUp in last_match_ups:
            winner = matchUp.Winner
            loser_score = matchUp.first_player.score if\
                matchUp.first_player != winner else matchUp.second_player.score
            if winner and winner.user and winner.user == user and loser_score == 0:
                total_zero_loss += 1

        for achievement in achievements:
            if total_zero_loss >= achievement.requirement_value:
                user.achievements.add(achievement)
        user.save()

    @database_sync_to_async
    def handleTotalWins(self, user: User) -> None:
        if user is None:
            logger.error("Winner is None, cannot handle win streak.")
            return
        total_wins = 0
        achievements = Achievements.objects.filter(
            requirement_type='total_wins')
        if not achievements.exists():
            return
        last_match_ups: list[Matchup] = self.relevantGames(user, 'total_wins')
        for matchUp in last_match_ups:
            winner = matchUp.Winner
            if winner and winner.user and winner.user == user:
                total_wins += 1
        for achievement in achievements:
            if total_wins >= achievement.requirement_value:
                user.achievements.add(achievement)
        user.save()

    @database_sync_to_async
    def getNextRank(self, current_rank_order) -> Ranks:
        try:
            return Ranks.objects.get(hierarchy_order=current_rank_order + 1)
        except Ranks.DoesNotExist:
            return None

    @database_sync_to_async
    def getPrevRank(self, current_rank_order) -> Ranks:
        try:
            return Ranks.objects.get(
                hierarchy_order=1 if current_rank_order <= 1
                else current_rank_order - 1)
        except Ranks.DoesNotExist:
            return None

    async def handleUserAchievements(self, user: User):
        logger.debug(f'Handle User Achievements Called For {user}')
        if not user:
            return

        user.current_xp += self.IncrementingXpSteps
        user.total_xp += self.IncrementingXpSteps

        UserRank: Ranks = await database_sync_to_async(lambda: user.rank)()
        current_xp_required = UserRank.xp_required if UserRank else 0
        next_rank = await self.getNextRank(UserRank.hierarchy_order if UserRank else 0)

        logger.debug(f'Current Rank {UserRank},\n'
                     f'Current Xp Required {current_xp_required}\n'
                     f'Next Rank {next_rank}\n')

        if user.current_xp >= current_xp_required and next_rank is not None:
            user.current_xp -= current_xp_required
            user.rank = next_rank
            self.rank_achievement = RankAchievement(user=user, rank=next_rank)
            logger.debug(f'Updating to Upper Rank {user.current_xp}')

        if self.rank_achievement:
            await database_sync_to_async(self.rank_achievement.save)()

        await database_sync_to_async(user.save)()

        await self.handleWinStreak(user)
        await self.handleTotalPoints(user)
        await self.handleZeroLoss(user)
        await self.handleTotalWins(user)

    async def handleLoserUser(self, user: User):
        logger.debug(f'handle Loser User Called For {user}')

        if not user:
            return

        user.current_xp -= self.DecrementingXpSteps
        user.total_xp -= self.DecrementingXpSteps

        UserRank: Ranks = await database_sync_to_async(lambda: user.rank)()

        logger.debug(f'Current Rank {UserRank},\n'
                     f'Current Xp {user.current_xp}\n'
                     f'Total Xp {user.total_xp}\n')

        if not UserRank:
            return
        newRank: Ranks = await self.getPrevRank(UserRank.hierarchy_order)

        logger.debug(f'new Rank {newRank}')

        if UserRank.hierarchy_order == newRank.hierarchy_order and user.current_xp < 0:
            user.current_xp = 0
            user.total_xp = 0
        elif user.current_xp < 0:
            user.rank = newRank
            user.current_xp = newRank.xp_required + user.current_xp
            self.rank_achievement = RankAchievement(user=user, rank=newRank)

        if self.rank_achievement:
            await database_sync_to_async(self.rank_achievement.save)()
        await database_sync_to_async(user.save)()
