from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate, get_user_model
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
import re
from django.contrib.auth.password_validation import validate_password
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_pic = validated_data.pop('profile_pic', None)

        user = CustomUser.objects.create_user(**validated_data)
        #user = CustomUser(**validated_data)

        if profile_pic:
            user.profile_pic = profile_pic

        #user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

class UpdateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('first_name',
                  'last_name',
                  'email',
                  'employee_id',
                  'username',
                  'password',
                  'job_title',
                  'office_location',
                  'department',
                  'phone_number',
                  'supervisor',
                  'profile_pic',
                  'allowNotifications',
                  'notifyThrough',
                  'notifyforTasks',
                  'notifyforEvents',
                  'notifyforMessages'

                  )

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Update only if a new password is provided
        if password:
            instance.set_password(password)

        # Update other fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.employee_id = validated_data.get('employee_id', instance.employee_id)
        instance.username = validated_data.get('username', instance.username)
        instance.job_title = validated_data.get('job_title', instance.job_title)
        instance.office_location = validated_data.get('office_location', instance.office_location)
        instance.department = validated_data.get('department', instance.department)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.supervisor = validated_data.get('supervisor', instance.supervisor)
        instance.profile_pic = validated_data.get('profile_pic', instance.profile_pic)

        instance.allowNotifications = validated_data.get('allowNotifications', instance.allowNotifications)
        instance.notifyThrough = validated_data.get('notifyThrough', instance.notifyThrough)
        instance.notifyforTasks = validated_data.get('notifyforTasks', instance.notifyforTasks)
        instance.notifyforEvents = validated_data.get('notifyforEvents', instance.notifyforEvents)
        instance.notifyforMessages = validated_data.get('notifyforMessages', instance.notifyforMessages)

        instance.save()
        # print(validated_data)
        return instance

    
# See https://www.youtube.com/watch?v=2kKwPk5qPUs&list=PLx-q4INfd95EsUuON1TIcjnFZSqUfMf7s&index=13

class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']

class EventEmailNotificationSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    title = serializers.CharField(max_length=500, required=False)
    sender = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']

class MessageEmailNotificationSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    title = serializers.CharField(max_length=500, required=False)
    number_of_discussionUsers = serializers.IntegerField(default=1, required=False)

    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)