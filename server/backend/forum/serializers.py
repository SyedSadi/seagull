from rest_framework import serializers
from .models import Post, Comment, Vote,Tag

# Serializer for the Tag model
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

# Serializer for the Comment model
# Includes support for nested/threaded comments (MPTT) 
class CommentSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True, source='user')      # for identifying author in write operations
    user = serializers.CharField(source='user.username', read_only=True)    # for displaying username in read operations
    parent_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)      # for creating a reply to a comment
    parent = serializers.PrimaryKeyRelatedField(read_only=True)      # nested parent reference
    depth = serializers.SerializerMethodField()   # shows comment depth in the tree
    children = serializers.SerializerMethodField()   # serializes children comments (replies)
    is_owner = serializers.SerializerMethodField()  # indicates if the logged-in user is the comment author

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent_id','parent', 'content', 'created_at', 'updated_at', 'author', 'depth','children', 'is_owner']
        
    def get_depth(self, obj):
        # Returns the comment depth using MPTT's `level`
        return obj.level  # MPTT `level` field

    def get_is_owner(self, obj):
        # Checks if the current user is the comment's owner
        request = self.context.get("request")
        return request.user == obj.user if request else False
    def get_children(self, obj):
        # Recursively serializes child comments
        children = obj.children.all()
        return CommentSerializer(children, many=True, context=self.context).data if children else []

# Serializer for the Post model
# Supports tagging, vote count, and author info
class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)    # display username
    author = serializers.PrimaryKeyRelatedField(read_only=True)  # store author reference
    total_votes = serializers.SerializerMethodField()   # total upvotes - downvotes
    tags = TagSerializer(many=True, read_only=True)     # nested tag data (read-only)
    tag_ids = serializers.ListField(write_only=True, child=serializers.IntegerField(), required=True)   # tag IDs input

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'title', 'content', 'created_at', 'updated_at', 'total_votes', 'tags', 'tag_ids']

    def create(self, validated_data):
        # Handles tag assignment while creating a new post
        tag_ids = validated_data.pop('tag_ids', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tag_ids)  
        return post

    def update(self, instance, validated_data):
        # Handles post update and optional tag reassignment
        tag_ids = validated_data.pop('tag_ids', None)

        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)

        if tag_ids is not None:
            instance.tags.set(tag_ids)

        instance.save()
        return instance


    def get_total_votes(self, obj):
         # Calculates total score: upvotes - downvotes
        return obj.votes.filter(value=1).count() - obj.votes.filter(value=-1).count()

    def validate_tag_ids(self, value):
        # Custom validation to restrict number of tags
        if not value:
            raise serializers.ValidationError("At least one tag must be selected.")
        if len(value) > 3:
            raise serializers.ValidationError("You can assign a maximum of 3 tags.")
        return value


# Serializer for Vote model
# Allows creating and retrieving votes (upvote/downvote)
class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user', 'post', 'value']

