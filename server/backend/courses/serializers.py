from rest_framework import serializers
from .models import Course, CourseContents, Enrollment, Rating
from users.serializers import InstructorSerializer
from users.models import Instructor

# Serializer for individual course content (video, pdf, article)
class CourseContentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContents
        fields = '__all__'      # Automatically include all model fields

     # Custom validation to ensure appropriate data is provided based on content type
    def validate(self, data):
        content_type = data.get('content_type')

        if content_type == 'video' and not data.get('url'):
            raise serializers.ValidationError("Video content must have a URL.")
        if content_type == 'article' and not data.get('text_content'):
            raise serializers.ValidationError("For Articles Text content cannot be empty.")
        if content_type == 'pdf' and not data.get('url'):
            raise serializers.ValidationError("PDF content must include a url.")
        return data

# Serializer for the main Course model
class CourseSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(queryset=Instructor.objects.all(), write_only=True)
     # Nested representation of instructor details, read-only
    created_by_details = InstructorSerializer(source='created_by', read_only=True)
    ratings = serializers.FloatField(read_only=True)     # Average course rating
    ratings_count = serializers.SerializerMethodField()     # Total number of ratings
    contents = CourseContentsSerializer(many=True, read_only=True)  # Nested course contents

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'created_by', 'created_by_details', 'duration', 'difficulty', 'subject', 'ratings', 'contents', 'ratings_count', "image"]

     # Optional custom getter (not used currently due to read_only=True in 'contents')
    def get_contents(self, obj):
        return CourseContentsSerializer(obj.contents.all(), many=True).data

    # Returns total number of ratings for the course
    def get_ratings_count(self, obj):
        return obj.ratings_count

# Serializer for enrollments (student enrolled in a course)
class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'student', 'enrolled_at']       # Include basic enrollment fields

# Serializer for a user rating a course
class RatingSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Rating
        fields = ['rating']   # Only rating field is needed for this serializer

