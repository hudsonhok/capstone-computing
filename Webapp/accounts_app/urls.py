from django.urls import path
from .api import UserAPI, RegisterAPI, LoginAPI, UpdateUserAPI, AllUsersAPI, AllUsernamesAPI, MessageEmailNotification, EventEmailNotification, CompanyUsersAPI, RequestPasswordResetEmail, PasswordTokenCheckAPI, SetNewPasswordAPIView
from knox.views import LogoutView
from django.contrib.auth import views as auth_views
from rest_framework import routers
from .api import AllUsersAPI

urlpatterns = [
    path('api/user-info/', UserAPI.as_view(), name='user_info'),
    path('api/register/', RegisterAPI.as_view(), name='register'),
    path('api/login/', LoginAPI.as_view(), name='login'),
    path('api/update-user/', UpdateUserAPI.as_view(), name='update_user'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/all-users/', AllUsersAPI.as_view(), name='all_users'),
    path('api/company-users/', CompanyUsersAPI.as_view(), name='company_users'),
    path('api/all-usernames', AllUsernamesAPI.as_view(), name='all_usernames'),
    path('api/event-email-notification', EventEmailNotification.as_view(), name="event_email_notification"),
    path('api/message-email-notification', MessageEmailNotification.as_view(), name="message_email_notification"),
    path('api/request-reset-email/', RequestPasswordResetEmail.as_view(), name="request-reset-email"),
    path('api/password-reset/<uidb64>/<token>/', PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('api/password-reset-complete/', SetNewPasswordAPIView.as_view(), name='password-reset-complete')
]