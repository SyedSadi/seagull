from rest_framework import serializers
from .models import Post, Comment, Vote,Tag
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent', 'content', 'created_at', 'updated_at', 'replies']

    def get_replies(self, obj):
        """ Recursively fetch nested replies. """
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    total_votes = serializers.IntegerField(read_only=True)
    comments = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)  # Include tag details
    tag_ids = serializers.ListField(write_only=True, child=serializers.IntegerField(), required=False)  # Accept tag IDs in request

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'title', 'content', 'created_at', 'updated_at', 'total_votes', 'comments','tags', 'tag_ids',]

    def get_comments(self, obj):
        """Fetch only top-level comments (parent=None)"""
        top_level_comments = obj.comments.filter(parent=None)
        return CommentSerializer(top_level_comments, many=True).data
    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tag_ids)  # Assign selected tags
        return post



class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user', 'post', 'value']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'