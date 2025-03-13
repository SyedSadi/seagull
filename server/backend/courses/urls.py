from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, CourseDetailView, AddCourseView, UpdateContentView

urlpatterns = [
    path('', CourseViewSet.as_view({'get': 'list'}), name='all_courses'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('add/', AddCourseView.as_view(), name='add_course'),
    path('content/<int:id>/', UpdateContentView.as_view(), name='update_content'),
]