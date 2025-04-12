import pytest
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from users.models import User
from users.serializers import CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer, DashboardStatsSerializer

@pytest.mark.django_db
class TestCustomTokenSerializers:

    def test_custom_token_obtain_pair_serializer(self):
        user = User.objects.create_user(username='testuser', password='testpass123', role='student', email='testuser@example.com')
        serializer = CustomTokenObtainPairSerializer(data={'username': 'testuser', 'password': 'testpass123'})
        assert serializer.is_valid()
        
        token = serializer.validated_data['access']
        
        # Decode the access token
        decoded_token = AccessToken(token).payload
        
        # Assert that the custom fields are in the decoded token
        assert 'role' in decoded_token
        assert decoded_token['role'] == user.role
        assert 'is_superuser' in decoded_token
        assert decoded_token['is_superuser'] == user.is_superuser

    def test_custom_token_refresh_serializer(self):
        user = User.objects.create_user(username='testuser', password='testpass123', role='student', email='testuser@example.com')
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
        user1 = User.objects.create_user(username='student1', password='testpass123', role='student', email='student1@example.com')
        user2 = User.objects.create_user(username='instructor1', password='testpass123', role='instructor', email='instructor1@example.com')
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
