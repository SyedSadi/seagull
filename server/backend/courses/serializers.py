from rest_framework import serializers
from .models import Course, CourseContents, Enrollment, Rating

class CourseContentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContents
        fields = ['id', 'content_type', 'title', 'url', 'text_content']


class CourseSerializer(serializers.ModelSerializer):
    ratings = serializers.FloatField(read_only=True)
    ratings_count = serializers.SerializerMethodField()
    contents = CourseContentsSerializer(many=True, read_only=True) 

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'created_by', 'duration', 'difficulty', 'subject', 'ratings', 'contents', 'ratings_count']

    def get_contents(self, obj):
        return CourseContentsSerializer(obj.contents.all(), many=True).data
    
    def get_ratings_count(self, obj):
        return obj.ratings_count


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'student', 'enrolled_at']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['rating']

