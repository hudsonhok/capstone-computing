from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

# This file establishes the classes/models for calendar events

# Event class: contains info for calendar events, including the participants, date, and time.
class Event(models.Model):
    #id = models.CharField(max_length=256)
    title = models.CharField(max_length=200, default="")
    start = models.CharField(max_length=200, default="")
    end = models.CharField(max_length=200, default="", blank=True)
    allDay = models.BooleanField(max_length=200, default=False)
    creator = models.ForeignKey(User, related_name="events", on_delete=models.CASCADE, null=True)
    attended = models.BooleanField(max_length=200, default=False)
    description = models.CharField(max_length=500, default="", blank=True)
    
    # For time aspect of meetings:
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.completed_at:
            self.completed_at = timezone.now()  # Ensure completed_at is aware datetime
        super().save(*args, **kwargs)