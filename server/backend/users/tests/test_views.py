import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from users.models import User
from decouple import config

@pytest.mark.django_db
class TestAuthViews:
    client = APIClient()
    def test_register_view(self):
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': config("TEST_PASSWORD"),
            'role': 'student',
        }
        response = self.client.post('/register/', data, format='json')        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'user' in response.data
        assert 'refresh' in response.data
        assert 'access' in response.data
        user = User.objects.get(username='testuser')
        assert user.email == 'testuser@example.com'

    def test_login_view(self):
        data = {
            'username': 'testuser',
            'password': config("TEST_PASSWORD"),
        }
        user = User.objects.create_user(username='testuser', password=config("TEST_PASSWORD"), email='testuser@example.com', role='student')

        response = self.client.post('/login/', data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert 'refresh' in response.data
        assert 'access' in response.data
        assert 'user' in response.data

    def test_logout_view(self):
        user = User.objects.create_user(username='testuser', password=config("TEST_PASSWORD"), email='testuser@example.com', role='student')
        
        # Generate refresh token
        refresh_token = str(RefreshToken.for_user(user))
        response = self.client.post('/logout/', {'refresh': refresh_token}, format='json')
        
        assert response.status_code == status.HTTP_205_RESET_CONTENT
        assert response.data.get("message") == "Logout successful"

    def test_logout_view_no_token(self):
        response = self.client.post('/logout/', {}, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get("error") == "Refresh token is required"

    def test_dashboard_stats_view(self):
        admin_user = User.objects.create_superuser(username='adminuser', password=config("TEST_PASSWORD"), email='admin@example.com')        
        self.client.force_authenticate(user=admin_user)

        response = self.client.get('/dashboard/stats/', format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'success' in response.data
        assert response.data.get('success') is True
        assert 'data' in response.data
        assert 'total_users' in response.data['data']
        assert 'total_students' in response.data['data']

    def test_dashboard_stats_view_no_permission(self):
        normal_user = User.objects.create_user(username='normaluser', password=config("TEST_PASSWORD"), email='normal@example.com')
        self.client.force_authenticate(user=normal_user)

        response = self.client.get('/dashboard/stats/', format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert 'detail' in response.data
        assert response.data['detail'] == 'You do not have permission to perform this action.'

@pytest.mark.django_db
class TestInstructorViewSet:

    def test_instructor_viewset(self) -> None:
        user = User.objects.create_user(username='instructoruser', password=config("TEST_PASSWORD"), email='instructor@example.com', role='instructor')
        # No need to store instructor reference if not used

        client = APIClient()
        # Optional: Authenticate with the instructor
        # client.force_authenticate(user=user)
        response = client.get('/users/instructors/', format='json')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0
        assert 'id' in response.data[0]
        assert 'name' in response.data[0]
        assert response.data[0]['name'] == user.username
