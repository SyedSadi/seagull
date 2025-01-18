from rest_framework import serializers
from .models import Course, CourseContents

class CourseContentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContents
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    contents = CourseContentsSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
