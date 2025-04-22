import pytest
from forum.models import Post, Comment, Vote, Tag
from users.models import User
from forum.serializers import PostSerializer, CommentSerializer, VoteSerializer


@pytest.mark.django_db
def test_post_serializer_create():
    user = User.objects.create_user(username='tester', password='testpass')
    tag1 = Tag.objects.create(name='django')
    tag2 = Tag.objects.create(name='rest')

    data = {
        'title': 'Test Post',
        'content': 'Some content',
        'tag_ids': [tag1.id, tag2.id],
    }
    serializer = PostSerializer(data=data, context={'request': None})
    assert serializer.is_valid(), serializer.errors

    post = serializer.save(author=user)
    assert post.title == 'Test Post'
    assert post.tags.count() == 2


@pytest.mark.django_db
def test_post_serializer_tag_limit_validation():
    user = User.objects.create_user(username='tester', password='testpass')
    tags = [Tag.objects.create(name=f'tag{i}') for i in range(4)]
    
    data = {
        'title': 'Test Post',
        'content': 'Some content',
        'tag_ids': [tag.id for tag in tags],  # 4 tags
    }

    serializer = PostSerializer(data=data, context={'request': None})
    assert not serializer.is_valid()
    assert 'tag_ids' in serializer.errors


@pytest.mark.django_db
def test_comment_serializer_nested_children():
    user = User.objects.create_user(username='commenter', password='testpass')
    post = Post.objects.create(title='Test', content='test content', author=user)
    parent_comment = Comment.objects.create(post=post, user=user, content='parent')
    child_comment = Comment.objects.create(post=post, user=user, content='child', parent=parent_comment)

    serializer = CommentSerializer(parent_comment, context={'request': None})
    children = serializer.data['children']
    assert isinstance(children, list)
    assert len(children) == 1
    assert children[0]['content'] == 'child'


@pytest.mark.django_db
def test_vote_serializer():
    user = User.objects.create_user(username='voter', password='testpass')
    post = Post.objects.create(title='Vote Test', content='...', author=user)
    vote = Vote.objects.create(user=user, post=post, value=1)

    serializer = VoteSerializer(vote)
    data = serializer.data
    assert data['value'] == 1
    assert data['post'] == post.id
    assert data['user'] == user.id


@pytest.mark.django_db
def test_post_serializer_update_valid():
    user = User.objects.create_user(username='tester', password='testpass')
    tags = [Tag.objects.create(name=f'tag{i}') for i in range(2)]
    post = Post.objects.create(author=user, title='Old Title', content='Old content')
    post.tags.set(tags)

    new_tag = Tag.objects.create(name='newtag')
    data = {
        'title': 'New Title',
        'content': 'Updated content',
        'tag_ids': [new_tag.id]
    }

    serializer = PostSerializer(post, data=data, context={'request': None})
    assert serializer.is_valid(), serializer.errors
    updated_post = serializer.save()
    
    assert updated_post.title == 'New Title'
    assert updated_post.content == 'Updated content'
    assert list(updated_post.tags.all()) == [new_tag]


@pytest.mark.django_db
def test_post_serializer_total_votes():
    user = User.objects.create_user(username='voter', password='testpass')
    post = Post.objects.create(title='Vote Count', content='...', author=user)

    Vote.objects.create(user=user, post=post, value=1)
    Vote.objects.create(user=User.objects.create_user(username='voter2'), post=post, value=-1)
    Vote.objects.create(user=User.objects.create_user(username='voter3'), post=post, value=1)

    serializer = PostSerializer(post)
    assert serializer.data['total_votes'] == 1  # (2 - 1)


# ✅ NEW TEST: No tags on update
@pytest.mark.django_db
def test_post_serializer_update_with_no_tags():
    user = User.objects.create_user(username='tester', password='testpass')
    initial_tag = Tag.objects.create(name='initial')
    post = Post.objects.create(title='Initial', content='Initial content', author=user)
    post.tags.add(initial_tag)

    data = {
        'title': 'Updated title',
        'content': 'Updated content',
        'tag_ids': []  # This should trigger validation error
    }

    serializer = PostSerializer(post, data=data, context={'request': None})
    assert not serializer.is_valid()
    assert 'tag_ids' in serializer.errors
    assert serializer.errors['tag_ids'][0] == "At least one tag must be selected."
