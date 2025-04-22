import pytest
from rest_framework import status
from rest_framework.test import APIClient
from users.models import User 


@pytest.fixture
def authenticated_client(db):
    user = User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="testpass123",
        role="student"
    )
    client = APIClient()
    client.force_authenticate(user=user)
    return client, user

@pytest.mark.django_db
def test_create_tag(authenticated_client):
    client, user = authenticated_client
    response = client.post("/forum/tags/", {"name": "Django"})
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["name"].lower() == "django"

@pytest.mark.django_db
def test_duplicate_tag_returns_existing(authenticated_client):
    client, user = authenticated_client
    client.post("/forum/tags/", {"name": "django"})
    response = client.post("/forum/tags/", {"name": "Django"})  # case-insensitive match
    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"].lower() == "django"
