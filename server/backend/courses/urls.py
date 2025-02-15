from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, CourseDetailView, add_course

urlpatterns = [
    path('', CourseViewSet.as_view({'get': 'list'}), name='all_courses'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('add/', add_course, name='add_course'),
]