from django.urls import path, include
from rest_framework import routers
from .api import EventAPI, AllEventsAPI

router = routers.DefaultRouter()

router.register('api/event', EventAPI, 'events')
router.register('api/all-events', AllEventsAPI, 'events')


urlpatterns = [
    path('api/event/attended_meetings_count/', EventAPI.as_view({'get': 'attended_meetings_count'}), name='attended_meetings_count'),
    path('api/event/unattended_meetings_count/', EventAPI.as_view({'get': 'unattended_meetings_count'}), name='unattended_meetings_count'),
]
urlpatterns += router.urls