import pytest
from rest_framework.exceptions import ValidationError
from users.models import User, Instructor
from users.serializers import UserSerializer, InstructorSerializer

@pytest.mark.django_db
class TestUserSerializers:

    def test_user_serializer(self):
        user = User.objects.create_user(username='testuser', password='testpass123', role='student', email='testuser@example.com', bio='This is a test bio.')
        serializer = UserSerializer(user)
        assert serializer.data['id'] == user.id
        assert serializer.data['username'] == user.username
        assert serializer.data['email'] == user.email
        assert serializer.data['role'] == user.role
        assert serializer.data['bio'] == user.bio
        assert serializer.data['is_superuser'] == user.is_superuser

    def test_instructor_serializer(self):
        user = User.objects.create_user(username='instructor1', password='testpass123', role='instructor', email='instructor1@example.com')
        instructor = Instructor.objects.get(user=user)
        serializer = InstructorSerializer(instructor)
        assert serializer.data['id'] == instructor.id
        assert serializer.data['name'] == user.username
        assert serializer.data['designation'] == instructor.designation
        assert serializer.data['university'] == instructor.university

    def test_instructor_serializer_missing_user(self):
        instructor = Instructor(designation='Professor', university='University of Science')
        try:
            InstructorSerializer(instructor).data
        except ValidationError as e:
            assert 'user' in str(e)

    def test_user_serializer_invalid_data(self):
        invalid_data = {
            'username': '',
            'email': 'invalidemail',
        }
        serializer = UserSerializer(data=invalid_data)
        assert not serializer.is_valid()
        assert 'username' in serializer.errors
        assert 'email' in serializer.errors
