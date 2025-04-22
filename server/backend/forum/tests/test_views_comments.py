import pytest
from django.urls import reverse
from forum.models import Post, Comment, Tag
from unittest.mock import patch
from users.models import User
from rest_framework.test import APIClient
from rest_framework import status

@pytest.fixture
def authenticated_client(db, django_user_model):
    user = django_user_model.objects.create_user(username="testuser", password="password")
    client = APIClient()
    client.force_authenticate(user=user)
    return user, client

@pytest.mark.django_db
def test_create_comment(authenticated_client, mocker):
    user, client = authenticated_client
    tag = Tag.objects.create(name="Django")
    post = Post.objects.create(title="Hello", content="World", author=user)
    post.tags.add(tag)

    mocker.patch("forum.views.detect_toxic_content", return_value=[{"label": "neutral", "score": 0.1}])

    data = {
        "post": post.id,
        "content": "Nice post!"
    }
    response = client.post(reverse("comment-list"), data)

    assert response.status_code == 201
    assert Comment.objects.count() == 1
    assert Comment.objects.first().content == "Nice post!"


@pytest.mark.django_db
def test_toxic_comment_blocked(authenticated_client, mocker):
    user, client = authenticated_client
    post = Post.objects.create(title="Test Post", content="Test content", author=user)

    mocker.patch("forum.views.detect_toxic_content", return_value=[{"label": "insult", "score": 0.91}])

    data = {
        "post": post.id,
        "content": "You're stupid!"
    }
    response = client.post(reverse("comment-list"), data)

    assert response.status_code == 400
    assert "flagged" in str(response.data) or "revise" in str(response.data)


@pytest.mark.django_db
def test_update_comment_blocked_if_toxic(authenticated_client, mocker):
    user, client = authenticated_client
    post = Post.objects.create(title="Test", content="Test content", author=user)
    comment = Comment.objects.create(post=post, user=user, content="Initial comment")

    mocker.patch("forum.views.detect_toxic_content", return_value=[{"label": "toxic", "score": 0.85}])

    url = reverse("comment-detail", args=[comment.id])
    response = client.put(url, {"content": "You suck!", "post": post.id})

    assert response.status_code == 400
    assert "flagged" in str(response.data)


@pytest.mark.django_db
def test_update_comment_success(authenticated_client, mocker):
    user, client = authenticated_client
    post = Post.objects.create(title="Post", content="Test", author=user)
    comment = Comment.objects.create(post=post, user=user, content="Old comment")

    mocker.patch("forum.views.detect_toxic_content", return_value=[{"label": "neutral", "score": 0.2}])

    url = reverse("comment-detail", args=[comment.id])
    response = client.put(url, {"content": "Updated comment", "post": post.id})

    assert response.status_code == 200
    assert response.data["content"] == "Updated comment"


@pytest.mark.django_db
def test_delete_comment_by_author(authenticated_client):
    user, client = authenticated_client
    post = Post.objects.create(title="Post", content="Post content", author=user)
    comment = Comment.objects.create(post=post, user=user, content="To be deleted")

    url = reverse("comment-detail", args=[comment.id])
    response = client.delete(url)

    assert response.status_code == 204
    assert Comment.objects.count() == 0



@pytest.mark.django_db
def test_delete_comment_denied_for_non_author(authenticated_client):
    user1, client1 = authenticated_client
    user2 = User.objects.create_user(username="other", email="other@example.com", password="password123")
    post = Post.objects.create(title="Post", content="Post content", author=user1)
    comment = Comment.objects.create(post=post, user=user1, content="Can't delete me")

    # Authenticate as user2 (who is not the author of the comment)
    from rest_framework.test import APIClient
    client2 = APIClient()
    client2.force_authenticate(user=user2)

    url = reverse("comment-detail", args=[comment.id])
    response = client2.delete(url)

    assert response.status_code == 403
    assert response.data["detail"] == "You do not have permission to perform this action."

