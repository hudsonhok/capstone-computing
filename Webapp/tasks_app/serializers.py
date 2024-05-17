from rest_framework import serializers
from tasks_app.models import Task 
import datetime

# Task Serializer
class TaskSerializer(serializers.ModelSerializer):
  class Meta:
    model = Task 
    fields = '__all__'
  def update(self, instance, validated_data):
        if validated_data.get('completed', False):
            instance.completed_at = datetime.datetime.now()
        return super().update(instance, validated_data)