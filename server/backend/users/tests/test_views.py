import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from users.models import User, Instructor
from decouple import config
from django.urls import reverse
from django.core import mail
from django.urls import reverse

@pytest.mark.django_db
class TestRegisterView:
    def test_register_user_success(self, client):
        # Setup valid data
        user_data = {
            "username": "testuser",
            "password": config('TEST_PASSWORD'),
            "email": "testuser@example.com",
            "role": "student",
        }

        # Make POST request to register endpoint
        response = client.post(reverse('register'), data=user_data, format='json')

        # Check if the user is created and response is 201 Created
        assert response.status_code == status.HTTP_201_CREATED
        assert "Registration successful" in response.data["message"]

        # Check if the user is created in the database but inactive
        user = User.objects.get(username="testuser")
        assert user.is_active is False  # User should be inactive until email verification

        # Check that an email was sent
        assert len(mail.outbox) == 1
        verification_email = mail.outbox[0]
        assert verification_email.subject == "Confirm Your Email to Get Started with KUETx"
        assert user.email in verification_email.to

    def test_register_user_invalid_data(self, client):
        # Setup invalid data (e.g., missing email)
        user_data = {
            "username": "testuser",
            "password": config('TEST_PASSWORD'),
            "role": "student",
        }

        # Make POST request to register endpoint
        response = client.post(reverse('register'), data=user_data, format='json')

        # Check that the response status is 400 Bad Request
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data  # Expect validation error for missing email

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
        assert response.data["message"] == "Registration successful! Please check your inbox (or spam folder) to verify your email address."
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


@pytest.mark.django_db
class TestProfileView:

    def setup_method(self):
        self.client = APIClient()
        self.password = config("TEST_PASSWORD")

    def test_get_profile(self):
        user = User.objects.create_user(username="testuser", password=self.password, bio="Hello there!", role="student")
        self.client.force_authenticate(user=user)

        response = self.client.get("/users/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "testuser"
        assert response.data["bio"] == "Hello there!"

    def test_put_profile_student(self):
        user = User.objects.create_user(username="student1", password=self.password, bio="Old bio", role="student")
        self.client.force_authenticate(user=user)

        updated_data = {
            "bio": "New bio"
        }

        response = self.client.put("/users/", updated_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["bio"] == "New bio"

    def test_put_profile_instructor(self):
        user = User.objects.create_user(username="instructor1", password=self.password, role="instructor")
        self.client.force_authenticate(user=user)

        updated_data = {
            "bio": "Instructor bio update",
            "instructor": {
                "designation": "Senior Lecturer",
                "university": "MIT"
            }
        }

        response = self.client.put("/users/", updated_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["bio"] == "Instructor bio update"

        instructor = Instructor.objects.get(user=user)
        assert instructor.designation == "Senior Lecturer"
        assert instructor.university == "MIT"

@pytest.mark.django_db
def test_landing_page_stats_view():
    client = APIClient()

    response = client.get("/landingpage/stats/")  # Update this path if your actual URL is different

    assert response.status_code == status.HTTP_200_OK
    assert response.data["success"] is True
    assert "data" in response.data
    assert "message" in response.data
    assert isinstance(response.data["data"], dict)
    assert "total_courses" in response.data["data"]
    assert "total_students" in response.data["data"]
    assert "total_instructors" in response.data["data"]


@pytest.mark.django_db
def test_instructor_detail_view_returns_correct_data():
    # Create a test instructor user
    instructor = Instructor.objects.create(
        user=User.objects.create_user(username="john_doe", password=config("TEST_PASSWORD"), email='john@example.com', bio='Passionate about teaching.'), 
        designation='Assistant Professor',
        university='Test University'
    )

    client = APIClient()
    url = reverse('instructor-detail', kwargs={'id': instructor.id})  
    response = client.get(url)

    assert response.status_code == 200
    data = response.json()
    assert data['id'] == instructor.id
    assert data['name'] == 'john_doe'
    assert data['email'] == 'john@example.com'
    assert data['bio'] == 'Passionate about teaching.'
    assert data['designation'] == 'Assistant Professor'
    assert data['university'] == 'Test University'

@pytest.mark.django_db
def test_instructor_detail_view_invalid_id():
    client = APIClient()
    invalid_id = 999

    url = reverse('instructor-detail', kwargs={'id': invalid_id})
    response = client.get(url)

    assert response.status_code == 404
