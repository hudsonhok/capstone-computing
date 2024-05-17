from rest_framework import routers
from .api import AttendanceMainAPI

router = routers.DefaultRouter()

router.register("api/attendance", AttendanceMainAPI, "attendance")

urlpatterns = router.urls