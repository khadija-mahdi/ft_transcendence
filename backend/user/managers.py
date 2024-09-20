from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    def RetrieveRank(self, user):
        from user.models import Ranks, RankAchievement
        try:
            rank = Ranks.objects.get(pk=1)
            RankAchievement(user=user, rank=rank).save(self._db)
            return rank
        except Exception:
            return None

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.rank = self.RetrieveRank(user)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not extra_fields.get('is_superuser') or not extra_fields.get('is_staff'):
            raise ValueError(
                'Superuser must have is_staff=True and is_superuser=True')

        return self._create_user(email, password, **extra_fields)
