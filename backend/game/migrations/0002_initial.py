# Generated by Django 4.2.16 on 2024-09-21 09:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournamentsregisteredplayers',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament_player', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='tournament',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='tournament',
            name='registered_users',
            field=models.ManyToManyField(through='game.TournamentsRegisteredPlayers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='tournament',
            name='streams',
            field=models.ManyToManyField(blank=True, to='game.stream'),
        ),
        migrations.AddField(
            model_name='stream',
            name='player1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='streaming_player1', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='stream',
            name='player2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='streaming_player2', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='matchup',
            name='Winner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='winner', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='matchup',
            name='first_player',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='first_player', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='matchup',
            name='second_player',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='second_player', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='matchup',
            name='tournament',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tournament_match_up', to='game.tournament'),
        ),
        migrations.AddField(
            model_name='brackets',
            name='player',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='player', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='brackets',
            name='tournament',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='tournament_bracket', to='game.tournament'),
        ),
    ]