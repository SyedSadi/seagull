import pytest
from rest_framework.test import APIClient
from rest_framework import status
from courses.models import Course, Enrollment, Rating
from users.models import User, Student, Instructor
from decouple import config

@pytest.mark.django_db
class TestCourseViews:

    def setup_user_and_course(self, student_username="student_user", instructor_username="instructor_user"):
        # Create users
        admin_user = User.objects.create_superuser(username="admin_user", password=config("TEST_PASSWORD"))
        student_user = User.objects.create_user(username=student_username, password=config("TEST_PASSWORD"))        
        instructor_user = User.objects.create_user(username=instructor_username, password=config("TEST_PASSWORD"))

        # Create instructor and student instances
        instructor = Instructor.objects.create(user=instructor_user)
        student = Student.objects.create(user=student_user)

        # Create course
        course = Course.objects.create(
            title="Test Course", 
            description="Test Description", 
            created_by=instructor, 
            duration=10, 
            difficulty="beginner", 
            subject="Math"
        )
        return admin_user, student_user, instructor_user, instructor, student, course

    def test_enroll_in_course(self):
        _, student_user, _, _, student, course = self.setup_user_and_course()
        client = APIClient()
        client.force_authenticate(user=student_user)

        # First-time enrollment (should succeed)
        response = client.post(f'/courses/enroll/{course.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert "Successfully enrolled" in response.data['message']


    def test_enroll_in_course_already_enrolled(self):
        _, student_user, _, _, student, course = self.setup_user_and_course()

        # Pre-create the enrollment
        Enrollment.objects.create(course=course, student=student)

        client = APIClient()
        client.force_authenticate(user=student_user)

        # Second attempt to enroll (should fail)
        response = client.post(f'/courses/enroll/{course.id}/')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['message'] == "Already enrolled"

    def test_enrolled_courses(self):
        _, student_user, _, _, student, course = self.setup_user_and_course()
        Enrollment.objects.create(course=course, student=student)
        client = APIClient()
        client.force_authenticate(user=student_user)
        response = client.get('/courses/enrolled/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0

    def test_instructor_courses(self):
        _, _, instructor_user, _, _, _ = self.setup_user_and_course()
        client = APIClient()
        client.force_authenticate(user=instructor_user)
        response = client.get('/courses/by-instructor/')
        assert response.status_code == status.HTTP_200_OK
        assert 'courses' in response.data

    def test_instructor_no_courses(self):
        _, _, instructor_user, _, _, _ = self.setup_user_and_course(instructor_username="new_instructor")
        client = APIClient()
        client.force_authenticate(user=instructor_user)
        response = client.get('/courses/by-instructor/')
        assert response.status_code == status.HTTP_200_OK

    def test_rate_course(self):
        _, student_user, _, _, student, course = self.setup_user_and_course()
        Enrollment.objects.create(course=course, student=student)
        client = APIClient()
        client.force_authenticate(user=student_user)
        rating_data = {"rating": 4}
        response = client.post(f'/courses/{course.id}/rate/', rating_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['message'] == "Rating created successfully."
        assert response.data['rating'] == 4

    def test_rate_course_not_enrolled(self):
        _, student_user, _, _, _, course = self.setup_user_and_course()
        client = APIClient()
        client.force_authenticate(user=student_user)
        rating_data = {"rating": 4}
        response = client.post(f'/courses/{course.id}/rate/', rating_data, format='json')
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['detail'] == "You must be enrolled in this course to rate it."

    def test_get_course_rating(self):
        _, student_user, _, _, student, course = self.setup_user_and_course()
        Enrollment.objects.create(course=course, student=student)
        Rating.objects.create(course=course, user=student_user, rating=5)
        client = APIClient()
        client.force_authenticate(user=student_user)
        response = client.get(f'/courses/{course.id}/rate/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['rating'] == 5
