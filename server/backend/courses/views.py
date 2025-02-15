from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Course
from .serializers import CourseSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

class CourseViewSet(viewsets.ReadOnlyModelViewSet):  # For listing all courses
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseDetailView(generics.RetrieveAPIView):  # For retrieving a specific course
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

@api_view(['POST'])
def add_course(request):
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
