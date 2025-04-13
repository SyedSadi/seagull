import pytest
from forum.models import Tag, Post, Comment, Vote
from users.models import User
from decouple import config

@pytest.mark.django_db
class TestModels:

    def test_tag_creation(self):
        tag = Tag.objects.create(name="Django")
        assert tag.name == "Django"
        assert str(tag) == "Django"

    def test_post_creation(self):
        user = User.objects.create_user(username="testuser", password=config("TEST_PASSWORD"))
        tag = Tag.objects.create(name="Python")
        post = Post.objects.create(author=user, title="Test Post", content="Test Content")
        post.tags.add(tag)
        
        assert post.author == user
        assert post.title == "Test Post"
        assert post.content == "Test Content"
        assert post.tags.count() == 1
        assert str(post) == "Test Post"

    def test_comment_creation(self):
        user = User.objects.create_user(username="commenter", password=config("TEST_PASSWORD"))
        post = Post.objects.create(author=user, title="Another Post", content="More Content")
        comment = Comment.objects.create(user=user, post=post, content="Nice post!")

        assert comment.user == user
        assert comment.post == post
        assert comment.content == "Nice post!"
        assert str(comment) == f"Comment by {user} on {post}"

    def test_comment_reply(self):
        user = User.objects.create_user(username="replier", password=config("TEST_PASSWORD"))
        post = Post.objects.create(author=user, title="Main Post", content="Main Content")
        parent_comment = Comment.objects.create(user=user, post=post, content="Parent comment")
        reply_comment = Comment.objects.create(user=user, post=post, content="Reply comment", parent=parent_comment)

        assert reply_comment.parent == parent_comment
        assert reply_comment.post == post

    def test_vote_creation(self):
        user = User.objects.create_user(username="voter", password=config("TEST_PASSWORD"))
        post = Post.objects.create(author=user, title="Vote Post", content="Vote Content")
        vote = Vote.objects.create(user=user, post=post, value=1)

        assert vote.user == user
        assert vote.post == post
        assert vote.value == 1

    def test_total_votes(self):
        user1 = User.objects.create_user(username="user1", password=config("TEST_PASSWORD"))
        user2 = User.objects.create_user(username="user2", password=config("TEST_PASSWORD"))
        post = Post.objects.create(author=user1, title="Voting Post", content="Vote please!")

        Vote.objects.create(user=user1, post=post, value=1)
        Vote.objects.create(user=user2, post=post, value=-1)

        assert post.total_votes() == 0  # 1 - 1 = 0

