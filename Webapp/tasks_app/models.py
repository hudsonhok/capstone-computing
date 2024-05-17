from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

# Task model
# Includes parameters for the project associated, the task contents, the user who created it, timestamps for creation, and the completion status
class Task(models.Model):
    project = models.CharField(max_length=100)
    body = models.CharField(max_length=100)
    owner = models.ForeignKey(User, related_name="tasks", on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.completed_at:
            self.completed_at = timezone.now()  # Ensure completed_at is aware datetime
        super().save(*args, **kwargs)