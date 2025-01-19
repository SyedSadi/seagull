from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Course
from .serializers import CourseSerializer, CourseContentsSerializer

class CourseViewSet(viewsets.ReadOnlyModelViewSet):  # For listing all courses
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseDetailView(generics.RetrieveAPIView):  # For retrieving a specific course
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
