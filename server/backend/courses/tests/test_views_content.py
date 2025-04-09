import pytest
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User, Instructor, Student
from courses.models import Course, Enrollment, CourseContents
from decouple import config

@pytest.mark.django_db
class TestCourseContentViews:

    def test_get_course_content(self):
        admin_user = User.objects.create_superuser(username="admin", password=config("TEST_PASSWORD"))
        student_user = User.objects.create_user(username="student", password=config("TEST_PASSWORD"))
        instructor_user = User.objects.create_user(username="instructor", password=config("TEST_PASSWORD"))
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
        content = CourseContents.objects.create(
            title="Test Content",
            content_type="video", 
            url="https://example.com/video", 
            text_content="This is some text content", 
            course=course
        )

        client = APIClient()
        client.force_authenticate(user=student_user)
        response = client.get(f'/courses/content/{course.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0 


    def test_get_course_content_not_enrolled(self):
        admin_user = User.objects.create_superuser(username="admin", password=config("TEST_PASSWORD"))
        student_user = User.objects.create_user(username="student", password=config("TEST_PASSWORD"))
        instructor_user = User.objects.create_user(username="instructor", password=config("TEST_PASSWORD"))
        instructor = Instructor.objects.create(user=instructor_user)
        student = Student.objects.create(user=student_user)
        course = Course.objects.create(
            title="Test Course",
            description="Test Description",
            created_by=instructor,
            duration=10,
            difficulty="beginner",
            subject="Math"
        )
        content = CourseContents.objects.create(
            title="Test Content",
            content_type="pdf",  
            url="https://example.com/pdf", 
            text_content="This is some PDF content",  
            course=course
        )

        client = APIClient()
        client.force_authenticate(user=student_user)
        response = client.get(f'/courses/content/{course.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0 

    
    def test_add_course_content(self):
        admin_user = User.objects.create_superuser(username="admin", password=config("TEST_PASSWORD"))
        instructor_user = User.objects.create_user(username="instructor", password=config("TEST_PASSWORD"))
        instructor = Instructor.objects.create(user=instructor_user)

        course = Course.objects.create(
            title="Test Course",
            description="Test Description",
            created_by=instructor,
            duration=10,
            difficulty="beginner",
            subject="Math"
        )
        content_data = {
            "title": "New Video Content",
            "content_type": "video",  
            "url": "https://example.com/video",  
            "text_content": "",  
            "course": course.id
        }
        client = APIClient()
        client.force_authenticate(user=admin_user)
        response = client.post('/courses/content/add/', content_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == "New Video Content"
        assert response.data['content_type'] == "video"
        assert response.data['url'] == "https://example.com/video"

    
    def test_update_course_content(self):
        admin_user = User.objects.create_superuser(username="admin", password=config("TEST_PASSWORD"))
        instructor_user = User.objects.create_user(username="instructor", password=config("TEST_PASSWORD"))
        instructor = Instructor.objects.create(user=instructor_user)
        course = Course.objects.create(
            title="Test Course",
            description="Test Description",
            created_by=instructor,
            duration=10,
            difficulty="beginner",
            subject="Math"
        )
        content = CourseContents.objects.create(
            title="Old Content",
            content_type="pdf", 
            url="https://example.com/old-pdf", 
            text_content="Old content details",
            course=course
        )
        updated_data = {
            "title": "Updated Content",
            "content_type": "text",  
            "url": "https://example.com/updated-text", 
            "text_content": "Updated content details"
        }
        client = APIClient()
        client.force_authenticate(user=admin_user)
        response = client.put(f'/courses/content/update/{content.id}/', updated_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == "Updated Content"
        assert response.data['content_type'] == "text"
        assert response.data['url'] == "https://example.com/updated-text"
        assert response.data['text_content'] == "Updated content details"

    
    def test_delete_course_content(self):
        admin_user = User.objects.create_superuser(username="admin", password=config("TEST_PASSWORD"))
        instructor_user = User.objects.create_user(username="instructor", password=config("TEST_PASSWORD"))
        instructor = Instructor.objects.create(user=instructor_user)
        course = Course.objects.create(
            title="Test Course",
            description="Test Description",
            created_by=instructor,
            duration=10,
            difficulty="beginner",
            subject="Math"
        )
        content = CourseContents.objects.create(
            title="Content to Delete",
            content_type="article",
            url="https://example.com/article", 
            text_content="This is article content",
            course=course
        )
        client = APIClient()
        client.force_authenticate(user=admin_user)
        response = client.delete(f'/courses/content/delete/{content.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert CourseContents.objects.filter(id=content.id).count() == 0