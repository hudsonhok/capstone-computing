from rest_framework import routers
from .api import DiscussionViewSet, MessageViewSet

router = routers.DefaultRouter()

router.register('api/discussions', DiscussionViewSet, 'discussions')
router.register('api/messages', MessageViewSet, 'messages')
# Gives us urls that we registered
urlpatterns = router.urls