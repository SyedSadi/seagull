from rest_framework import serializers
from .models import Instructor

class InstructorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.username', read_only=True)  # Get name from User model

    class Meta:
        model = Instructor
        fields = ['id', 'name', 'designation', 'university']

