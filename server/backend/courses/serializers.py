from rest_framework import serializers
from .models import Course, CourseContents, Enrollment, Rating

class CourseContentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContents
        fields = '__all__'

    def validate(self, data):
        content_type = data.get('content_type')

        if content_type == 'video' and not data.get('url'):
            raise serializers.ValidationError("Video content must have a URL.")
        if content_type == 'article' and not data.get('text_content'):
            raise serializers.ValidationError("For Articles Text content cannot be empty.")
        if content_type == 'pdf' and not data.get('url'):
            raise serializers.ValidationError("PDF content must include a url.")
        return data


class CourseSerializer(serializers.ModelSerializer):
    ratings = serializers.FloatField(read_only=True)
    ratings_count = serializers.SerializerMethodField()
    contents = CourseContentsSerializer(many=True, read_only=True) 

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'created_by', 'duration', 'difficulty', 'subject', 'ratings', 'contents', 'ratings_count', "image"]

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

