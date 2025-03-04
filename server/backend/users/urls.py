from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstructorViewSet 

urlpatterns = [
    path('', InstructorViewSet.as_view({'get': 'list'}), name='all_instructors'),
]