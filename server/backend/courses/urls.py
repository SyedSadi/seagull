from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, CourseContentsViewSet

router = DefaultRouter()
router.register('courses', CourseViewSet)
router.register('contents', CourseContentsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
