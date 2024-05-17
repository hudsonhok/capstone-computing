from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import RegexValidator, ValidationError
from django.utils.translation import gettext_lazy as _
import re

class UserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        user = self.model(username=username, **extra_fields)
        user.is_active = True
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if not extra_fields.get('is_staff'):
            raise ValueError("Superuser must have is_staff = True")

        if not extra_fields.get('is_superuser'):
            raise ValueError("Superuser must have is_superuser = True")
        return self.create_user(username, password, **extra_fields)

class CustomUser(AbstractBaseUser, models.Model):
    alphanumeric_validator = RegexValidator(
        regex=r'^[A-Z]{3}\d{3}$',
        message='Employee ID must start with 3 uppercase letters denoting company followed by 3 digits.'
    )
    def password_validator(value):
        if len(value) < 8:
            raise ValidationError(_('Password must be at least 8 characters long.'))
        if not re.search(r'\d', value) or not re.search(r'[A-Za-z]', value) or not re.search(r'[!@#$%^&*]', value):
            raise ValidationError(_('Password must contain at least one letter, one number, and one special character.'))


    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(max_length=254, unique=True)
    employee_id = models.CharField(max_length=6, unique=True, validators=[alphanumeric_validator])
    username = models.CharField(max_length=128, unique=True)
    password = models.CharField(max_length=128, null=True, validators=[password_validator])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # Other fields for profile
    job_title = models.CharField(max_length=100, null=True, blank=True)
    office_location = models.CharField(max_length=100, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    supervisor = models.CharField(max_length=100, null=True, blank=True)
    profile_pic = models.ImageField(null=True, blank=True, upload_to="profile")

    #Fields for notification settings
    allowNotifications = models.BooleanField(default=False)
    notifyThrough = models.CharField(max_length=9, default="Messages")
    notifyforTasks = models.BooleanField(default=False)
    notifyforEvents = models.BooleanField(default=False)
    notifyforMessages = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'employee_id']

    objects = UserManager()

    """
    def getIDFromUsername(self, usernameSearch):
            user = CustomUser.objects.get(username=usernameSearch)
            return user.id
    """

    def __str__(self):
        return self.username

    def has_module_perms(self, app_label):
        return True

    def has_perm(self, perm, obj=None):
        return True
