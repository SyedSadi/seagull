import pytest
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from users.models import User
from django.contrib.auth import get_user_model
from users.serializers import CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer, DashboardStatsSerializer
from decouple import config
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

@pytest.mark.django_db
class TestCustomTokenObtainPairSerializer:

    def test_successful_login_returns_tokens_and_user_data(self):
        user = User.objects.create_user(
            username="testuser",
            password="strongpass123",
            email="test@example.com",
            is_active=True,
            role="student"
        )
        serializer = CustomTokenObtainPairSerializer(data={
            "username": "testuser",
            "password": "strongpass123"
        })
        assert serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        assert 'access' in data
        assert 'refresh' in data
        assert data['user']['username'] == "testuser"
        assert data['user']['email'] == "test@example.com"

    def test_login_inactive_user_should_fail(self):
        user = User.objects.create_user(
            username="inactiveuser",
            password="testpass123",
            email="inactive@example.com",
            is_active=False,
            role="student"
        )
        serializer = CustomTokenObtainPairSerializer(data={
            "username": "inactiveuser",
            "password": "testpass123"
        })
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Please verify your email" in str(exc_info.value)

    def test_login_non_existent_user_should_fail(self):
        serializer = CustomTokenObtainPairSerializer(data={
            "username": "ghost",
            "password": "doesnotmatter"
        })
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "No user found with this username" in str(exc_info.value)

    def test_login_wrong_password_should_fail(self):
        user = User.objects.create_user(
            username="testuser2",
            password="correctpass",
            email="test2@example.com",
            is_active=True,
            role="student"
        )
        serializer = CustomTokenObtainPairSerializer(data={
            "username": "testuser2",
            "password": "wrongpass"
        })
        with pytest.raises(AuthenticationFailed) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "No active account found with the given credentials" in str(exc_info.value)


@pytest.mark.django_db
class TestCustomTokenSerializers:

    def test_custom_token_refresh_serializer(self):
        user = User.objects.create_user(username='testuser', password=config("TEST_PASSWORD"), role='student', email='testuser@example.com')
        refresh = RefreshToken.for_user(user)
        data = {'refresh': str(refresh)}
        serializer = CustomTokenRefreshSerializer(data=data)
        assert serializer.is_valid()
        
        access_token = serializer.validated_data['access']
        
        # Decode the access token (not the refresh token)
        decoded_token = AccessToken(access_token).payload
        
        # Assert that the custom fields are in the decoded token
        assert 'role' in decoded_token
        assert decoded_token['role'] == user.role
        assert 'is_superuser' in decoded_token
        assert decoded_token['is_superuser'] == user.is_superuser




@pytest.mark.django_db
class TestDashboardStatsSerializer:

    def test_dashboard_stats_serializer(self):
        user1 = User.objects.create_user(username='student1', password=config("TEST_PASSWORD"), role='student', email='student1@example.com')
        user2 = User.objects.create_user(username='instructor1', password=config("TEST_PASSWORD"), role='instructor', email='instructor1@example.com')
        course_data = {
            'total_users': 2,
            'total_students': 1,
            'total_instructors': 1,
            'total_courses': 0,
            'total_contents': 0,
            'total_quizzes': 0,
        }
        serializer = DashboardStatsSerializer(data=course_data)
        assert serializer.is_valid()
        stats = serializer.validated_data
        assert stats['total_users'] == 2
        assert stats['total_students'] == 1
        assert stats['total_instructors'] == 1
        assert stats['total_courses'] == 0
        assert stats['total_contents'] == 0
        assert stats['total_quizzes'] == 0
