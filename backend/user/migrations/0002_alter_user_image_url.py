# Generated by Django 4.2.16 on 2024-09-26 19:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image_url',
            field=models.URLField(blank=True, default='/media/public/default/default-profile.jpeg', null=True),
        ),
    ]
