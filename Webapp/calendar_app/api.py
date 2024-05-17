from .models import Event
from rest_framework import viewsets, generics, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import EventSerializer
from datetime import datetime, timedelta
from rest_framework.decorators import action

# The file contains the API for the calendar

class EventAPI(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = EventSerializer

    def get_queryset(self):
        return self.request.user.events.all()

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
        
    # Returns the amount of attended meetings given a time frame
    @action(detail=False, methods=['get'])
    def attended_meetings_count(self, request):
        time_range = request.query_params.get('time_range', 'week')
        today = datetime.now().date()
        if time_range == 'day':
            start_date = today - timedelta(days=1)
        elif time_range == 'month':
            start_date = today - timedelta(days=30)
        elif time_range == 'last_5_minutes':
            start_date = datetime.now() - timedelta(minutes=5)
        elif time_range == "all_time":
            start_date = None
        else:
            start_date = today - timedelta(days=7)

        if start_date is None:
            attended_meetings_count = self.get_queryset().filter(attended=True).count()
        else:
            attended_meetings_count = self.get_queryset().filter(attended=True, created_at__gte=start_date).count()
# Works for now with created_at but not with completed_at
        # attended_meetings_count = self.get_queryset().filter(attended=True, created_at__gte=start_date).count()

        return Response({'attended_meetings_count': attended_meetings_count}, status=status.HTTP_200_OK)
    
    # Returns the amount of unattended meetings given a time frame
    @action(detail=False, methods=['get'])
    def unattended_meetings_count(self, request):
        time_range = request.query_params.get('time_range', 'week')
        today = datetime.now().date()
        if time_range == 'day':
            start_date = today - timedelta(days=1)
        elif time_range == 'month':
            start_date = today - timedelta(days=30)
        elif time_range == 'last_5_minutes':
            start_date = datetime.now() - timedelta(minutes=5)
        elif time_range == "all_time":
            start_date = None
        else:
            start_date = today - timedelta(days=7)

        if start_date is None:
            unattended_meetings_count = self.get_queryset().filter(attended=False).count()
        else:
            unattended_meetings_count = self.get_queryset().filter(attended=False, created_at__gte=start_date).count()

        # unattended_meetings_count = self.get_queryset().filter(attended=False, created_at__gte=start_date).count()

        return Response({'unattended_meetings_count': unattended_meetings_count}, status=status.HTTP_200_OK)

class AllEventsAPI(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = EventSerializer

    def get_queryset(self):
        #return self.request.events.all()
        return Event.objects.all()

    def perform_create(self, serializer):
        serializer.save()
