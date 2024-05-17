from django.apps import AppConfig


class AccountsAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts_app'

    #Signal for email notifications
    #def ready(self):
    #    from . import signals
