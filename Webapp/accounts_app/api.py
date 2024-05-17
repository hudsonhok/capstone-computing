from django.shortcuts import render
from rest_framework.generics import UpdateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status, generics, permissions
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, UpdateUserSerializer, MessageEmailNotificationSerializer, EventEmailNotificationSerializer, ResetPasswordEmailRequestSerializer, SetNewPasswordSerializer
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import Util
from django.utils.encoding import smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.http import HttpResponsePermanentRedirect
import os
from django.db.models.functions import Substr

from knox import views as knox_views
from knox.models import AuthToken
from django.contrib.auth import login, get_user_model

User = get_user_model()

class UserAPI(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        # Create an instance of the RegisterSerializer
        serializer = self.get_serializer(data=request.data)
        # Validate the registration data using the serializer
        serializer.is_valid(raise_exception=True)
        # Save the new user by calling the save method on the serializer
        user = serializer.save()
        # Return a Response with user data and an authentication token
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        # Create an instance of the LoginSerializer
        serializer = self.get_serializer(data=request.data)
        
        # Validate the login data using the serializer
        serializer.is_valid(raise_exception=True)
        
        # Extract the validated user data from the serializer
        user = serializer.validated_data
        
        # Return a Response with serialized user data and an authentication token
        return Response({
            # Serialize and return user data
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            
            # Provide an authentication token for login
            "token": AuthToken.objects.create(user)[1]
        })

class UpdateUserAPI(UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
    
class AllUsersAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        users = get_user_model().objects.all().values()
        return Response({'users': users}, status=status.HTTP_200_OK)
    
class CompanyUsersAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        current_user = request.user
        current_company_prefix = current_user.employee_id[:3]

        # Filter users based on the prefix of their employee IDs
        users = get_user_model().objects.annotate(
            company_prefix=Substr('employee_id', 1, 3)
        ).filter(company_prefix=current_company_prefix).values()

        return Response({'users': users}, status=status.HTTP_200_OK)

class AllUsernamesAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        usernames = get_user_model().objects.values_list('username', flat=True)
        return Response({'usernames': usernames}, status=status.HTTP_200_OK)

# See https://www.youtube.com/watch?v=2kKwPk5qPUs&list=PLx-q4INfd95EsUuON1TIcjnFZSqUfMf7s&index=13
    
class CustomRedirect(HttpResponsePermanentRedirect):

    allowed_schemes = [os.environ.get('APP_SCHEME'), 'http', 'https']

class EventEmailNotification(generics.GenericAPIView):
    serializer_class = EventEmailNotificationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        participant_email = request.data.get('participant_email', '')

        if User.objects.filter(email=participant_email).exists():
            title = request.data.get('title', '')
            sender = request.data.get('sender', '')
            email_body = 'Hello, \nYou have been added to the event \"'+title+'\" as an participant. This event was created by user '+sender+'.'
            data = {'email_body': email_body, 'to_email': participant_email,
                    'email_subject': 'WorkPlaceWise Notification: New Event \"'+title+'\"'}
            Util.send_email(data)
        return Response({'Success': 'Email notification sent'}, status=status.HTTP_200_OK)
    
class MessageEmailNotification(generics.GenericAPIView):
    serializer_class = MessageEmailNotificationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        participant_email = request.data.get('participant_email', '')

        if User.objects.filter(email=participant_email).exists():
            title = request.data.get('title', '')
            number_of_discussionUsers = request.data.get('number_of_discussionUsers', 1)
            email_body = 'Hello, \nThere is a new message in the \"'+title+'\" Discussion that you are a part of with '+str(number_of_discussionUsers)+' other person/people.'
            data = {'email_body': email_body, 'to_email': participant_email,
                    'email_subject': 'WorkPlaceWise Notification: New Message in \"'+title+'\"'}
            Util.send_email(data)
        return Response({'Success': 'Email notification sent'}, status=status.HTTP_200_OK)

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        email = request.data.get('email', '')

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(
                request=request).domain
            relativeLink = reverse(
                'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})

            redirect_url = request.data.get('redirect_url', '')
            absurl = 'http://'+current_site + relativeLink
            email_body = 'Hello, \nPlease use the link below to reset your password  \n' + \
                absurl+"?redirect_url="+redirect_url
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reset your password'}
            Util.send_email(data)
        return Response({'Success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)


class PasswordTokenCheckAPI(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):

        redirect_url = request.GET.get('redirect_url')

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                if len(redirect_url) > 3:
                    return CustomRedirect(redirect_url+'?token_valid=False')
                else:
                    return CustomRedirect(os.environ.get('FRONTEND_URL', '')+'?token_valid=False')

            if redirect_url and len(redirect_url) > 3:
                return CustomRedirect(redirect_url+'?token_valid=True&message=Credentials Valid&uidb64='+uidb64+'&token='+token)
            else:
                return CustomRedirect(os.environ.get('FRONTEND_URL', '')+'?token_valid=False')

        except DjangoUnicodeDecodeError as identifier:
            try:
                if not PasswordResetTokenGenerator().check_token(user):
                    return CustomRedirect(redirect_url+'?token_valid=False')
                    
            except UnboundLocalError as e:
                return Response({'Error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)



class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'Success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
