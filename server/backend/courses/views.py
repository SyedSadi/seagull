from rest_framework import generics, viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Course, CourseContents, Enrollment, Rating
from .serializers import CourseSerializer, CourseContentsSerializer


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = CourseSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'subject', 'difficulty']
    
    def get_queryset(self):
        queryset = Course.objects.all()
        search_query = self.request.query_params.get('search')
        
        if not search_query:
            return queryset
            
        return queryset.filter(
            Q(title__icontains=search_query) | 
            Q(description__icontains=search_query) |
            Q(subject__icontains=search_query) |
            Q(difficulty__icontains=search_query)
        )


class CourseDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class AdminOnlyAPIView(APIView):
    """Base class for admin-only operations."""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_course_or_404(self, course_id):
        return get_object_or_404(Course, id=course_id)
        
    def handle_serializer(self, serializer, status_code=status.HTTP_200_OK):
        """Common handler for serializer validation and response."""
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status_code)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddCourseView(AdminOnlyAPIView):
    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        return self.handle_serializer(serializer, status.HTTP_201_CREATED)


class UpdateDeleteCourseView(AdminOnlyAPIView):
    def put(self, request, course_id):
        course = self.get_course_or_404(course_id)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        return self.handle_serializer(serializer)

    def delete(self, request, course_id):
        course = self.get_course_or_404(course_id)
        course.delete()
        return Response({"message": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class UserEnrollmentMixin:
    """Mixin to handle student enrollment validation."""
    def is_student_enrolled(self, user, course):
        if not hasattr(user, 'student'):
            return False
        return Enrollment.objects.filter(course=course, student=user.student).exists()


class CourseContentsView(UserEnrollmentMixin, generics.ListAPIView):
    serializer_class = CourseContentsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        course_id = self.kwargs['course_id']
        course = get_object_or_404(Course, id=course_id)

        if not self.is_student_enrolled(user, course):
            return CourseContents.objects.none()

        return CourseContents.objects.filter(course=course)


class AddContentAPIView(AdminOnlyAPIView):
    def post(self, request):
        self.get_course_or_404(request.data.get('course'))
        serializer = CourseContentsSerializer(data=request.data)
        return self.handle_serializer(serializer, status.HTTP_201_CREATED)


class UpdateContentView(AdminOnlyAPIView):
    def put(self, request, id):
        content = get_object_or_404(CourseContents, id=id)
        serializer = CourseContentsSerializer(content, data=request.data, partial=True)
        return self.handle_serializer(serializer)


class DeleteContentView(AdminOnlyAPIView):
    def delete(self, request, id):
        content = get_object_or_404(CourseContents, id=id)
        content.delete()
        return Response({'message': 'Content deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class EnrollCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        user = request.user
        if not hasattr(user, 'student'):
            return Response({"error": "Only students can enroll in courses"}, status=status.HTTP_403_FORBIDDEN)

        course = get_object_or_404(Course, id=course_id)
        _, created = Enrollment.objects.get_or_create(course=course, student=user.student)

        message = "Successfully enrolled in {}!".format(course.title) if created else "Already enrolled"
        status_code = status.HTTP_200_OK if created else status.HTTP_400_BAD_REQUEST
        
        return Response({"message": message}, status=status_code)


class EnrolledCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'student'):
            return Course.objects.none()
        
        return Course.objects.filter(enrollment__student=user.student)


class InstructorCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'instructor'):
            return Response(
                {"error": "Only instructors can view this information."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        courses = Course.objects.filter(created_by=user.instructor)
        serialized_courses = CourseSerializer(courses, many=True).data
        
        return Response({"courses": serialized_courses}, status=status.HTTP_200_OK)


class RateCourseView(UserEnrollmentMixin, APIView):
    permission_classes = [IsAuthenticated]

    def _validate_rating(self, rating_value):
        """Validate the rating value."""
        if rating_value is None:
            return None, "Rating value is required."
            
        try:
            rating_value = int(rating_value)
            if rating_value < 1 or rating_value > 5:
                return None, "Rating must be an integer between 1 and 5."
            return rating_value, None
        except (ValueError, TypeError):
            return None, "Rating must be an integer between 1 and 5."

    def post(self, request, course_id):
        course = get_object_or_404(Course, pk=course_id)
        
        if not self.is_student_enrolled(request.user, course):
            return Response(
                {"error": "You must be enrolled in this course to rate it."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        rating_value, error = self._validate_rating(request.data.get('rating'))
        if error:
            return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

        _, created = Rating.objects.update_or_create(
            course=course, 
            user=request.user, 
            defaults={'rating': rating_value}
        )
        
        message = "Rating created successfully." if created else "Rating updated successfully."
        return Response({"message": message, "rating": rating_value}, status=status.HTTP_200_OK)

    def get(self, request, course_id):
        course = get_object_or_404(Course, pk=course_id)
        rating = Rating.objects.filter(course=course, user=request.user).first()
        
        return Response(
            {"course": course.title, "rating": rating.rating if rating else 0}, 
            status=status.HTTP_200_OK
        )