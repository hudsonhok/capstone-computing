from .models import Attendance
from .serializers import AttendanceSerializer
from rest_framework import viewsets, permissions

class AttendanceMainAPI(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = AttendanceSerializer