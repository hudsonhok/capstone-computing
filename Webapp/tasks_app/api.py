from tasks_app.models import Task
from rest_framework import viewsets, permissions, status
from .serializers import TaskSerializer
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import datetime, timedelta

# Task Viewset
class TaskViewSet(viewsets.ModelViewSet):
    # A user can only access their own tasks
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = TaskSerializer

    # Grabs all tasks
    def get_queryset(self):
        return self.request.user.tasks.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def completed_tasks_count(self, request):
        time_range = request.query_params.get('time_range', 'week')
        today = datetime.now().date()
        if time_range == 'day':
            start_date = today - timedelta(days=1)
        elif time_range == 'month':
            start_date = today - timedelta(days=30)
        elif time_range == 'last_5_minutes':
            start_date = datetime.now() - timedelta(minutes=5)
        elif time_range == 'all_time':
            start_date = None
        else:
            start_date = today - timedelta(days=7)

        if start_date is None:
            completed_tasks_count = self.get_queryset().filter(completed=True).count()
        else:
            completed_tasks_count = self.get_queryset().filter(completed=True, completed_at__gte=start_date).count()
        
        return Response({'completed_tasks_count': completed_tasks_count}, status=status.HTTP_200_OK)
    @action(detail=False, methods=['get'])
    def unfinished_tasks_count(self, request):
        time_range = request.query_params.get('time_range', 'week')
        today = datetime.now().date()
        if time_range == 'day':
            start_date = today - timedelta(days=1)
        elif time_range == 'month':
            start_date = today - timedelta(days=30)
        elif time_range == 'last_5_minutes':
            start_date = datetime.now() - timedelta(minutes=5)
        elif time_range == 'all_time':
            start_date = None
        else:
            start_date = today - timedelta(days=7)

        if start_date is None:
            unfinished_tasks_count = self.get_queryset().filter(completed=False).count()
        else:
            unfinished_tasks_count = self.get_queryset().filter(completed=False, completed_at__gte=start_date).count()
        
        return Response({'unfinished_tasks_count': unfinished_tasks_count}, status=status.HTTP_200_OK)
