import pytest
from rest_framework import status
from rest_framework.test import APIClient
from users.models import User 
from forum.models import Tag


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
@pytest.mark.django_db
def test_search_tags(authenticated_client):
    client, user = authenticated_client

    # Create some tags for testing
    Tag.objects.create(name="Python")
    Tag.objects.create(name="Django")
    Tag.objects.create(name="JavaScript")

    # Test searching with query 'Dja' which should match 'Django'
    response = client.get("/forum/tags/search/?q=Dja")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['name'] == 'Django'

@pytest.mark.django_db
def test_search_no_match(authenticated_client):
    client, user = authenticated_client

    # Create some tags for testing
    Tag.objects.create(name="Python")
    Tag.objects.create(name="Django")
    Tag.objects.create(name="JavaScript")

    # Test searching with a query that doesn't match any tags
    response = client.get("/forum/tags/search/?q=Ruby")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 0  # No tags should match

@pytest.mark.django_db
def test_search_empty_query(authenticated_client):
    client, user = authenticated_client

    # Test with an empty query
    response = client.get("/forum/tags/search/?q=")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 0  # Should return empty list when no query is provided
