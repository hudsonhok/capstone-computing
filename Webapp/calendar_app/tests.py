from django.test import TestCase
from .models import Event
from .serializers import EventSerializer
from accounts_app.models import CustomUser

class EventTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='user',
            password='password',
            email='usertest@gmail.com',
            employee_id='THE123'
        )
    
    def test_event_object_create(self):
        event = Event.objects.create(
                title = "Meeting",
                start = "09/24/2024",
                end = "",
                allDay = True,
                creator= self.user)
        self.assertEqual(event.title, 'Meeting')
        self.assertEqual(event.start, '09/24/2024')
        self.assertEqual(event.end, '')
        self.assertTrue(event.allDay)
        self.assertEqual(event.creator, self.user)
        self.assertTrue(isinstance(event, Event))

        event = {}
        self.assertFalse(isinstance(event, Event))

    def test_event_serializer(self):
        eventSerializer = EventSerializer(data={})
        self.assertTrue(eventSerializer.is_valid())

        eventData = {'title': 4, 'start': "09/24/2024", 'end': "09/24/2024", 'creator': self.user}
        eventSerializer = EventSerializer(data=eventData)
        self.assertFalse(eventSerializer.is_valid())
