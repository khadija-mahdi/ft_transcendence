# Generated by Django 4.2.16 on 2024-09-25 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_notification_sender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='action',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]