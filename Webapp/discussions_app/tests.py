from django.test import TestCase
from django.urls import reverse, resolve
from .models import Discussion, Message
from .serializers import DiscussionSerializer, MessageSerializer
from .api import DiscussionViewSet, MessageViewSet
from .urls import urlpatterns
from accounts_app.models import CustomUser

class TestDiscussions(TestCase):
    def setUp(self):
        self.testUser = CustomUser.objects.create(
            username='testuser',
            password='testpassword',
            email='test@example.com',
            employee_id='12345'
        )
        self.testDiscussion = Discussion.objects.create(title= 'Title',created_by= self.testUser)
        self.testDiscussion.users.add(self.testUser)
        self.testMessage = Message.objects.create(discussion= self.testDiscussion, sender= self.testUser, content= 'Content')


    def test_discussion_model(self):
        self.assertEqual(self.testDiscussion.title, 'Title')

    def test_message_model(self):
        self.assertEqual(self.testMessage.content, 'Content')

    def test_discussion_serializer(self):
        serializer = DiscussionSerializer(data={"title": 'Title', "users": [self.testUser.id], "created_by": self.testUser.id})
        if not serializer.is_valid():
            print(serializer.errors)
        self.assertTrue(serializer.is_valid())

        serializer = DiscussionSerializer(data={})
        self.assertFalse(serializer.is_valid())

    def test_message_serializer(self):
        serializer = MessageSerializer(data={"discussion": self.testDiscussion.id, "sender": self.testUser.id, "content": 'Content'})
        if not serializer.is_valid():
            print(serializer.errors)
        self.assertTrue(serializer.is_valid())

        serializer = MessageSerializer(data={})
        self.assertFalse(serializer.is_valid())

    def test_discussion_url(self):
        testUrl = reverse('discussions-list')
        self.assertEqual(resolve(testUrl).func.cls, DiscussionViewSet)

    def test_message_url(self):
        testUrl = reverse('messages-list')
        self.assertEqual(resolve(testUrl).func.cls, MessageViewSet)