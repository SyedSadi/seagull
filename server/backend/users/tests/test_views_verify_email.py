import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from datetime import timedelta
from django.utils import timezone
from decouple import config
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

# Get the custom user model
User = get_user_model()

@pytest.fixture
def user():
    """Create a test user."""
    return User.objects.create_user(
        username="testuser", email="testuser@example.com", password=config('TEST_PASSWORD')
    )

@pytest.fixture
def client():
    """Create an instance of the APIClient."""
    return APIClient()

@pytest.mark.django_db
def test_verify_email_valid(client, user):
    """Test successful email verification."""
    uidb64 = urlsafe_base64_encode(str(user.pk).encode())
    token = default_token_generator.make_token(user)
    url = reverse('verify-email', kwargs={'uidb64': uidb64, 'token': token})

    response = client.get(url)
    
    # Check the response status
    assert response.status_code == status.HTTP_200_OK

    # Ensure the user is now active
    user.refresh_from_db()
    assert user.is_active is True
    
    # Ensure the JWT token is in the response
    assert 'refresh' in response.data
    assert 'access' in response.data
    assert response.data['message'] == "Email verified successfully."

@pytest.mark.django_db
def test_verify_email_invalid_token(client, user):
    """Test email verification with an invalid token."""
    uidb64 = urlsafe_base64_encode(str(user.pk).encode())
    invalid_token = 'invalid-token'
    url = reverse('verify-email', kwargs={'uidb64': uidb64, 'token': invalid_token})

    response = client.get(url)

    # Check the response status and error message
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['error'] == "Invalid or expired token"

@pytest.mark.django_db
def test_verify_email_user_already_verified(client, user):
    """Test verifying an already verified user."""
    uidb64 = urlsafe_base64_encode(str(user.pk).encode())
    user.is_active = True  # Simulate the user is already active
    user.save()

    token = default_token_generator.make_token(user)
    url = reverse('verify-email', kwargs={'uidb64': uidb64, 'token': token})

    response = client.get(url)

    # Check that the user was not re-verified and the response is correct
    assert response.status_code == status.HTTP_200_OK
    assert response.data['message'] == "Email verified successfully."

@pytest.mark.django_db
class TestVerifyEmailAPIView:

    def setup_method(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(username='testuser', password='password123', email='test@example.com')
        self.uidb64 = self.encode_uid(self.user.pk)
        self.token = 'validtoken' 

    def encode_uid(self, uid):
        return urlsafe_base64_encode(force_bytes(uid)) 

    def test_invalid_uid(self):
        invalid_uidb64 = 'invalidbase64uid'
        url = reverse('verify-email', kwargs={'uidb64': invalid_uidb64, 'token': self.token})
        response = self.client.get(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['error'] == 'Invalid or expired link'

    def test_user_does_not_exist(self):
        invalid_uidb64 = self.encode_uid(9999) 
        url = reverse('verify-email', kwargs={'uidb64': invalid_uidb64, 'token': self.token})
        response = self.client.get(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['error'] == 'Invalid or expired link'

    def test_invalid_token(self):
        invalid_token = 'invalidtoken'
        url = reverse('verify-email', kwargs={'uidb64': self.uidb64, 'token': invalid_token})
        response = self.client.get(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['error'] == 'Invalid or expired token'

    def test_django_unicode_decode_error(self):
        invalid_uidb64 = '?????'  
        url = reverse('verify-email', kwargs={'uidb64': invalid_uidb64, 'token': self.token})
        response = self.client.get(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['error'] == 'Invalid or expired link'