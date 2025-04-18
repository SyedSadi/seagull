from django.urls import path
from .views import CourseViewSet, CourseDetailView, AddCourseView, UpdateContentView, UpdateDeleteCourseView, EnrollCourseView, EnrolledCoursesView, CourseContentsView, InstructorCoursesView, RateCourseView, AddContentAPIView, DeleteContentView

urlpatterns = [
    path('', CourseViewSet.as_view({'get': 'list'}), name='all_courses'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('add/', AddCourseView.as_view(), name='add_course'),
    path('update-delete/<int:course_id>/', UpdateDeleteCourseView.as_view(), name='update-delete-course'),
    path('content/update/<int:id>/', UpdateContentView.as_view(), name='update_content'),
    path('content/delete/<int:id>/', DeleteContentView.as_view(), name='delete_content'),
    path('enroll/<int:course_id>/', EnrollCourseView.as_view(), name='enroll_course'),
    path('enrolled/', EnrolledCoursesView.as_view(), name='get_enrolled_courses'),
    path('content/<int:course_id>/', CourseContentsView.as_view(), name='get_course_content'),
    path("by-instructor/", InstructorCoursesView.as_view(), name="instructor-courses"),
    path('<int:course_id>/rate/', RateCourseView.as_view(), name='course-rating'),
    path('content/add/', AddContentAPIView.as_view(), name='add-content'),
]