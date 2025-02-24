from rest_framework import serializers
from .models import Post, Comment, Vote

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent', 'content', 'created_at', 'updated_at', 'replies']

    def validate(self, data):
        post = data.get('post')
        parent = data.get('parent')

        # Ensure that a comment must have a post
        if not post:
            raise serializers.ValidationError("A comment must have a post.")

        # If parent is provided, ensure it belongs to the same post
        if parent:
            if parent.post != post:
                raise serializers.ValidationError("The parent comment must belong to the same post.")

        return data

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data
class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    total_votes = serializers.IntegerField( read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'title', 'content', 'created_at', 'updated_at', 'total_votes', 'comments']

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user', 'post', 'value']
