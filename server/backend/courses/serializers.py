from rest_framework import serializers
from .models import Course, CourseContents, Enrollment, Rating

class CourseContentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContents
        fields = ['id', 'content_type', 'title', 'video_url', 'file_link', 'text_content']


class CourseSerializer(serializers.ModelSerializer):
    ratings = serializers.FloatField(read_only=True)
    contents = CourseContentsSerializer(many=True, read_only=True) 

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'created_by', 'duration', 'difficulty', 'subject', 'ratings', 'contents']

    def get_contents(self, obj):
        return CourseContentsSerializer(obj.contents.all(), many=True).data



