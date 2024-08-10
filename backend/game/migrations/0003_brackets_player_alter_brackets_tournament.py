# Generated by Django 5.0.4 on 2024-05-02 04:36

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_rename_turnementsregistredplayers_tournamentsregisteredplayers_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='brackets',
            name='player',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='player', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='brackets',
            name='tournament',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='tournament_bracket', to='game.tournament'),
        ),
    ]