from django.db import models
import uuid

class Attendance(models.Model):
    def __init__(self, user_id, total_tasks, completed_tasks, on_time_tasks, meetings_attended, excused_absenses, unexcused_absenses):
        self.user_id = user_id
        self.total_tasks = total_tasks
        self.completed_tasks = completed_tasks
        self.on_time_tasks = on_time_tasks
        self.meetings_attended = meetings_attended
        self.excused_absenses = excused_absenses
        self.unexcused_absenses = unexcused_absenses
    
    user_id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    total_tasks = models.IntegerField
    completed_tasks = models.IntegerField
    on_time_tasks = models.IntegerField
    meetings_attended = models.IntegerField
    excused_absenses = models.IntegerField
    unexcused_absenses = models.IntegerField