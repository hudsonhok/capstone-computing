# Generated by Django 4.2.6 on 2024-04-12 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('discussions_app', '0004_discussion_created_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='discussion',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
