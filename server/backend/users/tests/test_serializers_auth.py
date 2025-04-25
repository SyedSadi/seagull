import pytest
from rest_framework.exceptions import ValidationError
from users.models import User, Instructor, Student
from users.serializers import RegisterSerializer, LoginSerializer
from decouple import config

@pytest.mark.django_db
class TestUserSerializers:

    def test_register_student_serializer(self):
        user_data = {
            'username': 'teststudent',
            'email': 'student@example.com',
            'password': config("TEST_PASSWORD"),
            'role': 'student',
            'bio': 'Student bio here.'
        }
        serializer = RegisterSerializer(data=user_data)
        assert serializer.is_valid(), serializer.errors

        user = serializer.save()

        # Check basic user attributes
        assert user.username == user_data['username']
        assert user.email == user_data['email']
        assert user.role == user_data['role']
        assert user.bio == user_data['bio']
        assert user.check_password(user_data['password'])

        # Check student profile created
        student = Student.objects.get(user=user)
        assert student.course_completed == 0
        assert student.course_enrolled == 0

    @pytest.mark.django_db
    def test_register_instructor_serializer(self):
        user_data = {
            'username': 'testinstructor',
            'email': 'instructor@example.com',
            'password': config("TEST_PASSWORD"),
            'role': 'instructor',
            'bio': 'Instructor bio here.'
        }
        serializer = RegisterSerializer(data=user_data)
        assert serializer.is_valid(), serializer.errors

        user = serializer.save()

        # Check basic user attributes
        assert user.username == user_data['username']
        assert user.email == user_data['email']
        assert user.role == user_data['role']
        assert user.bio == user_data['bio']
        assert user.check_password(user_data['password'])

        # Check instructor profile created
        instructor = Instructor.objects.get(user=user)
        assert instructor is not None

    def test_register_serializer_invalid_role(self):
        user_data = {
            'username': 'invalidroleuser',
            'email': 'invalidroleuser@example.com',
            'password': config("TEST_PASSWORD"),
            'role': 'admin',
            'bio': 'This is an invalid role bio.',
        }
        serializer = RegisterSerializer(data=user_data)
        assert not serializer.is_valid()
        assert 'role' in serializer.errors

    def test_login_serializer_valid(self):
        user = User.objects.create_user(username='testuser', password=config("TEST_PASSWORD"), role='student', email='testuser@example.com')
        login_data = {
            'username': 'testuser',
            'password': config("TEST_PASSWORD"),
        }
        serializer = LoginSerializer(data=login_data)
        assert serializer.is_valid()
        response_data = serializer.validated_data
        assert 'refresh' in response_data
        assert 'access' in response_data
        assert 'user' in response_data
        assert response_data['user']['role'] == 'student'

    def test_login_serializer_invalid_credentials(self):
        login_data = {
            'username': 'nonexistentuser',
            'password': 'wrongpassword',
        }
        serializer = LoginSerializer(data=login_data)
        with pytest.raises(ValidationError):
            serializer.is_valid(raise_exception=True)
