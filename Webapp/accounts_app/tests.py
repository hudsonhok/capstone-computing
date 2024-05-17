from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, UpdateUserSerializer

class CustomUserModelTest(TestCase):

    def test_create_user(self):
        user = CustomUser.objects.create_user(
            username='TestingAccount',
            password='Test123!@#',
            email='test@example.com',
            employee_id='TES123'
        )
        self.assertEqual(user.username, 'TestingAccount')
        self.assertTrue(user.check_password('Test123!@#'))
        self.assertTrue(user.is_active)

    def test_create_superuser(self):
        admin = CustomUser.objects.create_superuser(
            username='admin',
            password='Test123!@#',
            email='admin@example.com',
            employee_id='TES123'
        )
        self.assertEqual(admin.username, 'admin')
        self.assertTrue(admin.check_password('Test123!@#'))
        self.assertTrue(admin.is_active)
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)


class RegisterSerializerTest(TestCase):

    def test_valid_data(self):
        serializer = RegisterSerializer(data={
            'username': 'TestingAccount',
            'password': 'Test123!@#',
            'email': 'test@example.com',
            'employee_id': 'TES123'
        })
        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        serializer = RegisterSerializer(data={})
        self.assertFalse(serializer.is_valid())

class LoginSerializerTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user(
            username='TestingAccount',
            password='Test123!@#',
            email='test@example.com',
            employee_id='TES123'
        )
        self.login_url = reverse('login')
        self.login_data = {'username': 'TestingAccount', 'password': 'Test123!@#'}

    def test_valid_login(self):
        serializer = LoginSerializer(data=self.login_data)
        self.assertTrue(serializer.is_valid())

        response = self.client.post(self.login_url, self.login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_invalid_login(self):
        invalid_data = {'username': 'TestingAccount', 'password': 'wrongpassword'}
        serializer = LoginSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())

        response = self.client.post(self.login_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('token', response.data)
        self.assertNotIn('user', response.data)