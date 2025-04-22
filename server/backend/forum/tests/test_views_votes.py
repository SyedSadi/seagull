# import pytest
# from forum.models import Post, Vote, Tag

# @pytest.mark.django_db
# def test_user_can_vote(authenticated_client):
#     user, client = authenticated_client
#     tag = Tag.objects.create(name="Python")
#     post = Post.objects.create(title="Vote Test", content="Vote content", author=user)
#     post.tags.add(tag)

#     response = client.post("/api/votes/", {"post": post.id, "value": 1})
#     assert response.status_code == 200
#     assert Vote.objects.count() == 1

# @pytest.mark.django_db
# def test_double_vote_removes_vote(authenticated_client):
#     user, client = authenticated_client
#     tag = Tag.objects.create(name="Flask")
#     post = Post.objects.create(title="Vote", content="Vote content", author=user)
#     post.tags.add(tag)

#     client.post("/api/votes/", {"post": post.id, "value": 1})
#     response = client.post("/api/votes/", {"post": post.id, "value": 1})
#     assert response.status_code == 200
#     assert Vote.objects.count() == 0
