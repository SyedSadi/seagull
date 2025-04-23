import pytest
from forum.models import Post, Vote, Tag
from users.models import User
from rest_framework.test import APIClient
from rest_framework import status  # Import status here

@pytest.fixture
def authenticated_client(db):
    user = User.objects.create_user(
        username="testuser",
        email="testuser@example.com",
        password="strongpassword123"
    )
    client = APIClient()
    client.force_authenticate(user=user)
    return user, client

@pytest.mark.django_db
def test_user_can_vote(authenticated_client):
    user, client = authenticated_client
    tag = Tag.objects.create(name="Python")
    post = Post.objects.create(title="Vote Test", content="Vote content", author=user)
    post.tags.add(tag)

    # User votes for the post
    response = client.post("/forum/votes/", {"post": post.id, "value": 1})
    assert response.status_code == 200
    assert Vote.objects.count() == 1
    assert response.data["message"] == "Vote updated."
    assert response.data["total_votes"] == 1
    assert response.data["user_vote"] == 1

@pytest.mark.django_db
def test_double_vote_removes_vote(authenticated_client):
    user, client = authenticated_client
    tag = Tag.objects.create(name="Flask")
    post = Post.objects.create(title="Vote", content="Vote content", author=user)
    post.tags.add(tag)

    # User votes for the post
    client.post("/forum/votes/", {"post": post.id, "value": 1})
    response = client.post("/forum/votes/", {"post": post.id, "value": 1})

    # The second vote should remove the first vote
    assert response.status_code == 200
    assert Vote.objects.count() == 0
    assert response.data["message"] == "Vote removed."
    assert response.data["total_votes"] == 0
    assert response.data["user_vote"] == 0

@pytest.mark.django_db
def test_invalid_vote_value(authenticated_client):
    user, client = authenticated_client
    tag = Tag.objects.create(name="Django")
    post = Post.objects.create(title="Invalid Vote Test", content="Content", author=user)
    post.tags.add(tag)

    # User tries to vote with an invalid value (e.g., 0)
    response = client.post("/forum/votes/", {"post": post.id, "value": 0})
    assert response.status_code == 400
    assert response.data["error"] == "Invalid vote value."

@pytest.mark.django_db
def test_vote_on_non_existent_post(authenticated_client):
    user, client = authenticated_client

    # User tries to vote on a non-existent post
    response = client.post("/forum/votes/", {"post": 99999, "value": 1})
    assert response.status_code == 404
    assert response.data["error"] == "Post not found."

@pytest.mark.django_db
def test_get_user_vote(authenticated_client):
    user, client = authenticated_client
    tag = Tag.objects.create(name="React")
    post = Post.objects.create(title="User Vote Test", content="Content for user vote", author=user)
    post.tags.add(tag)

    # User votes for the post
    client.post("/forum/votes/", {"post": post.id, "value": 1})

    # Retrieve user's vote for the post
    response = client.get(f"/forum/votes/{post.id}/user-vote/")
    assert response.status_code == 200
    assert response.data["user_vote"] == 1

@pytest.mark.django_db
def test_get_user_vote_no_vote(authenticated_client):
    user, client = authenticated_client
    tag = Tag.objects.create(name="Vue")
    post = Post.objects.create(title="No Vote Test", content="Content without vote", author=user)
    post.tags.add(tag)

    # Retrieve user's vote for the post where no vote exists
    response = client.get(f"/forum/votes/{post.id}/user-vote/")
    assert response.status_code == 200
    assert response.data["user_vote"] == 0

@pytest.mark.django_db
def test_vote_switch(authenticated_client):
    user, client = authenticated_client
    tag = Tag.objects.create(name="Angular")
    post = Post.objects.create(title="Vote Switch Test", content="Vote switch content", author=user)
    post.tags.add(tag)

    # User votes for the post with value 1
    client.post("/forum/votes/", {"post": post.id, "value": 1})

    # User changes vote to -1 (switch vote)
    response = client.post("/forum/votes/", {"post": post.id, "value": -1})
    assert response.status_code == 200
    assert Vote.objects.count() == 1
    assert response.data["message"] == "Vote updated."
    assert response.data["user_vote"] == -1
    assert response.data["total_votes"] == -1

@pytest.mark.django_db
def test_update_vote(authenticated_client):
    user, client = authenticated_client

    # Create a post for the test
    post = Post.objects.create(title="Test Post", content="This is a test post.", author=user)

    # Create an initial vote for the user on the post
    initial_vote = Vote.objects.create(user=user, post=post, value=1)

    # Now, update the vote from 1 to -1
    response = client.post(
        f"/forum/votes/", 
        {"post": post.id, "value": -1}, 
        format="json"
    )

    # Check if the status is OK and vote was updated
    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Vote updated."
    assert response.data["user_vote"] == -1  # The vote should now be -1

    # Check if the vote is actually updated in the database
    updated_vote = Vote.objects.get(id=initial_vote.id)
    assert updated_vote.value == -1  # The value should be updated to -1

@pytest.mark.django_db
def test_remove_vote(authenticated_client):
    user, client = authenticated_client

    # Create a post for the test
    post = Post.objects.create(title="Test Post", content="This is a test post.", author=user)

    # Create an initial vote for the user on the post
    initial_vote = Vote.objects.create(user=user, post=post, value=1)

    # Remove the vote by sending the same vote value again
    response = client.post(
        f"/forum/votes/", 
        {"post": post.id, "value": 1}, 
        format="json"
    )

    # Check if the status is OK and vote was removed
    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Vote removed."
    assert response.data["user_vote"] == 0  # Vote should be removed

    # Check that the vote is deleted from the database
    with pytest.raises(Vote.DoesNotExist):
        Vote.objects.get(id=initial_vote.id)  # Should raise an error because the vote is deleted
