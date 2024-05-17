'''
from django.dispatch import receiver
from django.db.models import signals
from tasks_app.models import Task
from discussions_app.models import Discussion
from calendar_app.models import Event
from django.contrib.auth.models import User
from django.core.mail import send_mail

@receiver(signals.post_save, sender=Event)
def send_email_notif_meetingrequest(sender, instance, created, **kwargs):
    print('signal is sent')
    subject = "You have been invited to a meeting"
    send_mail(subject, '', None, 
    ['receiver@gmail.com'], fail_silently=False,)

@receiver(signals.post_save, sender=Discussion)
def send_email_notif_message(sender, instance, created, **kwargs):
    print('signal is sent')
    subject = "You have been invited to a discussion"
    send_mail(subject, '', None, 
    ['receiver@gmail.com'], fail_silently=False,)


Commented temporarily
@receiver(signals.post_save, sender=Task)
def send_email_notif_task(sender, instance, created, **kwargs):
    print('signal is sent')
    subject = "A task has been created for you"
    send_mail(subject, '', None, 
    ['receiver@gmail.com'], fail_silently=False,)

@receiver(signals.post_save, sender=Task)
def send_email_notif_taskdeadlines(sender, instance, created, **kwargs):
    print('signal is sent')
    subject = "A task deadline is approaching"
    send_mail(subject, '', None, 
    ['receiver@gmail.com'], fail_silently=False,)
'''