from rest_framework import serializers
from .models import Post, Comment, Vote,Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        
class CommentSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True, source='user')
    user = serializers.CharField(source='user.username', read_only=True)
    parent_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    parent = serializers.PrimaryKeyRelatedField(read_only=True)
    depth = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent_id','parent', 'content', 'created_at', 'updated_at', 'author', 'depth','children', 'is_owner']
        
    def get_depth(self, obj):
        return obj.level  # MPTT `level` field

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request.user == obj.user if request else False
    def get_children(self, obj):
        children = obj.children.all()
        return CommentSerializer(children, many=True, context=self.context).data if children else []


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    total_votes = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)  
    tag_ids = serializers.ListField(write_only=True, child=serializers.IntegerField(), required=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'title', 'content', 'created_at', 'updated_at', 'total_votes', 'tags', 'tag_ids']

    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tag_ids)  
        return post

    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)

        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)

        if tag_ids is not None:
            if not tag_ids:
                raise serializers.ValidationError({"tag_ids": ["At least one tag must be selected."]})
            if len(tag_ids) > 3:
                raise serializers.ValidationError({"tag_ids": ["You can select a maximum of 3 tags."]})
            instance.tags.set(tag_ids)

        instance.save()
        return instance

    def get_total_votes(self, obj):
        return obj.votes.filter(value=1).count() - obj.votes.filter(value=-1).count()
    def validate_tag_ids(self, value):
    if len(value) > 3:
        raise serializers.ValidationError("You can assign a maximum of 3 tags.")
    return value



class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user', 'post', 'value']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'