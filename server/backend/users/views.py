from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Instructor
from .serializers import InstructorSerializer

class InstructorViewSet(viewsets.ReadOnlyModelViewSet):  # For listing all courses
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
