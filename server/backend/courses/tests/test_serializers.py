import pytest
from courses.models import Course, CourseContents, Instructor, Student, Enrollment, Rating
from users.models import User, Instructor as UserInstructor
from courses.serializers import CourseSerializer, CourseContentsSerializer, EnrollmentSerializer, RatingSerializer
from decouple import config

@pytest.mark.django_db
class TestCourseSerializer:

    def test_course_serializer_valid_data(self):
        # Create instructor
        instructor = UserInstructor.objects.create(user=User.objects.create_user(username="inst1", password=config("TEST_PASSWORD")))
        
        # Create course
        course = Course.objects.create(
            title="Test Course",
            description="Test Course Description",
            created_by=instructor,
            duration=10,
            difficulty="beginner",
            subject="Math"
        )
        
        serializer = CourseSerializer(course)
        assert serializer.data["title"] == "Test Course"
        assert serializer.data["description"] == "Test Course Description"
        assert "ratings" in serializer.data  # ratings should be calculated automatically
        assert "ratings_count" in serializer.data
        assert len(serializer.data["contents"]) == 0  # Initially no content

    def test_course_serializer_invalid_data(self):
        # Missing required fields like title should raise ValidationError
        invalid_data = {}
        serializer = CourseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        assert "title" in serializer.errors

@pytest.mark.django_db
class TestCourseContentsSerializer:

    def test_course_contents_serializer_valid(self):
        course = Course.objects.create(title="Test Course", description="Test", created_by=Instructor.objects.first(), duration=10, difficulty="beginner", subject="Math")
        content = CourseContents.objects.create(
            course=course,
            content_type="video",
            title="Intro Video",
            url="https://example.com/video.mp4",
            text_content=""
        )
        
        serializer = CourseContentsSerializer(content)
        assert serializer.data["title"] == "Intro Video"
        assert serializer.data["content_type"] == "video"
        assert serializer.data["url"] == "https://example.com/video.mp4"
        assert serializer.data["text_content"] == ""


@pytest.mark.django_db
class TestEnrollmentSerializer:

    def test_enrollment_serializer_valid(self):
        user = User.objects.create_user(username="student1", password=config("TEST_PASSWORD"))
        student = Student.objects.create(user=user)
        instructor = Instructor.objects.create(user=User.objects.create_user(username="inst1", password=config("TEST_PASSWORD")))
        course = Course.objects.create(
            title="Math 101",
            description="Basic Math",
            created_by=instructor,
            duration=10,
            difficulty="beginner",
            subject="Math"
        )
        
        enrollment = Enrollment.objects.create(course=course, student=student)
        serializer = EnrollmentSerializer(enrollment)
        
        assert serializer.data["course"] == course.id
        assert serializer.data["student"] == student.id
        assert "enrolled_at" in serializer.data


@pytest.mark.django_db
class TestRatingSerializer:

    def test_rating_serializer_valid(self):
        user = User.objects.create_user(username="student2", password=config("TEST_PASSWORD"))
        student = Student.objects.create(user=user)
        instructor = Instructor.objects.create(user=User.objects.create_user(username="inst2", password=config("TEST_PASSWORD")))
        course = Course.objects.create(
            title="Science 101",
            description="Basic Science",
            created_by=instructor,
            duration=10,
            difficulty="beginner",
            subject="Science"
        )

        # Enroll student before rating
        Enrollment.objects.create(course=course, student=student)
        rating = Rating.objects.create(course=course, user=user, rating=5)

        serializer = RatingSerializer(rating)
        assert serializer.data["rating"] == 5
