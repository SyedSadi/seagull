from rest_framework import serializers
from .models import Post, Comment, Vote,Tag
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        
class CommentSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True, source='user')
    user = serializers.CharField(source='user.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent', 'content', 'created_at', 'updated_at','author', 'replies']

    def get_replies(self, obj):
        """ Recursively fetch nested replies. """
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []
    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request.user == obj.author


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author = serializers.PrimaryKeyRelatedField(read_only=True)  # Ensure `author` is not required for updates
    total_votes = serializers.SerializerMethodField()  # Fix total_votes
    comments = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)  
    tag_ids = serializers.ListField(write_only=True, child=serializers.IntegerField(), required=True)
      # Add this field

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'title', 'content', 'created_at', 'updated_at', 'total_votes', 'comments', 'tags', 'tag_ids']

    def get_comments(self, obj):
        """Fetch only top-level comments (parent=None)"""
        top_level_comments = obj.comments.filter(parent=None)
        return CommentSerializer(top_level_comments, many=True).data

    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tag_ids)  # Assign selected tags
        return post

    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)  # Extract tag_ids if provided

    # Update other fields
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)

        if tag_ids is not None:  # User wants to update tags
            if not tag_ids:  # Ensure at least one tag remains
                raise serializers.ValidationError({"tag_ids": ["At least one tag must be selected."]})
            if len(tag_ids) > 3:  # Enforce max limit
                raise serializers.ValidationError({"tag_ids": ["You can select a maximum of 3 tags."]})
        instance.tags.set(tag_ids)  # Update tags

        instance.save()
        return instance

    def get_total_votes(self, obj):
        """ Compute total votes dynamically """
        return obj.votes.filter(value=1).count() - obj.votes.filter(value=-1).count()


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user', 'post', 'value']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'