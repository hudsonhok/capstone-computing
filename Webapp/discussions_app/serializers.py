from rest_framework import serializers
from .models import Discussion, Message
from django.contrib.auth import get_user_model
User = get_user_model()

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class DiscussionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Discussion
        fields = '__all__'