# Generated by Django 5.0.2 on 2024-04-12 20:23

import accounts_app.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts_app', '0007_alter_customuser_notifythrough'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='password',
            field=models.CharField(max_length=128, null=True, validators=[accounts_app.models.CustomUser.password_validator]),
        ),
    ]
