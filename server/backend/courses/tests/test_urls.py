import pytest
from django.urls import reverse, resolve
from courses.views import (
    CourseViewSet,
    CourseDetailView,
    AddCourseView,
    UpdateDeleteCourseView,
    UpdateContentView,
    DeleteContentView,
    EnrollCourseView,
    EnrolledCoursesView,
    CourseContentView,
    InstructorCoursesView,
    RateCourseView,
    AddContentAPIView,
)
from courses.models import Course

@pytest.mark.django_db
@pytest.mark.parametrize(
    ("name", "kwargs", "expected_view"),
    [
        ("all_courses", {}, CourseViewSet),
        ("course_detail", {"pk": 1}, CourseDetailView),
        ("add_course", {}, AddCourseView),
        ("update-delete-course", {"course_id": 1}, UpdateDeleteCourseView),
        ("update_content", {"id": 1}, UpdateContentView),
        ("delete_content", {"id": 1}, DeleteContentView),
        ("enroll_course", {"course_id": 1}, EnrollCourseView),
        ("get_enrolled_courses", {}, EnrolledCoursesView),
        ("get_course_content", {"course_id": 1}, CourseContentView),
        ("instructor-courses", {}, InstructorCoursesView),
        ("course-rating", {"course_id": 1}, RateCourseView),
        ("add-content", {}, AddContentAPIView),
    ]
)
def test_course_urls(client, name, kwargs, expected_view):
    url = reverse(name, kwargs=kwargs)
    resolved = resolve(url)

    # Handle ViewSet (which becomes a function)
    if hasattr(resolved.func, "view_class"):
        assert resolved.func.view_class == expected_view
    else:
        # For viewsets or function-based views
        assert expected_view.__name__ in resolved.func.__name__

    response = client.get(url)
    assert response.status_code in [200, 404, 403, 401]
