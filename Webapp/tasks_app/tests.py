from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from tasks_app.models import Task

User = get_user_model()

class TaskTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='TestingAccount', password='Test123!@#')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.task_data = {
            'project': 'Test Project',
            'body': 'Test Body',
            'owner': self.user.id
        }

    def test_task_creation(self):
        initial_task_count = Task.objects.count()
        response = self.client.post('/api/tasks/', self.task_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Task.objects.count(), initial_task_count + 1)

    def test_task_editing(self):
        task = Task.objects.create(project='Original Project', body='Original Body', owner=self.user)
        updated_data = {
            'project': 'Updated Project',
            'body': 'Updated Body'
        }
        response = self.client.put(f'/api/tasks/{task.id}/', updated_data)
        self.assertEqual(response.status_code, 200)
        task.refresh_from_db()
        self.assertEqual(task.project, updated_data['project'])
        self.assertEqual(task.body, updated_data['body'])

    def test_task_deletion(self):
        task = Task.objects.create(project='Test Project', body='Test Body', owner=self.user)
        initial_task_count = Task.objects.count()
        response = self.client.delete(f'/api/tasks/{task.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Task.objects.count(), initial_task_count - 1)
