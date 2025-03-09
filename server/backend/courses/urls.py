from django.urls import path
from .views import CourseViewSet, CourseDetailView, AddCourseView, UpdateContentView, UpdateDeleteCourseView

urlpatterns = [
    path('', CourseViewSet.as_view({'get': 'list'}), name='all_courses'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('add/', AddCourseView.as_view(), name='add_course'),
    path('update-delete/<int:course_id>/', UpdateDeleteCourseView.as_view(), name='update-delete-course'),
    path('content/<int:id>/', UpdateContentView.as_view(), name='update_content'),
]