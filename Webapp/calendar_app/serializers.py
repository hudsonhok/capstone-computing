from rest_framework import serializers
from .models import Event

# The file establishes the serializers for the calendar event models
# Helps connect frontend/backend together

class EventSerializer(serializers.ModelSerializer):
	class Meta:
		model = Event
		fields = '__all__'