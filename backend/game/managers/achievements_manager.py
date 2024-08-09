# when player wins, game or tournament this manager get notified and update the user achievements and xp and rank accordingly
from game.models import Matchup, Tournament
from user.models import User, Achievements, Ranks
from channels.db import database_sync_to_async

from django.db.models import QuerySet


class AchievementsManager:
    IncrementingXpSteps = 120
    DecrementingXpSteps = 60

    def __init__(self):
        pass

    def relevantGames(self, user: User, achievement_type: str) -> QuerySet:
        match_up = Matchup.objects.filter(
            first_player=user, second_player=user)\
            .filter(game_over=True).order_by('-created_at')
        obtained_achievement: Achievements = user.achievements.filter(
            requirement_type=achievement_type).order_by('-created_at').first()
        if obtained_achievement:
            match_up = match_up.filter(
                created_at__gte=obtained_achievement.created_at)
        return match_up

    @database_sync_to_async
    def handleWinStreak(self, user: User) -> None:
        win_streak = 0
        win_strike_achievements: QuerySet = Achievements.objects.filter(
            requirement_type='win_streak')
        if not win_strike_achievements.exists():
            return
        last_match_ups = self.relevantGames(user, 'win_streak')
        for matchUp in last_match_ups:
            winner = matchUp.Winner()
            if winner is not user:
                break
            win_streak += 1

        for achievement in win_strike_achievements:
            if win_streak >= achievement.requirement_value:
                user.achievements.add(achievement)
        user.save()

    @database_sync_to_async
    def handleTotalPoints(self, user: User) -> None:
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
        total_zero_loss = 0
        achievements = Achievements.objects.filter(
            requirement_type='win_with_zero_loss')
        if not achievements.exists():
            return
        last_match_ups = self.relevantGames(user, 'win_with_zero_loss')
        for matchUp in last_match_ups:
            winner = matchUp.Winner()
            loser_score = matchUp.first_player_score if\
                matchUp.first_player != winner else matchUp.second_player_score
            if winner == user and loser_score == 0:
                total_zero_loss += 1

        for achievement in achievements:
            if total_zero_loss >= achievement.requirement_value:
                user.achievements.add(achievement)
        user.save()

    @database_sync_to_async
    def handleTotalWins(self, user: User) -> None:
        total_wins = 0
        achievements = Achievements.objects.filter(
            requirement_type='total_wins')
        if not achievements.exists():
            return
        last_match_ups = self.relevantGames(user, 'total_wins')
        for matchUp in last_match_ups:
            winner = matchUp.Winner()
            if winner == user:
                total_wins += 1
        for achievement in achievements:
            if total_wins >= achievement.requirement_value:
                user.achievements.add(achievement)
        user.save()

    @database_sync_to_async
    def getNextRank(self, current_rank_order):
        try:
            return Ranks.objects.get(hierarchy_order=current_rank_order + 1)
        except Ranks.DoesNotExist:
            return None

    @database_sync_to_async
    def getPrevRank(self, current_rank_order):
        if current_rank_order <= 0:
            return None
        try:
            return Ranks.objects.get(hierarchy_order=current_rank_order - 1)
        except Ranks.DoesNotExist:
            return None

    async def handleUserAchievements(self, user: User):
        user.current_xp += self.IncrementingXpSteps
        user.total_xp += self.IncrementingXpSteps
        UserRank: Ranks = await database_sync_to_async(lambda: user.rank)()
        next_rank = await self.getNextRank(UserRank.hierarchy_order)
        if user.current_xp >= UserRank.xp_required and next_rank is not None:
            user.current_xp -= UserRank.xp_required
            user.rank = next_rank
        await database_sync_to_async(user.save)()
        await self.handleWinStreak(user)
        await self.handleTotalPoints(user)
        await self.handleZeroLoss(user)
        await self.handleTotalWins(user)

    async def handleLoserUser(self, user: User):
        user.current_xp -= self.DecrementingXpSteps
        user.total_xp -= self.DecrementingXpSteps
        UserRank: Ranks = await database_sync_to_async(lambda: user.rank)()
        prevRank = await self.getPrevRank(UserRank.hierarchy_order)
        if user.current_xp < 0:
            user.rank = prevRank
            user.current_xp = await database_sync_to_async(lambda: UserRank.xp_required)() + user.current_xp
        await database_sync_to_async(user.save)()
