import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from forum.models import Post, Tag
from users.models import User
from unittest.mock import patch

# =======================
# Fixture for authentication
# =======================
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
@pytest.fixture
def test_tag(db):
    return Tag.objects.create(name="TestTag")


# =======================
# Test class for post views
# =======================
@pytest.mark.django_db
class TestPostViews:

    def test_create_post_with_tags(self, authenticated_client,test_tag):
        client, user = authenticated_client

        data = {
            "title": "My First Post",
            "content": "This is some cool content",
            "tag_ids": [test_tag.id],
        }

        response = client.post(reverse('post-list'), data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "My First Post"
        assert "id" in response.data

    def test_create_post_without_authentication(self):
        client = APIClient()

        data = {
            "title": "Unauthorized Post",
            "content": "Should fail",
            "tag_ids": [],
        }

        response = client.post(reverse('post-list'), data, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    def test_update_post(self, authenticated_client,test_tag):
        client, user = authenticated_client
        post = Post.objects.create(
            title="Old Post",
            content="This is an old post",
            author=user,
        )
        updated_data = {
            "title": "Updated Post",
            "content": "Updated content",
            "tag_ids": [test_tag.id],
        }

        with patch("forum.views.detect_toxic_content", return_value=[{"label": "non-toxic", "score": 0.5}]):
            response = client.put(reverse("post-detail", args=[post.id]), updated_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated Post"

    def test_delete_post(self, authenticated_client):
        client, user = authenticated_client
        post = Post.objects.create(
            title="Post to Delete",
            content="Content of the post",
            author=user,
        )

        response = client.delete(reverse('post-detail', args=[post.id]))

        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_post_with_toxic_content(self, authenticated_client,test_tag):
        client, user = authenticated_client
        toxic_data = {
            "title": "Toxic Post",
            "content": "kill all humans",
            "tag_ids": [test_tag.id],
        }

        with patch("forum.views.detect_toxic_content", return_value=[{"label": "toxic", "score": 0.99}]):
            response = client.post(reverse("post-list"), toxic_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "toxic" in str(response.data[0])  # or check exact string if needed

