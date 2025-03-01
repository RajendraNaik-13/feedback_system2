from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BoardViewSet, FeedbackViewSet

router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'feedback', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]