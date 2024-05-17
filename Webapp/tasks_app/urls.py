from rest_framework import routers
from .api import TaskViewSet #import ProjectViewSet later
from django.urls import path

router = routers.DefaultRouter()

#router.register('api/projects', ProjectViewSet, 'projects')
router.register('api/tasks', TaskViewSet, 'tasks')

urlpatterns = [
    path('api/tasks/completed_tasks_count/', TaskViewSet.as_view({'get': 'completed_tasks_count'}), name='completed_tasks_count'),
    path('api/tasks/unfinished_tasks_count/', TaskViewSet.as_view({'get': 'unfinished_tasks_count'}), name='unfinished_tasks_count'),
]

urlpatterns += router.urls