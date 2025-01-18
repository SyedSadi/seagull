from django.shortcuts import render
from rest_framework import viewsets
from .models import Course, CourseContents
from .serializers import CourseSerializer, CourseContentsSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseContentsViewSet(viewsets.ModelViewSet):
    queryset = CourseContents.objects.all()
    serializer_class = CourseContentsSerializer
