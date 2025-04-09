import pytest
from rest_framework.test import APIClient
from rest_framework import status
from courses.models import Course, Enrollment, Rating
from users.models import User, Student, Instructor


@pytest.mark.django_db
class TestCourseViews:

    def test_enroll_in_course(self):
        admin_user = User.objects.create_superuser(username="admin_user", password="admin")
        student_user = User.objects.create_user(username="student_user", password="studentpass")        
        instructor_user = User.objects.create_user(username="instructor_user", password="instructorpass")
        instructor = Instructor.objects.create(user=instructor_user)
        course = Course.objects.create(
            title="Test Course", 
            description="Test Description", 
            created_by=instructor, 
            duration=10, 
            difficulty="beginner", 
            subject="Math"
        )
        student = Student.objects.create(user=student_user)
        Enrollment.objects.create(course=course, student=student)
        client = APIClient()
        client.force_authenticate(user=student_user)
        response = client.post(f'/courses/enroll/{course.id}/')        
        assert response.status_code == status.HTTP_200_OK
    
    def test_enroll_in_course_already_enrolled(self):
        admin_user = User.objects.create_superuser(username="admin_user", password="admin")
        student_user = User.objects.create_user(username="student_user", password="studentpass")        
        instructor_user = User.objects.create_user(username="instructor_user", password="instructorpass")
        instructor = Instructor.objects.create(user=instructor_user)
        course = Course.objects.create(
            title="Test Course", 
            description="Test Description", 
            created_by=instructor, 
            duration=10, 
            difficulty="beginner", 
            subject="Math"
        )
        student = Student.objects.create(user=student_user)
        Enrollment.objects.create(course=course, student=student)
        client = APIClient()
        client.force_authenticate(user=student_user)
        response = client.post(f'/courses/enroll/{course.id}/')        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['message'] == "Already enrolled"

    
    def test_enrolled_courses(self):
        admin_user = User.objects.create_superuser(username="admin_user", password="admin")
        student_user = User.objects.create_user(username="student_user", password="studentpass")        
        instructor_user = User.objects.create_user(username="instructor_user", password="instructorpass")
        instructor = Instructor.objects.create(user=instructor_user)
        course = Course.objects.create(
            title="Test Course", 
            description="Test Description", 
            created_by=instructor, 
            duration=10, 
            difficulty="beginner", 
            subject="Math"
        )
        student = Student.objects.create(user=student_user)
        Enrollment.objects.create(course=course, student=student)
        client = APIClient()
        client.force_authenticate(user=student_user)
        response = client.get('/courses/enrolled/')        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0

    
    def test_instructor_courses(self):
        admin_user = User.objects.create_superuser(username="admin_user", password="admin")
        instructor_user = User.objects.create_user(username="instructor_user", password="password")        
        instructor = Instructor.objects.create(user=instructor_user)
        course = Course.objects.create(
            title="Test Course", 
            description="Test Description", 
            created_by=instructor, 
            duration=10, 
            difficulty="beginner", 
            subject="Math"
        )
        client = APIClient()
        client.force_authenticate(user=instructor_user)
        response = client.get('/courses/by-instructor/')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'courses' in response.data

    
    def test_instructor_no_courses(self):
        admin_user = User.objects.create_superuser(username="admin_user", password="admin")
        instructor_user = User.objects.create_user(username="instructor_user", password="password")        
        instructor = Instructor.objects.create(user=instructor_user)
        client = APIClient()
        client.force_authenticate(user=instructor_user)
        response = client.get('/courses/by-instructor/')        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['message'] == "No courses found for this instructor."

    
    def test_rate_course(self):
        admin_user = User.objects.create_superuser(username="admin_user", password="admin")
        student_user = User.objects.create_user(username="student_user", password="studentpass")        
        instructor_user = User.objects.create_user(username="instructor_user", password="password")
        instructor = Instructor.objects.create(user=instructor_user)
        course = Course.objects.create(
            title="Test Course", 
            description="Test Description", 
            created_by=instructor, 
            duration=10, 
            difficulty="beginner", 
            subject="Math"
        )
        student = Student.objects.create(user=student_user)
        Enrollment.objects.create(course=course, student=student)
        client = APIClient()
        client.force_authenticate(user=student_user)
        rating_data = {"rating": 4}
        response = client.post(f'/courses/{course.id}/rate/', rating_data, format='json')        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['message'] == "Rating created successfully."
        assert response.data['rating'] == 4

    def test_rate_course_not_enrolled(self):
        admin_user = User.objects.create_superuser(username="admin_user", password="admin")
        student_user = User.objects.create_user(username="student_user", password="studentpass")        
        instructor_user = User.objects.create_user(username="instructor_user", password="password")
        instructor = Instructor.objects.create(user=instructor_user)
        course = Course.objects.create(
            title="Test Course", 
            description="Test Description", 
            created_by=instructor, 
            duration=10, 
            difficulty="beginner", 
            subject="Math"
        )
        client = APIClient()
        client.force_authenticate(user=student_user)
        rating_data = {"rating": 4}
        response = client.post(f'/courses/{course.id}/rate/', rating_data, format='json')        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['error'] == "You must be enrolled in this course to rate it."

    
    def test_get_course_rating(self):
        admin_user = User.objects.create_superuser(username="admin_user", password="admin")
        student_user = User.objects.create_user(username="student_user", password="studentpass")        
        instructor_user = User.objects.create_user(username="instructor_user", password="password")
        instructor = Instructor.objects.create(user=instructor_user)
        course = Course.objects.create(
            title="Test Course", 
            description="Test Description", 
            created_by=instructor, 
            duration=10, 
            difficulty="beginner", 
            subject="Math"
        )
        student = Student.objects.create(user=student_user)
        Enrollment.objects.create(course=course, student=student)
        Rating.objects.create(course=course, user=student_user, rating=5)
        client = APIClient()
        client.force_authenticate(user=student_user)
        response = client.get(f'/courses/{course.id}/rate/')        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['rating'] == 5